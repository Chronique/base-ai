// src/app/api/webhook/transform/route.ts
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); 

    const output = await replicate.run(
      "black-forest-labs/flux-pro", // Atau model flux spesifik lainnya
      {
        input: {
          image: image,
          prompt: "convert this person into a high-quality studio ghibli anime style character, vibrant colors, detailed background",
          prompt_upsampling: true,
          guidance: 3.5,
          image_prompt_strength: 0.45 // Semakin tinggi, semakin mirip foto asli
        }
      }
    );

    return NextResponse.json({ url: output });
  } catch (error: any) {
    console.error("FLUX Error:", error);
    return NextResponse.json({ error: "Gagal memproses AI" }, { status: 500 });
  }
}