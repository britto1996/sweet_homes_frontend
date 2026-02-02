export const PATHS = {
  home: "/",
  listings: "/listings",
  cart: "/cart",
  wishlist: "/wishlist",
  property: (id: string) => `/properties/${id}`,
} as const;
