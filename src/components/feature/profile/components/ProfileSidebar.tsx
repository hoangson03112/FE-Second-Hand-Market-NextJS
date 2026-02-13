import { User, Lock, ChevronRight, Shield, Award } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import type { TabId } from "../types";

interface ProfileSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  avatarUrl: string | null;
  fullName: string;
  email: string;
  isGoogleUser: boolean;
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
  avatarUrl,
  fullName,
  email,
  isGoogleUser,
}: ProfileSidebarProps) {
  const getTabClasses = (tab: TabId) =>
    `w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 ${
      activeTab === tab
        ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium border-l-3 border-primary shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1"
    }`;

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-md">
        {/* User info with enhanced design */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <UserAvatar
                avatarUrl={avatarUrl}
                fullName={fullName}
                size="large"
                showEditIcon
              />
              {/* Badge */}
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg">
                <Award className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-1">
              {fullName || "Người dùng"}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {email}
            </p>
            {isGoogleUser && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-foreground">Google Account</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation with enhanced styling */}
        <nav className="p-2">
          <button
            type="button"
            onClick={() => onTabChange("profile")}
            className={getTabClasses("profile")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${activeTab === "profile" ? "bg-primary/10" : "bg-muted/50"}`}>
                <User className="w-4 h-4" />
              </div>
              <span>Hồ sơ</span>
            </div>
            {activeTab === "profile" && <ChevronRight className="w-4 h-4" />}
          </button>
          {!isGoogleUser && (
            <button
              type="button"
              onClick={() => onTabChange("password")}
              className={getTabClasses("password")}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${activeTab === "password" ? "bg-primary/10" : "bg-muted/50"}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <span>Đổi mật khẩu</span>
              </div>
              {activeTab === "password" && <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
}
