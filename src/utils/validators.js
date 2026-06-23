export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim());
}

export function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  if (!password) return { score: 0, label: "", color: "inherit" };
  if (score <= 2) return { score, label: "Fraca", color: "error" };
  if (score <= 4) return { score, label: "Média", color: "warning" };
  return { score, label: "Forte", color: "success" };
}

export function isStrongPassword(password) {
  return getPasswordStrength(password).score === 5;
}
