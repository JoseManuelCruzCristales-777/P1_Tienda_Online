import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  CircleUser,
  Heart,
  Instagram,
  Mail,
  MapPin,
  ScanFace,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Watch,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems: { to: string; label: string; Icon: LucideIcon }[] = [
  { to: "/", label: "New Collection", Icon: Star },
  { to: "/product", label: "Boutique", Icon: Store },
  { to: "/product", label: "Perfumes", Icon: Sparkles },
  { to: "/product", label: "Skincare", Icon: ScanFace },
  { to: "/product", label: "Accessories", Icon: Watch },
];

const iconStroke = "stroke-[1.5]";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex w-full max-w-container-max flex-col px-margin-mobile py-4 md:px-margin-desktop">
        <div className="flex w-full items-center justify-between gap-4 md:gap-gutter">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition-opacity duration-300 hover:opacity-70 sm:gap-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-primary font-headline-md text-lg text-on-primary">
              R
            </div>
            <span className="hidden font-headline-lg text-headline-lg font-medium tracking-tight text-primary sm:block">
              Rousse Shopping
            </span>
          </Link>

          <div className="relative mx-auto hidden min-w-0 max-w-2xl flex-1 md:block">
            <div className="flex items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 transition-colors duration-300 focus-within:border-primary focus-within:bg-surface">
              <Search
                aria-hidden
                className={cn("mr-2 size-5 shrink-0 text-outline", iconStroke)}
              />
              <input
                type="search"
                className="w-full min-w-0 border-none bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-0"
                placeholder="Search boutiques, perfumes, accessories..."
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <button
              type="button"
              aria-label="Wishlist, 2 items"
              className="relative text-on-surface-variant transition-opacity duration-300 hover:opacity-70"
            >
              <Heart aria-hidden className={cn("size-6", iconStroke)} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary">
                2
              </span>
            </button>
            <Link
              to="/bag"
              aria-label="Shopping bag, 2 items"
              className="relative text-on-surface-variant transition-opacity duration-300 hover:opacity-70"
            >
              <ShoppingBag aria-hidden className={cn("size-6", iconStroke)} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                2
              </span>
            </Link>
            <Link
              to="/login"
              aria-label="Sign in"
              className="text-on-surface-variant transition-colors duration-300 hover:text-primary"
            >
              <CircleUser aria-hidden className={cn("size-6", iconStroke)} />
            </Link>
            <button
              type="button"
              aria-label="Search"
              className="text-on-surface-variant transition-opacity duration-300 hover:opacity-70 md:hidden"
            >
              <Search aria-hidden className={cn("size-6", iconStroke)} />
            </button>
          </div>
        </div>

        <nav
          aria-label="Shop categories"
          className="hide-scrollbar mt-6 hidden w-full items-center justify-center overflow-x-auto whitespace-nowrap border-t border-surface-container-highest pt-4 md:flex"
        >
          <ul className="flex items-center gap-6 px-4 lg:gap-8">
            {navItems.map((item, idx) => {
              const { Icon } = item;
              const isActive = idx === 0;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 transition-colors duration-200",
                      isActive
                        ? "border-b-2 border-primary font-bold text-primary"
                        : "border-b-2 border-transparent text-on-surface-variant hover:text-primary",
                    )}
                  >
                    <Icon
                      aria-hidden
                      className={cn("size-5 shrink-0", iconStroke, isActive && "fill-primary/10")}
                    />
                    <span className="font-label-md text-label-md uppercase tracking-widest">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-surface-container-highest bg-surface-container">
      <div className="mx-auto grid w-full max-w-container-max grid-cols-1 gap-stack-lg px-margin-mobile py-stack-lg md:grid-cols-3 md:px-margin-desktop">
        <div className="flex flex-col gap-6">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            Rousse Shopping
          </span>
          <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
            Elevating your lifestyle with curated premium fashion, exclusive fragrances, and
            timeless accessories.
          </p>
          <div className="mt-2 flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram aria-hidden className={cn("size-5", iconStroke)} />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <Mail aria-hidden className={cn("size-5", iconStroke)} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-widest text-primary">
            Explore
          </h4>
          <ul className="flex flex-col gap-3">
            {["Location", "Hours", "Contact", "WhatsApp", "Facebook"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-widest text-primary">
            Visit Us
          </h4>
          <div className="group relative h-40 w-full overflow-hidden rounded bg-surface-variant">
            <img
              alt="Map of Oaxaca location"
              className="h-full w-full object-cover opacity-80 grayscale transition-opacity group-hover:opacity-100 group-hover:grayscale-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFZG9TMJp1TjIT18sJ_nCkgPtnxUL8qn5HV-9pIOmpVa1hUrDNUct8FOdsfLLkbJT4xrtG0PSjPjfPdcpQaYGWF4oWThBNvPuCJJMzmFaYMpAxw29UoG3G9QYWEa9Xf7Xg4mzdQ3vzCBg8FRQIvmP5oXDJN7TmOZuQr4xamb8cgQTT1edlREESY-WICFheyOLreegPvc8WgJdWkZU7uYrcJ3cmHayw9VRVkA85TNtfteJICP3TJfj3ZinWhxQyarl3c8nIS4yey3g"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <MapPin
                aria-hidden
                className={cn("size-8 text-secondary drop-shadow-md", iconStroke)}
                fill="currentColor"
              />
            </div>
          </div>
          <p className="mt-2 font-body-md text-body-md text-sm text-on-surface-variant">
            5 Señores, Oaxaca.
            <br />
            Open Mon-Sat: 10am - 8pm
          </p>
        </div>
      </div>
      <div className="w-full border-t border-surface-container-highest">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 px-margin-mobile py-6 md:flex-row md:px-margin-desktop">
          <span className="font-body-md text-sm text-on-surface-variant">
            © 2024 Rousse Shopping. 5 Señores, Oaxaca.
          </span>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
