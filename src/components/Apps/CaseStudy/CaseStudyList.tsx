import { motion } from "framer-motion";
import Image from "next/image";
import { CaseStudy } from "../../../data/caseStudies";
import { ArrowUpRight } from "lucide-react";

interface CaseStudyListProps {
  studies: CaseStudy[];
  onSelect: (id: string) => void;
}

const CaseStudyList = ({ studies, onSelect }: CaseStudyListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-y-auto"
    >
      <div className="px-5 pb-20 flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6">
        {studies.map((study, index) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(study.id)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/9] shadow-md dark:shadow-none">
              <Image
                src={study.heroImage}
                alt={study.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                <div className="inline-flex mb-2 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  {study.category}
                </div>

                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:underline underline-offset-4 decoration-white/40">
                    {study.title}
                  </h2>
                  <ArrowUpRight
                    className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-white/80 flex-shrink-0"
                    size={22}
                  />
                </div>

                <p className="text-white/85 text-sm md:text-base leading-relaxed mt-1">
                  {study.subtitle}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-white/75 uppercase tracking-wider">
                  <span>{study.date}</span>
                  <span>-</span>
                  <span>{study.readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CaseStudyList;
