import { motion } from 'framer-motion';
import { CaseStudy } from '../../../data/caseStudies';
import { ArrowUpRight } from 'lucide-react';

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
            {/* Header */}
            <div className="pt-16 pb-8 px-6">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Editorial</p>
                <h1 className="text-4xl font-serif font-bold leading-tight">
                    Engineering <br/> <span className="italic font-light">Chronicles</span>
                </h1>
            </div>

            {/* List */}
            <div className="px-5 pb-20 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6">
                {studies.map((study, index) => (
                    <motion.div
                        key={study.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(study.id)}
                        className="group cursor-pointer flex flex-col gap-4"
                    >
                        {/* Image Card */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/9] shadow-md dark:shadow-none">
                            <img 
                                src={study.heroImage} 
                                alt={study.title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {study.category}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold leading-tight mb-2 group-hover:underline underline-offset-4 decoration-2 decoration-gray-300 dark:decoration-gray-700">
                                    {study.title}
                                </h2>
                                <ArrowUpRight className="opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-gray-400" size={24} />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {study.subtitle}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                <span>{study.date}</span>
                                <span>•</span>
                                <span>{study.readTime}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CaseStudyList;
