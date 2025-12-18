'use client';
import { useRef, useState } from 'react';

export default function Camera({ onCapture }: { onCapture: (img: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    if (videoRef.current) videoRef.current.srcObject = s;
    setStream(s);
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/png');
      onCapture(data);
      stream?.getTracks().forEach(t => t.stop()); // Matikan kamera setelah jepret
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
      {!stream ? (
        <button onClick={startCamera} className="bg-blue-600 p-3 rounded-full text-white">Buka Kamera</button>
      ) : (
        <button 
  onClick={takePhoto} 
  aria-label="Ambil Foto" // Tambahkan ini agar tidak error
  title="Ambil Foto"      // Tambahkan ini juga sebagai cadangan
  className="bg-red-600 p-6 rounded-full border-4 border-white shadow-lg"
></button>

      )}
    </div>
  );
}