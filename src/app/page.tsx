'use client';
import { useState } from 'react';
import Camera from '@/components/Camera';
import { useAccount } from 'wagmi';

export default function Home() {
  const { address } = useAccount();
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (base64Img: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhook/transform', {
        method: 'POST',
        body: JSON.stringify({ image: base64Img }),
      });
      const data = await res.json();
      setResultImg(data.url);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses AI");
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    // Validasi: Harus ada alamat user dan gambar hasil AI
    if (!address || !resultImg) {
      alert("Pastikan dompet terhubung dan foto sudah siap!");
      return;
    }
    
    setLoading(true);

    try {
      // 1. Upload ke IPFS via Pinata (Melalui API internal kita)
      const ipfsRes = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: resultImg, name: "VibeMint AI Avatar" }),
      });
      const { uri } = await ipfsRes.json();

      if (!uri) throw new Error("Gagal mendapatkan URI dari IPFS");

      // 2. Panggil API Mint (Backend Relayer yang memegang Private Key Owner)
      const mintRes = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, ipfsUri: uri }),
      });
      
      const data = await mintRes.json();
      
      if (data.success) {
        alert("🎉 Berhasil! NFT sedang dikirim ke dompet Anda.");
        setResultImg(null); // Reset tampilan setelah sukses
      } else {
        throw new Error(data.error || "Gagal melakukan minting di server");
      }
    } catch (err: any) {
      console.error("Mint Error:", err);
      alert(`Gagal Minting: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">AI Anime Cam 📸</h1>
        
        {!resultImg && !loading && (
          <Camera onCapture={handleCapture} />
        )}
        
        {loading && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-center font-medium text-gray-600 italic">✨ Sedang memproses...</p>
          </div>
        )}

        {resultImg && !loading && (
          <div className="flex flex-col gap-4 w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border-4 border-white shadow-md">
                <img src={resultImg} className="object-cover w-full h-full" alt="Result AI" />
            </div>
            
            <button 
              onClick={mintNFT} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold transition-all transform active:scale-95"
            >
              Mint NFT (Gratis Gas)
            </button>
            
            <button 
              onClick={() => setResultImg(null)} 
              className="w-full text-gray-400 hover:text-gray-600 text-sm py-2"
            >
              Coba Foto Lain
            </button>
          </div>
        )}
        
        {!address && !loading && (
            <p className="mt-4 text-center text-xs text-red-500 font-medium">
                ⚠️ Hubungkan dompet Anda terlebih dahulu
            </p>
        )}
      </div>
    </main>
  );
}