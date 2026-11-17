# One of Ours — test storefront

Static test build of the One of Ours D2C store. **Not for launch**: checkout is a mock, no payments are taken, and the site is set to `noindex`.

- Pages: `index.html` (home), `shop.html`, `product.html?r=cr|cl|ll`, `cart.html`, `checkout.html` (mock payment), `success.html`
- Prices: `RECIPES` in `assets/app.js`, copied from the D2C selling price ladder in `Unit_Economics_Final_with_CAC_LTV_v3.xlsx`. First-order discount (10%) is `FIRST_ORDER_DISCOUNT`.
- Brand: colours and type in `assets/style.css` (Forest Ink, Oat Cream, Kraft, Sage, Terracotta, Dusty Blue; Merriweather + Caveat). Logo mark in `assets/ooo.svg`.
- Cart is stored in the browser (localStorage). No backend.
- `CNAME` points GitHub Pages at oneofours.co.in.
