import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // Foto dalam bentuk base64

    // Memanggil model AI (Contoh: Real-ESRGAN atau model Anime)
    // Anda bisa ganti 'model_id' sesuai keinginan di Replicate
    const output = await replicate.run(
      "lucataco/faceswap:9a4296ca4e5a2b0540f35391f30f588493c0fa3708ceec887615785835699475",
      { input: { target_image: image } }
    );

    return NextResponse.json({ url: output });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses AI" }, { status: 500 });
  }
}