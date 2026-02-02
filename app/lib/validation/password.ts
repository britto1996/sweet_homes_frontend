export type PasswordRuleKey =
  | "minLength"
  | "lower"
  | "upper"
  | "number"
  | "special"
  | "noSpaces";

export type PasswordCheck = {
  ok: boolean;
  missing: PasswordRuleKey[];
  score: number; // 0..6
};

const SPECIAL_REGEX = /[^A-Za-z0-9]/;

export function checkStrongPassword(password: string): PasswordCheck {
  const missing: PasswordRuleKey[] = [];

  const minLength = password.length >= 8;
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const number = /\d/.test(password);
  const special = SPECIAL_REGEX.test(password);
  const noSpaces = !/\s/.test(password);

  if (!minLength) missing.push("minLength");
  if (!lower) missing.push("lower");
  if (!upper) missing.push("upper");
  if (!number) missing.push("number");
  if (!special) missing.push("special");
  if (!noSpaces) missing.push("noSpaces");

  const score = 6 - missing.length;
  return { ok: missing.length === 0, missing, score };
}

export function strongPasswordRegex() {
  // At least 8 chars, one lower, one upper, one number, one special, no spaces.
  return /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).*$/;
}
