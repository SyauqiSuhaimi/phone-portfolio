import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CaseStudyList from "./CaseStudyList";
import CaseStudyDetail from "./CaseStudyDetail";
import { caseStudies, CaseStudy } from "../../../data/caseStudies";

const CaseStudyApp = () => {
  const [activeStudyId, setActiveStudyId] = useState<string | null>(null);

  const activeStudy = caseStudies.find((s) => s.id === activeStudyId) || null;

  return (
    <div className="w-full h-full  text-black dark:text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {activeStudy ? (
          <CaseStudyDetail
            key="detail"
            study={activeStudy}
            onBack={() => setActiveStudyId(null)}
          />
        ) : (
          <CaseStudyList
            key="list"
            studies={caseStudies}
            onSelect={(id) => setActiveStudyId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseStudyApp;
