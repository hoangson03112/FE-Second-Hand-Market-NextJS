"use client";

import { useRouter } from "next/navigation";
import { useBecomeSeller } from "./hooks";
import { BecomeSellerView } from "./components/BecomeSellerView";

export default function BecomeSeller() {
  const router = useRouter();

  const {
    values,
    errors,
    apiError,
    isLoading,
    idCardFront,
    idCardBack,
    handleChange,
    handleFile,
    handleSubmit,
    requestStatus,
    isCheckingStatus,
    hasRequest,
    productLimit,
    requiresVerification,
  } = useBecomeSeller();

  return (
    <BecomeSellerView
      values={values}
      errors={errors}
      apiError={apiError}
      isLoading={isLoading}
      idCardFront={idCardFront}
      idCardBack={idCardBack}
      handleChange={handleChange}
      handleFile={handleFile}
      handleSubmit={handleSubmit}
      requestStatus={requestStatus}
      isCheckingStatus={isCheckingStatus}
      hasRequest={hasRequest}
      productLimit={productLimit}
      requiresVerification={requiresVerification}
      onBack={() => router.back()}
    />
  );
}
