import { Nft } from "@_types/nft";
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }
        return nfts;
      }
    );

    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result = await contract?.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });

          await toast.promise(result!.wait(), {
            pending: "Processing transaction",
            success: "NFT is yours! Please check it your profile page.",
            error: "Processing error",
          });
        } catch (error) {
          console.error(error);
        }
      },
      [contract]
    );

    return {
      ...swr,
      buyNft,
      data: data || [],
    };
  };
