export const formatedToUnitPrice = (items) => {
  return items.map((item) => ({
    ...item,
    unitPrice: item.quantity > 0 ? item.price / item.quantity : item.price,
  }))
}
