export const PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
  listings: "/listings",
  cart: "/cart",
  wishlist: "/wishlist",
  property: (id: string) => `/properties/${id}`,
} as const;
