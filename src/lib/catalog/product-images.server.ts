import { getSupabaseAdmin } from "@/lib/supabase/admin.server";

const BUCKET = "product-images";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const MAX_BYTES = 5 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export type UploadProductImageInput = {
  fileName: string;
  mimeType: string;
  dataBase64: string;
};

export async function uploadProductImage(input: UploadProductImageInput): Promise<string> {
  if (!ALLOWED_MIME.has(input.mimeType)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WebP o GIF.");
  }

  const buffer = Buffer.from(input.dataBase64, "base64");
  if (buffer.byteLength === 0) {
    throw new Error("El archivo está vacío.");
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error("La imagen debe pesar menos de 5 MB.");
  }

  const ext = input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const safeName = sanitizeFileName(input.fileName) || "imagen";
  const path = `products/${Date.now()}-${safeName}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: input.mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
