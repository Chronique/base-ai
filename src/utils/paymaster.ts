import { createBundlerClient } from 'viem/account-abstraction';
import { base } from 'viem/chains'; // Pastikan dari viem/chains
import { http } from 'viem';

const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;

if (!paymasterUrl) {
  console.warn("⚠️ WARNING: Paymaster URL Mainnet belum diisi di .env.local");
}

export const bundlerClient = createBundlerClient({
  chain: base,
  transport: http(paymasterUrl),
});