"use client";

import React, { useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import techTreeData from "../../../data/tech_tree.json";

// --- Types ---

type TechNode = {
  id: string;
  label: string;
  icon: string;
  parents?: string[];
  category: string;
};

type TechLevel = {
  id: number;
  title: string;
  nodes: TechNode[];
};

type TreeData = {
  levels: TechLevel[];
};

// --- Helper Components ---

const ConnectorLines = ({ 
  levels, 
  nodePositions 
}: { 
  levels: TechLevel[], 
  nodePositions: Map<string, { x: number, y: number }> 
}) => {
  if (nodePositions.size === 0) return null;

  const lines: React.ReactNode[] = [];

  levels.forEach((level) => {
    level.nodes.forEach((node) => {
      if (node.parents) {
        node.parents.forEach((parentId) => {
          const start = nodePositions.get(parentId);
          const end = nodePositions.get(node.id);

          if (start && end) {
            lines.push(
              <motion.path
                key={`${parentId}-${node.id}`}
                d={`M ${start.x} ${start.y} C ${start.x} ${start.y + 50}, ${end.x} ${end.y - 50}, ${end.x} ${end.y}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            );
          }
        });
      }
    });
  });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {lines}
    </svg>
  );
};

// --- Main Component ---

const SkillsTree = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const levels = (techTreeData as TreeData).levels;
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);

  // We need to calculate logical positions for lines. 
  // Since we are using standard CSS flex/grid for layout, we can approximate 
  // positions based on row index and item index for the SVG lines.
  
  // Hardcoded approximate positions for the demo (in real app, use useLayoutEffect to measure)
  // Assumes a fixed container width behavior or simplified logic
  const getNodePosition = (levelIndex: number, nodeIndex: number, totalNodes: number) => {
     // Center X is 50%. Total Width can be assumed 100 units for SVG viewbox
     // But simpler: use % in SVG? No, need coords.
     // Let's assume a 400px wide container for calculations
     const width = 400; // approximation
     const levelHeight = 160;
     const topOffset = 60;
     
     const y = levelIndex * levelHeight + topOffset;
     const sector = width / totalNodes;
     const x = sector * nodeIndex + (sector / 2);
     
     return { x, y };
  };

  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number, y: number }>();
    levels.forEach((level, lvlIdx) => {
       level.nodes.forEach((node, nodeIdx) => {
           // We use percentages for the SVG to make it responsive-ish
           // 100% width = 100 viewbox units
           const y = lvlIdx * 180 + 50; 
           const gap = 100 / level.nodes.length;
           const x = (gap * nodeIdx) + (gap / 2);
           map.set(node.id, { x, y });
       });
    });
    return map;
  }, [levels]);

  return (
    <div className="relative w-full min-h-full bg-black text-white overflow-hidden flex flex-col items-center pb-20 select-none">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* SVG Container for Connecting Lines */}
      {/* We use a specialized coordinate system 0-100 for X, and variable for Y based on content height */}
      <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 100 800" preserveAspectRatio="none">
             <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
            </defs>
            {levels.map(level => (
                level.nodes.map(node => (
                    node.parents?.map(parentId => {
                        const start = nodePositions.get(parentId);
                        const end = nodePositions.get(node.id);
                        if (!start || !end) return null;
                        return (
                            <motion.path
                                key={`${parentId}-${node.id}`}
                                d={`M ${start.x} ${start.y} C ${start.x} ${start.y + 60}, ${end.x} ${end.y - 60}, ${end.x} ${end.y}`}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="0.5"
                                style={{ pathLength: 1 }}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                            />
                        )
                    })
                ))
            ))}
         </svg>
      </div>

      {levels.map((level, lvlIdx) => (
        <div key={level.id} className="relative z-10 w-full mb-12 last:mb-0">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-6"
          >
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                 Level {level.id}
             </h3>
             <h2 className="text-sm font-semibold text-white/80">{level.title}</h2>
          </motion.div>

          <div className="flex justify-around items-center px-4">
             {level.nodes.map((node) => (
                 <motion.button
                    key={node.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNode(node)}
                    className="flex flex-col items-center gap-2 group relative"
                 > 
                    {/* Node Circle */}
                    <div className={`w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                        ${selectedNode?.id === node.id ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : ''}
                    `}>
                        <Image
                            src={node.icon}
                            alt={node.label}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain drop-shadow-lg"
                        />
                        
                        {/* Connecting Dot Top (Input) */}
                        {lvlIdx > 0 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full" />}
                        {/* Connecting Dot Bottom (Output) */}
                        {lvlIdx < levels.length - 1 && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />}
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm group-hover:text-cyan-300 transition-colors">
                        {node.label}
                    </span>
                 </motion.button>
             ))}
          </div>
        </div>
      ))}

      {/* Detail Overlay */}
      <AnimatePresence>
         {selectedNode && (
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 bg-gray-900/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl z-50 flex gap-4 items-center"
             >
                 <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-2">
                     <Image
                        src={selectedNode.icon}
                        alt={selectedNode.label}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                     />
                 </div>
                 <div className="flex-1">
                     <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                     <p className="text-xs text-cyan-400 font-mono uppercase">Mastery: Unlocked</p>
                 </div>
                 <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                 >
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                 </button>
             </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsTree;
