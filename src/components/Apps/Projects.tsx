"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import projects from "../../../data/projects.json";

type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
};

const projectList = projects as Project[];

const Projects = () => {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);

  const remaining = useMemo(
    () => projectList.slice(index, index + 3),
    [index]
  );

  const openLink = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleSwipe = () => {
    setIndex((current) =>
      current + 1 < projectList.length ? current + 1 : 0
    );
  };

  return (
    <div className="text-white pb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Project Deck</h2>
        <span className="text-xs text-white/60">Swipe left/right</span>
      </div>
      <div className="relative h-[420px] sm:h-[380px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {remaining
            .slice(1)
            .reverse()
            .map((project, stackIndex) => {
              const depth = remaining.length - (stackIndex + 2);
              const offset = depth * 14;
              const scale = 1 - depth * 0.06;

              return (
                <div
                  key={project.id}
                  className="absolute w-full max-w-[420px]"
                  style={{
                    transform: `translateY(${offset}px) scale(${scale})`,
                    zIndex: depth,
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-[32px] border border-white/10 shadow-lg backdrop-blur-xl ${
                      theme === "dark" ? "bg-black/30" : "bg-white/70"
                    }`}
                  >
                    <div className="h-40 sm:h-44 w-full overflow-hidden">
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className="w-full h-full object-cover opacity-80"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/70 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <AnimatePresence mode="popLayout">
          {remaining[0] && (
            <motion.button
              key={remaining[0].id}
              type="button"
              onClick={() => openLink(remaining[0].link)}
              className="absolute inset-0 mx-auto w-full max-w-[420px] text-left pointer-events-auto"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 120) {
                  handleSwipe();
                }
              }}
              style={{ zIndex: 10 }}
            >
              <motion.div
                className={`relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl ${
                  theme === "dark"
                    ? "bg-black/40"
                    : "bg-white/80"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                </div>

                <div className="relative">
                  <div className="h-52 sm:h-56 w-full overflow-hidden">
                    <img
                      src={remaining[0].image}
                      alt={`${remaining[0].title} preview`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {remaining[0].title}
                      </h3>
                      <span className="text-xs text-white/60 hidden sm:inline-flex items-center gap-1">
                        Open
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17L17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mt-2 line-clamp-3">
                      {remaining[0].description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {remaining[0].tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
