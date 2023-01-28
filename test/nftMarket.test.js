// const { before, describe, it } = require("node:test"); 
// DO NOT import anything! This test will run with trfulle command!


// artifact is provided by truffle
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
    console.log("accounts :", accounts);
  })

  describe("Mint token function test", () => {
    const tokenURI = "https://test.com"
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0], // using first account.Can be another account
        value: _listingPrice,
      })
    })

    it("owner of first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      // assert(owner === accounts[0], "Owner of token is not matching address[0].")
      assert.equal(owner, accounts[0], "Owner of token is not matching address[0].")
    })

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      // console.log("tokenURI :", actualTokenURI);
      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set.")
    })

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0]
        }) // should throw exception
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI.")
      }
    })

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      console.log("listedItemCount :", listedItemCount);
      console.log("listedItemCount toString :", listedItemCount.toString());
      assert.equal(listedItemCount, 1, "Listed item count is not 1.")
    })

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);
      console.log("nftItem :", nftItem);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1.")
      assert.equal(nftItem.price, _nftPrice, "Pice is not correct.")
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0].")
      assert.equal(nftItem.isListed, true, "Token id not listed.")
    })

  })

  describe("Buy NFT function test", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1], // using first account.Can be another account
        value: _nftPrice,
      })
    })

    it("Should unlist the item.", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed.")
    })

    it("Should decrease listed item count.", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 0, "Count has not een decrement.")
    })

    it("Should change the owner.", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Owner is the same.")
    })

  })

  describe("Token transfer function test", () => {
    const tokenURI = "https//test-json-2.com"
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0], // using first account.Can be another account
        value: _listingPrice,
      })
    })

    it("Should have two NFTs created.", async () => {
      const totakSupply = await _contract.totalSupply();
      assert.equal(totakSupply.toNumber(), 2, "Token supply of token is not correct.")
    })

    it("Should be able to retreive nft by index.", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);
      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong.")
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong.")
    })

    it("Should have one listed NFT.", async () => {
      const allNfts = await _contract.getAllftgsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id.")
    })

    it("account[1] Should have one owned NFT.", async () => {
      const ownedNft = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNft[0].tokenId, 1, "Nft has a wrong id.")
    })

    it("account[0] Should have one owned NFT.", async () => {
      const ownedNft = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNft[0].tokenId, 2, "Nft has a wrong id.")
    })

  })


  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(
        accounts[0], // using first account.Can be another account
        accounts[1],
        2
      )
    })

    it("account[0] Should own 0 token.", async () => {
      const ownedNft = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNft.length, 0, "Invalid length of token.")
    })

    it("account[1] Should own 2 tokens.", async () => {
      const ownedNft = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNft.length, 2, "Invalid length of token.")
    })

  })


  describe("List NFTs", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1], value: _listingPrice
      })
    })

    it("Should have two listed items.", async () => {
      const listedNfts = await _contract.getAllftgsOnSale();
      assert.equal(listedNfts.length, 2, "Invalid length of NFTs.")
    })

    it("Should set new listing price.", async () => {
      await _contract.setListingPrice(_listingPrice);

      const listingPrice = await _contract.listingPrice();
      assert.equal(listingPrice.toString(), _listingPrice, "Invalid length of NFTs.")

    })


  })


  // describe("Burn Token", () => {
  //   const tokenURI = "https//test-json-3.com"
  //   before(async () => {
  //     await _contract.mintToken(tokenURI, _nftPrice, {
  //       from: accounts[2], // using first account.Can be another account
  //       value: _listingPrice,
  //     })
  //   })

  //   it("account[2] Should have one owned NFT.", async () => {
  //     const ownedNft = await _contract.getOwnedNfts({ from: accounts[2] });
  //     assert.equal(ownedNft[0].tokenId, 3, "Nft has a wrong id.")
  //   })

  //   it("account[2] Should owned 0 NFT.", async () => {
  //     await _contract.burnToken(3, { from: accounts[2] });
  //     const ownedNft = await _contract.getOwnedNfts({ from: accounts[2] });
  //     assert.equal(ownedNft.length, 0, "Invalid length of token.")
  //   })

  // })


})