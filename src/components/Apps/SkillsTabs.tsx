"use client";

import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import skills from "../../../data/skills.json";

type Skill = {
  name: string;
  src: string;
};

type SkillCategory = {
  id: string;
  label: string;
  names: string[];
};

const BASE_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    names: ["React", "Next.js", "Vue", "Angular JS", "Quasar"],
  },
  {
    id: "backend",
    label: "Backend",
    names: [".NET", "NestJS", "PHP"],
  },
  {
    id: "languages",
    label: "Languages",
    names: ["TypeScript", "JavaScript"],
  },
  {
    id: "styling",
    label: "Styling",
    names: ["Tailwind", "Bootstrap", "HTML", "CSS"],
  },
];

const SkillsTabs = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(BASE_CATEGORIES[0]?.id ?? "");

  const { categories, skillsByName } = useMemo(() => {
    const skillMap = new Map<string, Skill>(
      (skills as Skill[]).map((skill) => [skill.name, skill])
    );
    const usedNames = new Set(
      BASE_CATEGORIES.flatMap((category) => category.names)
    );
    const otherSkills = (skills as Skill[]).filter(
      (skill) => !usedNames.has(skill.name)
    );

    const categoriesWithOther =
      otherSkills.length > 0
        ? [
            ...BASE_CATEGORIES,
            { id: "other", label: "Other", names: otherSkills.map((s) => s.name) },
          ]
        : BASE_CATEGORIES;

    return { categories: categoriesWithOther, skillsByName: skillMap };
  }, []);

  const activeCategory =
    categories.find((category) => category.id === activeTab) ?? categories[0];

  return (
    <div className="text-white p-0">
      <h2 className="text-2xl font-bold mb-3">Technical Skills</h2>
      <p className="text-xs text-white/70 mb-4">
        Swipe or tap a category to see the focused stack.
      </p>
      <div
        role="tablist"
        aria-label="Skill categories"
        className="flex gap-2 overflow-x-auto pb-2 mb-4"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory?.id;
          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(category.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : theme === "dark"
                  ? "bg-white/10 text-white"
                  : "bg-black/10 text-black"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-y-5 gap-x-2.5">
        {activeCategory?.names.map((name) => {
          const skill = skillsByName.get(name);
          if (!skill) return null;
          return (
            <div key={skill.name} className="group flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors">
                <img
                  src={skill.src}
                  alt={skill.name}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <span
                className={`text-xs text-shadow-sm font-medium text-center ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsTabs;
