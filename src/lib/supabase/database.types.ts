import type { CartItem } from "@/lib/cart";
import type { ProductLayoutRole, ProductVariant } from "@/lib/catalog/types";
import type { OrderStatus } from "@/lib/orders";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          items: CartItem[];
          total: number;
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          items: CartItem[];
          total: number;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string;
          items?: CartItem[];
          total?: number;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          price: string;
          image_url: string;
          description: string;
          category: string;
          layout_role: ProductLayoutRole;
          featured_label: string | null;
          variants: ProductVariant[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          price: string;
          image_url: string;
          description: string;
          category: string;
          layout_role: ProductLayoutRole;
          featured_label?: string | null;
          variants?: ProductVariant[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          price?: string;
          image_url?: string;
          description?: string;
          category?: string;
          layout_role?: ProductLayoutRole;
          featured_label?: string | null;
          variants?: ProductVariant[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
