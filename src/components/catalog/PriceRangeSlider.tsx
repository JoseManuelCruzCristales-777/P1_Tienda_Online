import { useI18n } from "@/lib/i18n/I18nProvider";
import { parsePriceFilterInput } from "@/lib/catalog/queries";

type PriceRangeSliderProps = {
  minInput: string;
  maxInput: string;
  sliderMax: number;
  onMinInputChange: (value: string) => void;
  onMaxInputChange: (value: string) => void;
};

/**
 * Una sola pista con dos controles (mín / máx) superpuestos.
 * Máx al tope de la pista = sin tope (input vacío).
 */
export function PriceRangeSlider({
  minInput,
  maxInput,
  sliderMax,
  onMinInputChange,
  onMaxInputChange,
}: PriceRangeSliderProps) {
  const { t } = useI18n();

  const minVal = Math.min(parsePriceFilterInput(minInput) ?? 0, sliderMax);
  const maxParsed = parsePriceFilterInput(maxInput);
  const maxVal = maxParsed === null ? sliderMax : Math.min(maxParsed, sliderMax);

  const minPct = sliderMax > 0 ? (minVal / sliderMax) * 100 : 0;
  const maxPct = sliderMax > 0 ? (maxVal / sliderMax) * 100 : 100;
  const overlapThreshold = Math.max(sliderMax * 0.02, 1);
  const minThumbZ = minVal > maxVal - overlapThreshold ? 35 : 20;

  function handleMinChange(next: number) {
    const clamped = Math.max(0, Math.min(next, sliderMax));
    if (maxParsed !== null && clamped > maxParsed) {
      onMaxInputChange(String(clamped));
    }
    onMinInputChange(String(clamped));
  }

  function handleMaxChange(next: number) {
    const clamped = Math.max(0, Math.min(next, sliderMax));
    const currentMin = parsePriceFilterInput(minInput) ?? 0;
    if (clamped < currentMin) {
      onMinInputChange(String(clamped));
    }
    if (clamped >= sliderMax) {
      onMaxInputChange("");
    } else {
      onMaxInputChange(String(clamped));
    }
  }

  return (
    <div className="relative mx-1 h-8 w-full">
      {/* Pista */}
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-surface-container-highest" />
      {/* Rango activo */}
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
      />

      <input
        type="range"
        min={0}
        max={sliderMax}
        step={1}
        value={minVal}
        onChange={(e) => handleMinChange(Number(e.target.value))}
        aria-label={t("catalog_price_min")}
        className="price-range-thumb absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent"
        style={{ zIndex: minThumbZ }}
      />
      <input
        type="range"
        min={0}
        max={sliderMax}
        step={1}
        value={maxVal}
        onChange={(e) => handleMaxChange(Number(e.target.value))}
        aria-label={t("catalog_price_max")}
        className="price-range-thumb absolute inset-0 z-30 h-8 w-full cursor-pointer appearance-none bg-transparent"
      />

      <style>{`
        .price-range-thumb {
          pointer-events: none;
        }
        .price-range-thumb::-webkit-slider-runnable-track {
          height: 0;
          background: transparent;
        }
        .price-range-thumb::-moz-range-track {
          height: 0;
          background: transparent;
        }
        .price-range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          height: 1rem;
          width: 1rem;
          margin-top: -0.375rem;
          border-radius: 9999px;
          border: 2px solid var(--color-primary, #070628);
          background: var(--color-surface, #fff);
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          cursor: grab;
        }
        .price-range-thumb::-moz-range-thumb {
          pointer-events: auto;
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          border: 2px solid var(--color-primary, #070628);
          background: var(--color-surface, #fff);
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          cursor: grab;
        }
      `}</style>
    </div>
  );
}
