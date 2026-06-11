/**
 * Migra productos de data/products.json → Supabase (tabla products).
 * Uso: npm run seed:products
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  const raw = readFileSync(envPath, "utf8");
  const env = {};

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }

  return env;
}

function toRow(product) {
  const variants =
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants.map((variant) => ({
          size: String(variant.size ?? "").trim(),
          stock: Math.max(0, Math.floor(Number(variant.stock) || 0)),
        }))
      : [{ size: "Única", stock: 5 }];

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image_url: product.imageUrl,
    description: product.description,
    category: product.category,
    layout_role: product.layoutRole ?? "standard",
    featured_label: product.featuredLabel ?? null,
    variants,
  };
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const productsPath = resolve(process.cwd(), "data", "products.json");
const products = JSON.parse(readFileSync(productsPath, "utf8"));

if (!Array.isArray(products) || products.length === 0) {
  console.error("data/products.json está vacío o no es un arreglo.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

const rows = products.map(toRow);
const { data, error } = await supabase
  .from("products")
  .upsert(rows, { onConflict: "id" })
  .select("id");

if (error) {
  console.error("Error al sembrar productos:", error.message);
  if (error.message.includes("products")) {
    console.error(
      "\n¿Ejecutaste supabase/migrations/002_products.sql en el SQL Editor de Supabase?",
    );
  }
  process.exit(1);
}

console.log(`✓ ${data?.length ?? rows.length} productos migrados a Supabase.`);
