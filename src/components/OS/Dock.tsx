"use client";

type DockProps = {
  onAppClick: (appId: string, origin?: DOMRect) => void;
};

const Dock = ({ onAppClick }: DockProps) => {
  const dockApps = [
    { id: 'phone', icon: '📞', color: '#34C759' },
    { id: 'mail', icon:' ✉️', color: '#007AFF' },
    { id: 'safari', icon: '🧭', color: '#007AFF' },
    { id: 'music', icon: '🎵', color: '#FF2D55' },
  ];

  return (
    <div className="absolute bottom-5 w-full flex justify-center z-[100]">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 flex gap-4 shadow-xl">
        {dockApps.map((app) => (
          <div
            key={app.id}
            className="transition-transform duration-200 hover:translate-y-[-10px] hover:scale-110 cursor-pointer"
            onClick={() => onAppClick(app.id)}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white shadow-md"
              style={{ background: app.color }}
            >
              {app.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dock;
