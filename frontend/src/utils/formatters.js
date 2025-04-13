export const formatPrice = (price) => {
  return typeof price === "string"
    ? parseFloat(price).toFixed(2)
    : Number(price).toFixed(2);
};
