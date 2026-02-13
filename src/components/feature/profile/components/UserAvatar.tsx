import Image from "next/image";
import { User, Camera } from "lucide-react";

interface UserAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  size?: "small" | "medium" | "large";
  showEditIcon?: boolean;
}

const sizes = {
  small: { wrapper: "w-12 h-12", icon: "w-6 h-6", editIcon: "w-4 h-4" },
  medium: { wrapper: "w-16 h-16", icon: "w-8 h-8", editIcon: "w-5 h-5" },
  large: { wrapper: "w-24 h-24", icon: "w-12 h-12", editIcon: "w-6 h-6" },
};

export function UserAvatar({
  avatarUrl,
  fullName,
  size = "small",
  showEditIcon = false,
}: UserAvatarProps) {
  const sizeClasses = sizes[size];

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses.wrapper} rounded-full overflow-hidden bg-muted`}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName || "Avatar"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className={`${sizeClasses.icon} text-muted-foreground`} />
          </div>
        )}
      </div>
      {showEditIcon && (
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <Camera className={`${sizeClasses.editIcon} text-white`} />
        </div>
      )}
    </div>
  );
}
