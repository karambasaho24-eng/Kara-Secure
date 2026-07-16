import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Aligné sur MAX_FILE_SIZE_BYTES (src/lib/documents/hash.ts) et la limite
    // du bucket Storage (25 Mo). Le défaut de Next.js est 1 Mo, trop bas pour
    // des captures d'écran ou des PDF scannés.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
