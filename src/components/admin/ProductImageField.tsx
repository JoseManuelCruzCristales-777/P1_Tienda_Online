import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";

import { uploadProductImage } from "@/lib/api/products.functions";
import { getAdminToken } from "@/lib/auth/admin-session";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

type AcceptedMime = (typeof ACCEPTED_TYPES)[number];

type ProductImageFieldProps = {
  value: string;
  onChange: (url: string) => void;
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("No se pudo leer el archivo."));
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("No se pudo leer el archivo."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function isAcceptedMime(type: string): type is AcceptedMime {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

export function ProductImageField({ value, onChange }: ProductImageFieldProps) {
  const { t } = useI18n();
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploadError(null);

    if (!isAcceptedMime(file.type)) {
      setUploadError(t("admin_form_image_type_error"));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError(t("admin_form_image_size_error"));
      return;
    }

    const adminToken = getAdminToken();
    if (!adminToken) {
      setUploadError(t("admin_session_expired"));
      return;
    }

    setIsUploading(true);
    try {
      const dataBase64 = await readFileAsBase64(file);
      const result = await uploadProductImage({
        data: {
          adminToken,
          fileName: file.name,
          mimeType: file.type,
          dataBase64,
        },
      });
      onChange(result.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t("admin_form_image_upload_error"));
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <span className="text-label-md uppercase text-on-surface-variant">
        {t("admin_form_image")}
      </span>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-outline-variant bg-surface-container-low",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        {value ? (
          <div className="relative aspect-[4/3] w-full max-h-64 bg-surface-container">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-surface/95 px-3 py-2 text-xs font-semibold text-primary"
              >
                <Upload className="size-3.5" aria-hidden />
                {t("admin_form_image_replace")}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={isUploading}
                aria-label={t("admin_form_image_remove")}
                className="flex items-center justify-center rounded-full bg-surface/95 p-2 text-error"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center transition-colors hover:bg-surface-container"
          >
            {isUploading ? (
              <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
            ) : (
              <ImagePlus className="size-10 text-primary" aria-hidden />
            )}
            <span className="text-sm font-semibold text-on-surface">
              {isUploading ? t("admin_form_image_uploading") : t("admin_form_image_upload")}
            </span>
            <span className="max-w-xs text-xs text-on-surface-variant">
              {t("admin_form_image_upload_hint")}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={onFileInputChange}
      />

      <p className="text-xs text-on-surface-variant">{t("admin_form_image_or_url")}</p>
      <input
        required
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
      />

      {uploadError ? (
        <p className="text-sm text-error" role="alert">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
