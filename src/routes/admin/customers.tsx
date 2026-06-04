import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Users } from "lucide-react";

import { deleteCustomer, getCustomers, type Customer } from "@/lib/customers";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const { t, locale } = useI18n();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(t("admin_customers_delete_confirm", { name }))) return;
    deleteCustomer(id);
    setCustomers(getCustomers());
  };

  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">{t("admin_customers_title")}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {customers.length === 0
              ? t("admin_customers_empty")
              : t(
                  customers.length === 1
                    ? "admin_customers_count_one"
                    : "admin_customers_count_other",
                  { count: customers.length },
                )}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary-container/30 px-4 py-2 text-xs font-medium text-on-secondary-container">
          ⚠️ {t("admin_customers_warning")}
        </span>
      </div>

      {customers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-container-highest bg-surface-container-low">
              <tr>
                <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_name")}
                </th>
                <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant md:table-cell">
                  {t("admin_col_email")}
                </th>
                <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant sm:table-cell">
                  {t("admin_col_whatsapp")}
                </th>
                <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_registered")}
                </th>
                <th className="px-4 py-3 text-right font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-surface-container-highest last:border-0 transition-colors hover:bg-surface-container-low/50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-on-surface">{customer.fullName}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-on-surface-variant md:table-cell">
                    <a
                      href={`mailto:${customer.email}`}
                      className="transition-colors hover:text-primary hover:underline"
                    >
                      {customer.email}
                    </a>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <a
                      href={`https://wa.me/52${customer.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary"
                    >
                      {customer.phone}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-xs text-on-surface-variant">
                    {new Date(customer.createdAt).toLocaleDateString(dateLocale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(customer.id, customer.fullName)}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-xs text-on-surface-variant transition-colors hover:border-error hover:text-error"
                    >
                      <Trash2 className="size-3.5 stroke-[1.5]" aria-hidden />
                      {t("admin_action_delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-container-highest py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
        <Users className="size-7 stroke-[1.5] text-on-surface-variant" aria-hidden />
      </div>
      <p className="text-sm font-label-md uppercase tracking-widest text-on-surface-variant">
        {t("admin_customers_empty_title")}
      </p>
      <p className="mt-2 max-w-xs text-xs text-on-surface-variant">{t("admin_customers_empty_desc")}</p>
    </div>
  );
}
