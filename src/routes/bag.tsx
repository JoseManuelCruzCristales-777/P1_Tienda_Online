import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — Rousse Shopping" },
      { name: "description", content: "Review your reserved items and confirm in-store pickup at our Oaxaca boutique." },
      { property: "og:title", content: "Shopping Bag — Rousse Shopping" },
      { property: "og:description", content: "Confirm your in-store reservation." },
    ],
  }),
  component: Bag,
});

const items = [
  {
    title: "Elegance Eau de Parfum",
    subtitle: "50ml, Floral Notes",
    price: "$125.00",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf8d_E4DmQ2UA6QLzEPelLQLkz-9mTUESWPXbcBU6mAEOJ8vMBY-Dy8gkY7mFKWfLxviNG7yftSA9ssz273y7ejD-WB5M1KjMVN_dSsX9A2Yk4wxngR5zjG3qRI2xvgZdkCXSP-PVj2vaY_qXdFHL_bHEpYrPwBfViylL2e5nrWUC0EubZMHkOJr8jjoV7YuAai53tRWhzUlD8dBr6vYubcj6NnprSaDolULs3dNP_8BRfRH6RvLoFMDipLPnhsx-fKJ5nuN7zPQs",
  },
  {
    title: "Minimalist Gold Chain",
    subtitle: "18k Plated, 45cm",
    price: "$85.00",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIKaSwWtEyARGWAKSzDTE61tJQI3ojPwNgwq-qQYyS1F5h2rDANaAP1VL3TsOhQO5GRDLOgbkLIysu4C02cwU5waMD6bhV21yckSZTyQKIyGcrb6ZGHBwHruJALB8-Qk0bLGM_TKYcFT5iBfTvBa8RkrvQPcLNxDjIhZY9gcus9J2_tph-Xzmu9nLx96bccZhBmtO6PBy3CCGH6c9ZAbfdXEQgzbrIfr_Sw6mumFWFa2NWSkFozi1JEzlUpv4WJc72Cpalubeq9eM",
  },
];

function Bag() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li><Link to="/" className="hover:text-primary transition-colors font-label-md text-label-md">Home</Link></li>
            <li className="flex items-center">
              <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
              <span className="text-primary font-label-md text-label-md">Shopping Bag</span>
            </li>
          </ol>
        </nav>
      </div>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-stack-lg">
        <div className="mb-stack-md">
          <h1 className="font-headline-xl text-headline-xl text-primary">Your Bag</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">2 items ready for checkout.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter relative items-start">
          {/* Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-stack-sm">
            {items.map((item) => (
              <div key={item.title} className="bg-surface-container-lowest rounded-lg p-6 flex flex-col sm:flex-row gap-6 shadow-sm border border-surface-container hover:shadow-md transition-shadow duration-300">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low rounded overflow-hidden">
                  <img className="w-full h-full object-cover" alt={item.title} src={item.src} />
                </div>
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-primary text-[20px] leading-tight">{item.title}</h3>
                      <p className="font-body-md text-on-surface-variant mt-1 text-sm">{item.subtitle}</p>
                    </div>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    <div className="flex items-center border border-outline-variant rounded">
                      <button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container transition-colors">-</button>
                      <span className="font-label-md text-label-md px-3 border-x border-outline-variant">1</span>
                      <button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container transition-colors">+</button>
                    </div>
                    <span className="font-headline-md text-headline-md text-primary">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-secondary-container/20 rounded-lg p-4 flex items-start gap-3 mt-4 border border-secondary-container">
              <span className="material-symbols-outlined text-secondary mt-0.5">storefront</span>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">Pago y Entrega en Tienda</h4>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Pay comfortably when you pick up your order at our 5 Señores, Oaxaca location. Items are reserved for 48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-[180px]">
            <div className="glass-panel rounded-xl p-8 shadow-sm">
              <h2 className="font-headline-md text-headline-md text-primary border-b border-surface-container-highest pb-4 mb-6">Order Summary</h2>
              <div className="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant mb-6">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-primary font-medium">$210.00</span></div>
                <div className="flex justify-between"><span>Store Pickup</span><span className="text-primary font-medium">Free</span></div>
                <div className="flex justify-between"><span>Estimated Tax</span><span className="text-primary font-medium">$33.60</span></div>
              </div>
              <div className="flex justify-between items-center border-t border-surface-container-highest pt-6 mb-8">
                <span className="font-headline-md text-headline-md text-primary">Total</span>
                <span className="font-headline-md text-headline-md text-primary">$243.60</span>
              </div>
              <Link
                to="/confirmation"
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-full hover:bg-primary-container transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Confirm In-Store Pickup
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <p className="font-body-md text-xs text-center text-on-surface-variant mt-4 opacity-70">
                By confirming, you agree to our Terms of Service regarding in-store reservations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
