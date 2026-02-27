import { useMemo, useState } from "react";

type SurfaceId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";

const SURFACES: Array<{ id: SurfaceId; d: string }> = [
  { id: "s1", d: "M40 40 H120 V110 H40 Z" },
  { id: "s2", d: "M135 40 H215 V110 H135 Z" },
  { id: "s3", d: "M230 40 H310 V110 H230 Z" },
  { id: "s4", d: "M40 125 H120 V195 H40 Z" },
  { id: "s5", d: "M135 125 H215 V195 H135 Z" },
  { id: "s6", d: "M230 125 H310 V195 H230 Z" },
];

const COLORS = [
  { name: "Default", value: "#f8fafc" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Green", value: "#4ade80" },
  { name: "Yellow", value: "#facc15" },
  { name: "Red", value: "#f87171" },
  { name: "Purple", value: "#a78bfa" },
];

export const SurfaceAnnotationDemo = () => {
  const [selected, setSelected] = useState<SurfaceId>("s1");
  const [fills, setFills] = useState<Record<SurfaceId, string>>({
    s1: "#f8fafc",
    s2: "#f8fafc",
    s3: "#f8fafc",
    s4: "#f8fafc",
    s5: "#f8fafc",
    s6: "#f8fafc",
  });

  const selectedColor = useMemo(() => fills[selected], [fills, selected]);

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-[1fr_180px]">
      <div className="p-3 md:p-4">
        <div className="w-full h-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 flex items-center justify-center">
          <svg
            viewBox="0 0 350 240"
            className="w-full h-full max-h-[260px] p-3"
            aria-label="Interactive surface map"
          >
            {SURFACES.map((surface) => {
              const isSelected = selected === surface.id;
              return (
                <path
                  key={surface.id}
                  d={surface.d}
                  fill={fills[surface.id]}
                  stroke={isSelected ? "#2563eb" : "#94a3b8"}
                  strokeWidth={isSelected ? 4 : 2}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => setSelected(surface.id)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 p-3">
        <div className="text-xs font-semibold mb-2">Surface Settings</div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
          Selected: <span className="font-medium uppercase">{selected}</span>
        </div>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() =>
                setFills((prev) => ({ ...prev, [selected]: color.value }))
              }
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded border text-xs text-left transition ${
                selectedColor === color.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-black/10 dark:border-white/10"
              }`}
            >
              <span
                className="w-4 h-4 rounded border border-black/20"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
