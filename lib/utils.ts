export const amountFromMiliunits = (amount: number) => {
  return amount / 1000;
};

export const amounttoMiliunits = (amount: number) => {
  return Math.round(amount * 1000);
};

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};
