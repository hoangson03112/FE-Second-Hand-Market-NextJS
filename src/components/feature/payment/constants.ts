import type { SellerBankInfo } from "@/services/order.service";

export const PAYMENT_WINDOW_MINUTES = 15;

export const BANK_CODE_MAP: Record<string, string> = {
  Vietcombank: "VCB",
  VietinBank: "CTG",
  BIDV: "BID",
  Agribank: "VBA",
  Techcombank: "TCB",
  MBBank: "MBB",
  ACB: "ACB",
  VPBank: "VPB",
  TPBank: "TPB",
  HDBank: "HDB",
  VietABank: "VAB",
  SHB: "SHB",
  Eximbank: "EIB",
  MSB: "MSB",
  OCB: "OCB",
  SCB: "SCB",
  VIB: "VIB",
  SeABank: "SEA",
  PGBank: "PGB",
  NamABank: "NAB",
  BacABank: "BAB",
  PVcomBank: "PVC",
  GPBank: "GPB",
  ABBank: "ABB",
  VietBank: "VCC",
  KienLongBank: "KLB",
  PublicBank: "PBV",
  NCB: "NCB",
  OceanBank: "OCE",
  LienVietPostBank: "LPB",
  DongABank: "DAB",
  NABank: "NASB",
  SaigonBank: "SGB",
  HongLeongBank: "HLB",
  IndovinaBank: "IVB",
  WooriBank: "WVB",
  UnitedOverseasBank: "UOB",
  StandardCharteredBank: "SCB",
  HSBC: "HSB",
  ANZBank: "ANZ",
  ShinhanBank: "SHB",
};

export function getBankCode(bankName: string): string {
  if (BANK_CODE_MAP[bankName]) {
    return BANK_CODE_MAP[bankName];
  }
  const upperBankName = bankName.toUpperCase();
  for (const [key, value] of Object.entries(BANK_CODE_MAP)) {
    if (key.toUpperCase() === upperBankName) {
      return value;
    }
  }
  return bankName.substring(0, 3).toUpperCase();
}

export function generateVietQRImageUrl(bankInfo: SellerBankInfo): string {
  const bankCode = getBankCode(bankInfo.bankName);
  const amount = Math.round(bankInfo.amount);
  const content = encodeURIComponent(bankInfo.content);
  const cleanAccountNumber = bankInfo.accountNumber.replace(/\s+/g, "");
  return `https://img.vietqr.io/image/${bankCode}-${cleanAccountNumber}-compact2.png?amount=${amount}&addInfo=${content}`;
}

export function formatCountdown(secondsLeft: number | null): string {
  if (secondsLeft === null) return "--:--";
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
