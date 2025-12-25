"use client";

import { motion } from "framer-motion";

type SearchPanelProps = {
  onClose: () => void;
};

const SearchPanel = ({ onClose }: SearchPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md z-[400] flex flex-col items-center pt-16"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-[90%] flex flex-col gap-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl px-4 py-3 flex items-center gap-2.5">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search Apps, Projects, Skills..."
            className="bg-transparent border-none text-white text-base w-full outline-none"
            autoFocus
          />
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm text-os-text-muted mb-2.5 ml-1">Siri Suggestions</h3>
          <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-xl flex items-center gap-2.5 mb-2">
            <div className="text-2xl">🚀</div>
            <span className="text-white">Projects</span>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-xl flex items-center gap-2.5">
            <div className="text-2xl">✉️</div>
            <span className="text-white">Contact</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchPanel;
