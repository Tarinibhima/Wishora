export type User = {
  id: string;
  name: string;
  email: string;
};

export type WishlistItem = {
  id: string;
  name: string;
  productLink: string;
  description: string;
  status: "Available" | "Taken";
};

export type Wishlist = {
  id: string;
  occasion: string;
  items: WishlistItem[];
  createdAt: string;
};
