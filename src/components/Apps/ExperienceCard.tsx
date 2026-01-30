"use client";

import { Building2 } from "lucide-react";

type ExperienceCardProps = {
  company: string;
  position: string;
  year: string;
  jd: string[];
  tech: string[];
  accent: string;
};

const ExperienceCard = ({
  company,
  position,
  year,
  jd,
  tech,
  accent
}: ExperienceCardProps) => {
  const displayYear = year.replace(/\u2013|\u00e2\u20ac\u2013|\u0101\u2013/g, "-");

  return (
    <div className="bg-white dark:bg-[#141417] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
      <div className={`h-1 w-full ${accent}`} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg ${accent} text-white flex items-center justify-center shadow-sm`}>
            <Building2 size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {company}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">{displayYear}</span>
            </div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">
              {position}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {jd.map((item, index) => (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {item}
            </p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((item, index) => (
            <span
              key={index}
              className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
