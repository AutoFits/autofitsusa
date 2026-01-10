line_items: items.map(item => ({
  price_data: {
    currency: "usd",
    product_data: { name: item.name },
    unit_amount: Math.round(item.price * 100),
  },
  quantity: item.qty,
}))
