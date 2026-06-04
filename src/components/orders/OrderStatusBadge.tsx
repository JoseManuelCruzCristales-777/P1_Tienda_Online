import type { OrderStatus } from "@/lib/orders";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-800 border-amber-500/30",
  confirmed: "bg-secondary-container/80 text-on-secondary-container border-secondary/40",
  cancelled: "bg-error/10 text-error border-error/30",
  picked_up: "bg-primary/10 text-primary border-primary/30",
};

const STATUS_KEYS: Record<OrderStatus, TranslationKey> = {
  pending: "order_status_pending",
  confirmed: "order_status_confirmed",
  cancelled: "order_status_cancelled",
  picked_up: "order_status_picked_up",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLE[status],
        className,
      )}
    >
      {t(STATUS_KEYS[status])}
    </span>
  );
}
