"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "../../context/ThemeContext";
import projectsData from "../../../data/projects.json"; // Assuming your projects are here
import {
  ChevronLeft,
  Share,
  Calendar,
  Star,
  Download,
  X,
  LayoutGrid,
} from "lucide-react";

// Types
type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  type: string[];
};

// --- Sub-components ---

const FeaturedCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl mb-8 cursor-pointer group"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="absolute top-5 left-5">
        <span className="text-white/80 font-semibold text-xs uppercase tracking-wider bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          Featured App
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="text-white/60 text-sm font-medium mb-1 uppercase tracking-wide">
          {project.tech[0] || "New Release"}
        </h3>
        <h2 className="text-white text-3xl font-bold leading-tight mb-2">
          {project.title}
        </h2>
        <p className="text-white/80 text-sm line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {/* Fake user avatars for social proof */}
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">
              AS
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">
              +9
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-md text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-white/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            GET
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const AppListRow = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-2 rounded-xl transition-colors"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 relative">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="64px"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-black dark:text-white font-semibold text-base truncate">
          {project.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <button className="bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-bold text-xs py-1.5 px-4 rounded-full uppercase">
        Get
      </button>
    </div>
  );
};

const ProductPage = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-white dark:bg-black z-50 overflow-y-auto"
    >
      {/* Header Image */}
      <div className="relative w-full h-64">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="100vw"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        {/* Icon & Title Block */}
        <div className="flex gap-4 mb-6">
          <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden bg-white shadow-xl border-4 border-white dark:border-black">
            <Image
              src={project.image}
              alt={`${project.title} icon`}
              fill
              sizes="96px"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pt-12 flex-1">
            <h1 className="text-xl font-bold text-black dark:text-white leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold text-center py-3.5 rounded-full mb-8 shadow-lg shadow-blue-600/30"
        >
          OPEN PROJECT
        </a>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black dark:text-white mb-3">
            About this project
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-black dark:text-white mb-3">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="h-10" />
      </div>
    </motion.div>
  );
};

// --- Main Component ---

const BrowseOverview = ({
  projects,
  onSelectCategory,
}: {
  projects: Project[];
  onSelectCategory: (type: "stack" | "type", value: string) => void;
}) => {
  const stacks = Array.from(new Set(projects.flatMap((p) => p.tech))).sort();
  // Flatten project types if array, or map if string for temporary safety
  const types = [
    "SaaS",
    "Web App",
    "Mobile App",
    "Tool",
    "Landing Page",
  ].filter((t) =>
    projects.some((p) =>
      Array.isArray(p.type) ? p.type.includes(t) : p.type === t,
    ),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stack Section */}
      <div>
        <h2 className="text-lg font-bold mb-4 px-1">Browse by Stack</h2>
        <div className="flex flex-wrap gap-2">
          {stacks.map((stack) => (
            <button
              key={stack}
              onClick={() => onSelectCategory("stack", stack)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {stack}
            </button>
          ))}
        </div>
      </div>

      {/* Type Section */}
      <div>
        <h2 className="text-lg font-bold mb-4 px-1">Browse by Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onSelectCategory("type", type)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-left font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <h3 className="font-bold text-base mb-1">{type}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {
                  projects.filter((p) =>
                    Array.isArray(p.type)
                      ? p.type.includes(type)
                      : p.type === type,
                  ).length
                }{" "}
                Projects
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppStore = () => {
  const [activeTab, setActiveTab] = useState<"today" | "apps" | "browse">(
    "today",
  );
  const [browseView, setBrowseView] = useState<"overview" | "list">("overview");
  const [activeFilter, setActiveFilter] = useState<{
    type: "stack" | "type";
    value: string;
  } | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projects = projectsData as Project[];

  const filteredProjects = activeFilter
    ? projects.filter((p) =>
        activeFilter.type === "stack"
          ? p.tech.includes(activeFilter.value)
          : p.type.includes(activeFilter.value),
      )
    : [];

  const featuredProject = projects[0]; // Assume first is featured
  const otherProjects = projects.slice(1);

  return (
    <div className="relative w-full h-full bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-end justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === "today"
              ? "Today"
              : activeTab === "apps"
                ? "Apps"
                : "Browse"}
          </h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden">
          {/* User avatar placeholder */}
          <span className="text-xs font-bold">Sy</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FeaturedCard
                project={featuredProject}
                onClick={() => setSelectedProject(featuredProject)}
              />

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">More to Explore</h2>
                  <button
                    onClick={() => setActiveTab("apps")}
                    className="text-blue-500 text-sm font-semibold"
                  >
                    See All
                  </button>
                </div>
                {otherProjects.map((p) => (
                  <AppListRow
                    key={p.id}
                    project={p}
                    onClick={() => setSelectedProject(p)}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === "apps" && (
            <motion.div
              key="apps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {projects.map((p) => (
                <AppListRow
                  key={p.id}
                  project={p}
                  onClick={() => setSelectedProject(p)}
                />
              ))}
            </motion.div>
          )}
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {browseView === "overview" ? (
                <BrowseOverview
                  projects={projects}
                  onSelectCategory={(type, value) => {
                    setActiveFilter({ type, value });
                    setBrowseView("list");
                  }}
                />
              ) : (
                <div className="animate-in slide-in-from-right-8 duration-300">
                  <button
                    onClick={() => setBrowseView("overview")}
                    className="flex items-center gap-1 text-blue-500 font-semibold mb-4 -ml-2 hover:bg-blue-500/10 px-2 py-1 rounded-lg transition-colors w-fit"
                  >
                    <ChevronLeft size={20} />
                    Back to Browse
                  </button>
                  <h2 className="text-xl font-bold mb-4">
                    {activeFilter?.type === "stack" ? "Built with " : ""}
                    <span className="text-blue-500">{activeFilter?.value}</span>
                  </h2>
                  {filteredProjects.length === 0 ? (
                    <p className="text-gray-500">No projects found.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredProjects.map((p) => (
                        <AppListRow
                          key={p.id}
                          project={p}
                          onClick={() => setSelectedProject(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 flex items-start justify-around py-3 z-30">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "today" ? "text-blue-500" : "text-gray-400"}`}
        >
          <Calendar size={24} strokeWidth={activeTab === "today" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Today</span>
        </button>
        <button
          onClick={() => setActiveTab("apps")}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "apps" ? "text-blue-500" : "text-gray-400"}`}
        >
          <div className="relative">
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === "apps" ? "2.5" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Apps</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("browse");
            setBrowseView("overview");
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "browse" ? "text-blue-500" : "text-gray-400"}`}
        >
          <LayoutGrid
            size={24}
            strokeWidth={activeTab === "browse" ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium">Browse</span>
        </button>
      </div>

      {/* Product Page Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProductPage
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default AppStore;
