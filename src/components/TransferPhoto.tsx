import Image from 'next/image';
import { transferImageSrc, type RouteImage } from '@/lib/prices';

/** Hero / card photo for a priced connection. */
export function TransferPhoto({
  image,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 720px',
}: {
  image: RouteImage;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      <Image
        src={transferImageSrc(image)}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
