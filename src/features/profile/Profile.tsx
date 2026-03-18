"use client";

import { useState } from "react";
import {
  Breadcrumb,
  ProfileSidebar,
  ProfileForm,
  PasswordForm,
  BankInfoForm,
  LoadingState,
} from "./components";
import { useProfile, usePasswordChange, useSellerBank } from "./hooks";
import { getAvatarUrl } from "@/utils";
import type { TabId } from "./types";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const {
    account,
    isLoading,
    formData: profileFormData,
    isSubmitting: isProfileSubmitting,
    isGoogleUser,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
  } = useProfile();

  const {
    formData: passwordFormData,
    isSubmitting: isPasswordSubmitting,
    handleChange: handlePasswordChange,
    handleSubmit: handlePasswordSubmit,
  } = usePasswordChange(isGoogleUser);

  const {
    formData: bankFormData,
    isSubmitting: isBankSubmitting,
    isLoading: isBankLoading,
    handleChange: handleBankChange,
    handleSubmit: handleBankSubmit,
  } = useSellerBank();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!account) return null;

  const avatarUrl = getAvatarUrl(account.avatar);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            avatarUrl={avatarUrl}
            fullName={account.fullName || ""}
            email={account.email || ""}
            role={account.role}
            isGoogleUser={isGoogleUser}
          />

          <main className="flex-1 min-w-0">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              {activeTab === "profile" && (
                <ProfileForm
                  formData={profileFormData}
                  isSubmitting={isProfileSubmitting}
                  isGoogleUser={isGoogleUser}
                  onSubmit={handleProfileSubmit}
                  onChange={handleProfileChange}
                />
              )}

              {activeTab === "password" && (
                <PasswordForm
                  formData={passwordFormData}
                  isSubmitting={isPasswordSubmitting}
                  isGoogleUser={isGoogleUser}
                  onSubmit={handlePasswordSubmit}
                  onChange={handlePasswordChange}
                />
              )}

              {activeTab === "bank" && account.role === "seller" && (
                <BankInfoForm
                  formData={bankFormData}
                  isSubmitting={isBankSubmitting}
                  isLoading={isBankLoading}
                  onSubmit={handleBankSubmit}
                  onChange={handleBankChange}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
