import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains'; // Hanya import base mainnet
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base], // Hanya daftarkan base
  connectors: [
    coinbaseWallet({
      appName: 'VibeMint AI',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],
  transports: {
    [base.id]: http(), // Hanya gunakan transport base
  },
});