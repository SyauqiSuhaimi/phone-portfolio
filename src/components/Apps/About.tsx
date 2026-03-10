"use client";

import { Mail, Github, Linkedin, Globe, User } from "lucide-react";
import Image from "next/image";
import workExperience from "../../../data/work-experience.json";
import ExperienceCard from "./ExperienceCard";

// --- Components ---

const BioCard = () => {
  return (
    <div className="w-full mb-8 relative">
      {/* Card Container */}
      <div className="w-full bg-white dark:bg-[#141417] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 relative z-10">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none" />

        <div className="p-6 sm:p-8 flex flex-col gap-6 relative z-10">
          {/* Header: Chip & Status */}
          <div className="flex justify-between items-center">
            {/* <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold tracking-wider">OPEN TO WORK</span>
                  </div> */}
          </div>

          {/* Identity Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Profile picture */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-100 dark:bg-white/10 border-2 border-gray-200 dark:border-white/20 flex-shrink-0 relative overflow-hidden">
              <Image
                src="/profile_pic.jpeg"
                alt="Profile picture"
                fill
                sizes="(max-width: 640px) 6rem, 7rem"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-2">
                Syauqi Suhaimi
              </h1>
              <p className="text-gray-500 dark:text-white/60 font-mono text-sm tracking-widest uppercase mb-4">
                Fullstack Developer
              </p>

              {/* Bio Text inside card */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light border-l-2 border-gray-200 dark:border-white/20 pl-3">
                I’ve always been fascinated by how technology can bridge the gap
                between an idea and a high-performance reality. My journey as a
                developer has led me through a diverse range of stacks, from
                building dynamic, reactive frontends with Vue and React to
                crafting robust backends using .Net and C#. I thrive on solving
                complex problems and am passionate about creating seamless user
                experiences. I’m eager to continue growing and contributing to
                innovative projects that make a difference.
              </p>
            </div>
          </div>

          {/* Specs / Footer */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-black/5 dark:border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">
                Location
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                Malaysia
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">
                Exp
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                3+ Years
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">
                Role
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                Fullstack Developer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, href, color }: any) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 group"
  >
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-95 ${color}`}
    >
      <Icon size={20} />
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
      {label}
    </span>
  </a>
);

const ListGroup = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    {title && (
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-4">
        {title}
      </h3>
    )}
    <div className="">{children}</div>
  </div>
);

// --- Main App ---

const About = () => {
  const accents = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-rose-500",
  ];

  return (
    <div className="min-h-full pb-10 px-4 pt-2">
      <BioCard />

      {/* Quick Actions */}
      <div className="flex justify-evenly mb-8">
        <QuickAction
          icon={Mail}
          label="Email"
          href="mailto:muhammadsyauqi122@gmail.com"
          color="bg-blue-500"
        />
        {/* <QuickAction
          icon={Github}
          label="GitHub"
          href="https://github.com/SyauqiSuhaimi"
          color="bg-gray-800 dark:bg-gray-700"
        /> */}
        <QuickAction
          icon={Linkedin}
          label="LinkedIn"
          href="https://www.linkedin.com/in/muhammad-syauqi-64b52118b/"
          color="bg-blue-600"
        />
        <QuickAction
          icon={Globe}
          label="Website"
          href="https://www.syauqisuhaimi.my/"
          color="bg-green-500"
        />
      </div>

      <ListGroup title="Experience">
        <div className="grid gap-3">
          {workExperience.map((role, index) => (
            <ExperienceCard
              key={`${role.company}-${role.position}-${role.year}`}
              company={role.company}
              position={role.position}
              year={role.year}
              jd={role.jd}
              tech={role.tech}
              accent={accents[index % accents.length]}
            />
          ))}
        </div>
      </ListGroup>
    </div>
  );
};

export default About;
