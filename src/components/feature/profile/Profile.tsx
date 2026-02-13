"use client";

import { useState } from "react";
import {
  Breadcrumb,
  ProfileSidebar,
  ProfileForm,
  PasswordForm,
  LoadingState,
} from "./components";
import { useProfile, usePasswordChange } from "./hooks";
import { getAvatarUrl } from "@/utils";
import { PageContainer, Container, Section } from "@/components/layout/Container";
import type { TabId } from "./types";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Profile hook
  const {
    account,
    isLoading,
    formData: profileFormData,
    isSubmitting: isProfileSubmitting,
    isGoogleUser,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
  } = useProfile();

  // Password change hook
  const {
    formData: passwordFormData,
    isSubmitting: isPasswordSubmitting,
    handleChange: handlePasswordChange,
    handleSubmit: handlePasswordSubmit,
  } = usePasswordChange();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!account) return null;

  const avatarUrl = getAvatarUrl(account.avatar);

  return (
    <PageContainer>
      <Breadcrumb />

      <Container maxWidth="7xl" paddingX="md" paddingY="lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            avatarUrl={avatarUrl}
            fullName={account.fullName || ""}
            email={account.email || ""}
            isGoogleUser={isGoogleUser}
          />

          <main className="flex-1 min-w-0">
            <Section withBackground withBorder>
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
                  onSubmit={handlePasswordSubmit}
                  onChange={handlePasswordChange}
                />
              )}
            </Section>
          </main>
        </div>
      </Container>
    </PageContainer>
  );
}
