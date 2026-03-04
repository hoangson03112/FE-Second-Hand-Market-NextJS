import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/" className="shrink-0 group">
      <Image
        src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
        alt="Eco Market"
        width={110}
        height={110}
        className="h-8 sm:h-9 w-auto max-w-[92px] sm:max-w-none object-contain transition-opacity duration-200 group-hover:opacity-70"
        priority
      />
    </Link>
  );
}
