# Base Smart Contracts

A collection of smart contracts deployed on Base mainnet.

## Deployed Contracts

Base Mainnet:
- SimpleStorage: [`0xE0005BB7aF7748E0Ba6AB0Ad24fb0dF676DF0158`](https://basescan.org/address/0xE0005BB7aF7748E0Ba6AB0Ad24fb0dF676DF0158)
- BaseToken: [`0xfBEb6207574f329149A799281d866D0F27936d8c`](https://basescan.org/address/0xfBEb6207574f329149A799281d866D0F27936d8c)
- BaseStaking: [`0xF7279a24c2386C64BA079c312349f76a1A48623a`](https://basescan.org/address/0xF7279a24c2386C64BA079c312349f76a1A48623a)
- BaseVault: [`0xB8E41F562b4c4fc127aE61980b4153602090dF59`](https://basescan.org/address/0xB8E41F562b4c4fc127aE61980b4153602090dF59)
- BaseNFT: [`0x237bd8fae30A26f83a73EB95c815547407e6874d`](https://basescan.org/address/0x237bd8fae30A26f83a73EB95c815547407e6874d)

## Smart Contracts

1. **SimpleStorage**: A basic storage contract for storing and retrieving values
2. **BaseToken**: An ERC20 token with minting capabilities
3. **BaseStaking**: A staking contract that allows users to stake BaseToken and earn rewards
4. **BaseVault**: A vault contract for depositing and withdrawing BaseToken with safety features
5. **BaseNFT**: An NFT collection with minting capabilities and IPFS metadata support

## Technology Stack

- Solidity
- Hardhat
- React
- ethers.js
- Chakra UI

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run setup
   ```

3. Create a `.env` file with:
   ```
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_basescan_api_key
   ```

4. Run the frontend:
   ```bash
   npm run frontend:dev
   ```

## Frontend Features

- Connect wallet with MetaMask
- Interact with SimpleStorage contract
- Modern UI with Chakra UI
- Network switching support

## License

MIT 