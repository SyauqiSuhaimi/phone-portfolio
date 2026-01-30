"use client";

import { apps } from "../../config/apps";
import { useTheme } from "../../context/ThemeContext";

type AppGridProps = {
  onAppClick: (appId: string, origin?: DOMRect) => void;
};

const AppGrid = ({ onAppClick }: AppGridProps) => {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-5 gap-x-2.5 px-5 w-full mt-5">
      {apps.map((app) => {
        const AppIcon = app.icon;
        return (
          <button
            key={app.id}
            type="button"
            className="group flex flex-col items-center gap-2 cursor-pointer active:scale-90 active:opacity-80 transition-transform duration-200 "
            onClick={(event) =>
              onAppClick(app.id, event.currentTarget.getBoundingClientRect())
            }
          >
            {app.type === "folder" ? (
              <div
                className={`w-16 h-16 rounded-2xl p-2 shadow-lg backdrop-blur-xl border border-white/10 ${
                  theme === "dark"
                    ? "bg-black/40 group-hover:bg-black/50"
                    : "bg-white group-hover:bg-white/70"
                } transition-colors`}
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
                  {(app.apps ?? []).slice(0, 4).map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <div
                        key={child.id}
                        className={`rounded-lg flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-black/10 text-black"
                        }`}
                      >
                        <ChildIcon size={14} strokeWidth={1.5} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-xl border border-white/10  ${
                  theme === "dark"
                    ? "bg-black/40 hover:bg-black/10 text-white group-hover:bg-black/50"
                    : "bg-white text-black group-hover:bg-white/50"
                } transition-colors`}
              >
                <AppIcon size={32} strokeWidth={1.5} />
              </div>
            )}
            <span className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-black'} text-shadow-sm font-medium`}>{app.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AppGrid;
