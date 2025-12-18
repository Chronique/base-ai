import { NextResponse } from 'next/server';
import { PinataSDK } from "pinata"; // Gunakan paket "pinata"

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL, // Contoh: example.mypinata.cloud
});

export async function POST(req: Request) {
  try {
    const { imageUrl, name } = await req.json();
    
    // 1. Tambahkan '.public' sebelum '.url'
    const upload = await pinata.upload.public.url(imageUrl);
    
    // 2. Tambahkan '.public' sebelum '.json'
    const metadata = await pinata.upload.public.json({
      name: name || `AI Anime #${Date.now()}`,
      description: "Dibuat dengan VibeMint AI di Base",
      image: `ipfs://${upload.cid}`, // Gunakan .cid untuk SDK terbaru
    });

    return NextResponse.json({ uri: `ipfs://${metadata.cid}` });
  } catch (error) {
    console.error("Pinata Error:", error);
    return NextResponse.json({ error: "Gagal upload ke IPFS" }, { status: 500 });
  }
}