import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Reservation Confirmed — Rousse Shopping" },
      { name: "description", content: "Your in-store reservation is confirmed." },
      { property: "og:title", content: "Reservation Confirmed" },
      { property: "og:description", content: "Your exclusive items have been reserved." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      <header className="w-full px-margin-mobile md:px-margin-desktop py-stack-md flex justify-center items-center absolute top-0 z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline-md shadow-[0_4px_10px_rgba(0,0,0,0.1)]">R</div>
          <span className="font-headline-md text-headline-md font-medium text-primary tracking-tight">Rousse Shopping</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center relative px-margin-mobile md:px-margin-desktop py-[120px] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-tertiary-fixed/30 rounded-full blur-[60px] -z-10 mix-blend-multiply" />

        <div className="w-full max-w-[800px] mx-auto z-10 relative">
          <div className="glass-panel rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-12 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-fixed to-secondary" />

            <div className="mb-stack-lg relative">
              <div className="absolute inset-0 bg-secondary-fixed/30 rounded-full animate-ping opacity-50" />
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_10px_30px_rgba(7,6,40,0.2)] relative z-10 border-4 border-surface-container-lowest">
                <span className="material-symbols-outlined text-on-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-primary mb-stack-sm tracking-tight">Reservation Confirmed</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px] mx-auto mb-stack-lg">
              Your exclusive items have been reserved. A confirmation email has been sent to your inbox.
            </p>

            <div className="w-full bg-surface-container-lowest rounded-lg border border-surface-variant p-stack-md mb-stack-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-stack-md text-left">
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-outline">Reservation ID</span>
                <span className="font-body-md text-body-md text-primary font-medium tracking-wide">#RS-2948-Boutique</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-outline">Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" />
                  <span className="font-body-md text-body-md text-on-surface">Awaiting Pickup</span>
                </div>
              </div>
              <div className="md:col-span-2 pt-stack-sm border-t border-surface-variant mt-2 flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Estimated Total</span>
                <span className="font-headline-md text-headline-md text-primary">$1,250.00</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-stack-sm w-full justify-center">
              <Link
                to="/"
                className="group relative overflow-hidden bg-transparent border border-primary text-primary px-8 py-4 rounded-full font-label-md text-label-md transition-all duration-300 hover:bg-surface-variant flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Continue Shopping
              </Link>
              <button className="group relative overflow-hidden bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md transition-all duration-300 shadow-[0_10px_20px_rgba(7,6,40,0.15)] hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(7,6,40,0.2)] flex items-center justify-center gap-2">
                Contact via WhatsApp
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
