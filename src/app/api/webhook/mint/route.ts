import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

export async function POST(req: Request) {
  try {
    const { userAddress, ipfsUri } = await req.json();

    // 1. Ambil Akun Owner dari Private Key
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

    // 2. Setup Client dengan RPC dari Coinbase
    const client = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.BASE_RPC_URL) 
    }).extend(publicActions);

    const abi = [{
      name: "safeMint",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" }, 
        { name: "uri", type: "string" }
      ],
      outputs: []
    }] as const; // Pakai 'as const' agar TypeScript lebih akurat

    // 3. Eksekusi Minting ke Blockchain
    const hash = await client.writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'safeMint',
      args: [userAddress, ipfsUri],
    });

    // 4. Tunggu konfirmasi (Opsional tapi sangat disarankan)
    // Ini memastikan saat API merespon 'success', NFT sudah benar-benar ada di blok
    await client.waitForTransactionReceipt({ hash });

    return NextResponse.json({ success: true, hash });
  } catch (error: any) {
    console.error("Minting Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}