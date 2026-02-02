export const PATHS = {
  home: "/",
  login: "/login",
  listings: "/listings",
  cart: "/cart",
  wishlist: "/wishlist",
  property: (id: string) => `/properties/${id}`,
} as const;
