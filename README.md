# Next.js NFT Market place app

## Features
 - Create NFT
 - List NFT to market
 - Buy NFT
 - 

## Getting Started


```bash
npm install

npm run dev
```

Install [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) into your browser extension.
Create wallet and connect current page. To connect current page, open MetaMask and press three dots and press connect sites and add manualy.
To check your ethereum is okay, press F12 and in console enter `window.ethereum`

Install [Ganache](https://trufflesuite.com/ganache/) and install [truffle](https://trufflesuite.com/docs/truffle/how-to/install/)
After install truffle run `truffle init`. Open Ganache and create workspace and add truffle-config.js to workspace.

## Technologies used

- nextjs
- typescript
- tailwind
- postcss

## UI

Using Navbar from [TailwindUI](https://tailwindui.com/components/application-ui/navigation/navbars)

## Structure

```bash
tree -I "node_modules|.next" -d

├── components
│   ├── providers
│   │   └── web3
│   └── ui
│       ├── ActiveLink
│       ├── Layout
│       ├── Navbar
│       └── Nft
│           ├── Item
│           └── List
├── content
├── pages
│   ├── api
│   └── nft
├── public
│   └── images
├── styles
└── types
```

## State management

Using Context API for state management. Web3Provider components wrap all the pages and provide our state.

```
state={}

<Web3Provider state>
  <Navbar>
    <pages>
      ...
      ..
      .
</Web3Provider>
```
