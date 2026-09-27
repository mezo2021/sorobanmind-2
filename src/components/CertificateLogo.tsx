import logoImg from '@/assets/logo-certificate.webp';

interface CertificateLogoProps {
  size?: number;
  watermark?: boolean;
}

export default function CertificateLogo({
  size = 100,
  watermark = false,
}: CertificateLogoProps) {
  return (
    <img
      src={logoImg}
      alt={watermark ? '' : 'International Soroban Academy'}
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        display: 'block',
        mixBlendMode: 'multiply',
      }}
    />
  );
}
