import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { CaseStudy, CaseStudyBlock } from "../../../data/caseStudies";

// --- Demos ---
// Ideally these would be dynamically imported or in a registry,
// but for now we map them directly for simplicity.
import { WindowPhysicsDemo } from "./Demos/WindowPhysicsDemo";
import { FormBuilderFlowDemo } from "./Demos/FormBuilderFlowDemo";
import { ProcedureBuilderFlowDemo } from "./Demos/ProcedureBuilderFlowDemo";
import { SurfaceAnnotationDemo } from "./Demos/SurfaceAnnotationDemo";

const DEMO_REGISTRY: Record<string, React.FC> = {
  WindowPhysicsDemo: WindowPhysicsDemo,
  FormBuilderFlowDemo: FormBuilderFlowDemo,
  ProcedureBuilderFlowDemo: ProcedureBuilderFlowDemo,
  SurfaceAnnotationDemo: SurfaceAnnotationDemo,
};

interface CaseStudyDetailProps {
  study: CaseStudy;
  onBack: () => void;
}

const CodeBlock = ({
  code,
  language,
  caption,
}: {
  code: string;
  language: string;
  caption?: string;
}) => (
  <div className="my-8 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10">
    <div className="px-4 py-2 bg-gray-100 dark:bg-white/5 border-b border-inherit flex justify-between items-center">
      <span className="text-xs font-mono text-gray-500 uppercase">
        {language}
      </span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
      </div>
    </div>
    <div className="overflow-x-auto p-4">
      <pre className="text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
    {caption && (
      <div className="px-4 py-2 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
        <p className="text-xs text-center text-gray-500 italic">{caption}</p>
      </div>
    )}
  </div>
);

const DemoBlock = ({
  componentName,
  caption,
  height = "300px",
}: {
  componentName: string;
  caption?: string;
  height?: string;
}) => {
  const Component = DEMO_REGISTRY[componentName];

  if (!Component) {
    return (
      <div className="my-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
        {`Demo component "${componentName}" not found.`}
      </div>
    );
  }

  return (
    <div className="my-10">
      <div
        className={`w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-inner bg-gray-100 dark:bg-[#0A0A0A] relative group isolate`}
        style={{ minHeight: height }}
      >
        <div className="absolute inset-x-0 top-0 h-8 z-10 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
        <Component />

        {/* Mobile detailed overlay hint */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {/* Add any overlay hints if needed, currently kept clean */}
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] uppercase font-bold mr-2 align-middle">
            Live Demo
          </span>
          {caption}
        </p>
      )}
    </div>
  );
};

const RenderBlock = ({ block }: { block: CaseStudyBlock }) => {
  switch (block.type) {
    case "text":
      return (
        <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 font-serif mb-6">
          {block.content}
        </p>
      );
    case "heading":
      return (
        <h2 className="text-2xl font-bold mt-12 mb-6 font-sans tracking-tight">
          {block.content}
        </h2>
      );
    case "image":
      return (
        <figure className="my-8">
          <Image
            src={block.src}
            alt={block.caption || ""}
            width={1000}
            height={600}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto rounded-xl shadow-lg"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "code":
      return (
        <CodeBlock
          code={block.code}
          language={block.language}
          caption={block.caption}
        />
      );
    case "demo":
      return (
        <DemoBlock
          componentName={block.componentName}
          caption={block.caption}
          height={block.height}
        />
      );
    default:
      return null;
  }
};

const CaseStudyDetail = ({ study, onBack }: CaseStudyDetailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  // Parallax logic for Hero Image
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-white dark:bg-black z-50 overflow-hidden flex flex-col"
    >
      {/* Navbar (Absolute to overlay hero) */}
      <div className="absolute top-0 left-0 w-full z-20 p-5 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={study.heroImage}
              alt={study.title}
              fill
              sizes="100vw"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-black via-black/50 to-transparent pt-32">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-white uppercase bg-blue-600 rounded-full">
                {study.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {study.title}
              </h1>
              <p className="text-lg text-white/80 font-serif leading-relaxed max-w-2xl">
                {study.subtitle}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-black relative z-10 px-6 py-10 pb-32">
          <div className="max-w-2xl mx-auto">
            {/* Meta Data */}
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-white/10 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image
                    src="/profile_pic.jpeg"
                    alt="Author avatar"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <span className="font-semibold text-black dark:text-white">
                  Syauqi Suhaimi
                </span>
              </div>
              <span>•</span>
              <span>{study.date}</span>
              <span>•</span>
              <span>{study.readTime}</span>
            </div>

            {/* Render Blocks */}
            {study.content.map((block, idx) => (
              <RenderBlock key={idx} block={block} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyDetail;
