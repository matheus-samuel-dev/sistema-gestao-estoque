export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim());
}
