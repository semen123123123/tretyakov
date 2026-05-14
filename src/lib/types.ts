// Type definitions only — no runtime imports
export type Stone = {
  id: string;
  name_ru: string;
  name_en: string;
  description: string;
  history_facts: string;
  additional_fact: string;
  color: string;
  image_url: string | null;
  history_image: string | null;
  price_per_unit: number;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  stone_composition: string;
  price: number;
  image_url: string | null;
  is_custom: boolean;
  is_published: boolean;
  in_stock: boolean;
  sort_order: number;
  // Display-only fields (local data)
  historical_fact?: string;
  advantages?: string[];
  stone_details?: string;
  size_info?: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  stone_composition: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  delivery_address: string | null;
  total_amount: number;
  items: OrderItem[];
  status: string;
  payment_status: string;
  payment_id: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  text: string;
  source: string;
  avito_url?: string;
  is_approved: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  productId: string;
  product?: Product;
  stoneIds?: string[];
  quantity: number;
  isCustom: boolean;
};
