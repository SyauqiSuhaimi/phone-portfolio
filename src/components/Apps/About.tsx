"use client";

import { 
  Mail, 
  Github, 
  Linkedin, 
  Globe, 
  User
} from "lucide-react";
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
                 {/* Image Placeholder */}
                 <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-100 dark:bg-white/10 border-2 border-gray-200 dark:border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md relative overflow-hidden group">
                     {/* Replace this div with an <img> tag later */}
                     <User size={40} className="text-gray-400 dark:text-white/40" />
                     <div className="absolute inset-0 bg-white/80 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-[10px] text-gray-700 dark:text-white">Add Photo</span>
                     </div>
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
                        Passionate software developer focused on web and app development, with a preference for front-end. Skilled in performance optimization and user experience.
                     </p>
                 </div>
             </div>

             {/* Specs / Footer */}
             <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-black/5 dark:border-white/10">
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">Location</span>
                     <span className="text-sm text-gray-900 dark:text-white font-medium">Malaysia</span>
                 </div>
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">Exp</span>
                     <span className="text-sm text-gray-900 dark:text-white font-medium">4+ Years</span>
                 </div>
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">Stack</span>
                     <span className="text-sm text-gray-900 dark:text-white font-medium">Fullstack</span>
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
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-95 ${color}`}>
       <Icon size={20} />
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
  </a>
);

const ListGroup = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="mb-6">
        {title && <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-4">{title}</h3>}
        <div className="">
            {children}
        </div>
    </div>
);

// --- Main App ---

const About = () => {
  const accents = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-rose-500"
  ];

  return (
    <div className="min-h-full pb-10 px-4 pt-2">
      <BioCard />

      {/* Quick Actions */}
      <div className="flex justify-evenly mb-8">
          <QuickAction icon={Mail} label="Email" href="mailto:syauqi@example.com" color="bg-blue-500" />
          <QuickAction icon={Github} label="GitHub" href="https://github.com" color="bg-gray-800 dark:bg-gray-700" />
          <QuickAction icon={Linkedin} label="LinkedIn" href="https://linkedin.com" color="bg-blue-600" />
          <QuickAction icon={Globe} label="Website" href="https://syauqi.com" color="bg-green-500" />
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
