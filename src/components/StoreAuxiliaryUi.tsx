import { useRouterState } from "@tanstack/react-router";

import { WhatsAppFab } from "@/components/WhatsAppFab";

/** UI global de tienda (no admin): botón flotante de WhatsApp, etc. */
export function StoreAuxiliaryUi() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;
  return <WhatsAppFab />;
}
