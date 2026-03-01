const PHONE_MAX_LENGTH = 11;

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trimStart();
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, PHONE_MAX_LENGTH);
}

function normalizeEmail(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function normalizeUsername(value: string) {
  return value.replace(/\s+/g, "").replace(/[^a-zA-Z0-9._]/g, "");
}

function normalizeAccountNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 20);
}

function normalizeRegionCode(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeWardCode(value: string) {
  return value.trim().toUpperCase();
}

export function sanitizeFieldInput(name: string, value: string) {
  const loweredName = name.toLowerCase();

  if (loweredName.includes("phone") || loweredName.includes("sdt")) {
    return normalizePhone(value);
  }

  if (loweredName.includes("email")) {
    return normalizeEmail(value);
  }

  if (loweredName.includes("username")) {
    return normalizeUsername(value);
  }

  if (loweredName.includes("accountnumber")) {
    return normalizeAccountNumber(value);
  }

  if (loweredName === "provinceid" || loweredName === "districtid") {
    return normalizeRegionCode(value);
  }

  if (loweredName === "wardcode") {
    return normalizeWardCode(value);
  }

  if (
    loweredName.includes("fullname") ||
    loweredName.includes("accountholder") ||
    loweredName.includes("bankname")
  ) {
    return normalizeSpaces(value);
  }

  return value.trimStart();
}

export function sanitizeFormValues<T extends object>(values: T): T {
  const normalized = { ...values } as Record<string, unknown>;

  Object.keys(normalized).forEach((key) => {
    const currentValue = normalized[key];
    if (typeof currentValue === "string") {
      normalized[key] = sanitizeFieldInput(key, currentValue).trim();
    }
  });

  return normalized as T;
}
