import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/" className="shrink-0 group">
      <Image
        src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1784993079/Gemini_Generated_Image_rg4xa9rg4xa9rg4x_1_mtjahn.png"
        alt="Eco Market"
        width={150}
        height={110}
        className="h-15 sm:h-15 w-auto max-w-[150px] sm:max-w-none object-contain transition-opacity duration-200 group-hover:opacity-70"
        priority
      />
    </Link>
  );
}
