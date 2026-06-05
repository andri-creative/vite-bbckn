"use client";
import { AsciiArt } from "@/components/ui/ascii-art";

export default function AsciiArtBinaryDemo() {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      charset="binary"
      color="#22c55e"
      inverted
      animated={false}
      className="mx-auto aspect-square w-full max-w-lg bg-neutral-950"
    />
  );
}
