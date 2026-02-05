export const PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
  listings: "/listings",
  cart: "/cart",
  wishlist: "/wishlist",
  sellerProperties: "/seller/properties",
  sellerPropertyCreate: "/seller/properties/create",
  property: (id: string) => `/properties/${id}`,
} as const;
