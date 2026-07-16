import "server-only";
import QRCode from "qrcode";

/**
 * Génère un QR code (data URL PNG) pointant vers la page de vérification
 * publique pour un identifiant de certification donné.
 */
export async function generateVerificationQrCode(publicCode: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verifier?code=${publicCode}`;
  return QRCode.toDataURL(url, {
    width: 240,
    margin: 1,
    color: { dark: "#ffffff", light: "#00000000" },
  });
}
