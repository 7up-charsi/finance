export const amountFromMiliunits = (amount: number) => {
  return amount / 1000;
};

export const amounttoMiliunits = (amount: number) => {
  return Math.round(amount * 1000);
};
