import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;

type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: P
) => CryptoSWRResponse<D, R>;

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (deps: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};

// export type CryptoHookFactory<D = any, P = any> = {
//   (deps: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>;
// };
