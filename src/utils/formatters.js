export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

export const parseCurrency = (value) => {
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
};

export const currencyInput = (value) => formatCurrency(parseCurrency(value));

const technicalErrorPatterns = [
  /unable to access lob stream/i,
  /request failed with status code/i,
  /failed to load resource/i,
  /network error/i,
];

export const getApiError = (error, fallback = "Não foi possível concluir a operação.") => {
  const message = error.response?.data?.message || error.message || fallback;
  return technicalErrorPatterns.some((pattern) => pattern.test(message)) ? fallback : message;
};
