import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "Base Snap AI",
  description: "Turn your selfie into anime",
  bannerImageUrl: 'https://i.imgur.com/2bsV8mV.png',
  iconImageUrl: 'https://i.imgur.com/brcnijg.png',
  // homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://base-ai-three.vercel.app",
  homeUrl: "https://base-ai-three.vercel.app",
  splashBackgroundColor: "#FFFFFF"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
