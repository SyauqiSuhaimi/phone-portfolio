"use client";

import { useTheme } from "../../context/ThemeContext";
import skills from "../../../data/skills.json";

const Skills = () => {
  const { theme } = useTheme();

  return (
    <div className="text-white p-0">
      <h2 className="text-2xl font-bold mb-5">Technical Skills</h2>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-5 gap-x-2.5">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="group flex flex-col items-center gap-2"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center  transition-colors`}
            >
              <img
                src={skill.src}
                alt={skill.name}
                className=" object-contain"
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
        ))}
      </div>
    </div>
  );
};

export default Skills;
