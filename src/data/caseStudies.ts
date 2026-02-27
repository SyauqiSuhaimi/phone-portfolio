export type CaseStudyBlock =
  | { type: "text"; content: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "code"; code: string; language: string; caption?: string }
  | { type: "heading"; content: string }
  | { type: "demo"; componentName: string; caption?: string; height?: string };

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  heroImage: string;
  date: string;
  tags: string[];
  content: CaseStudyBlock[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "portfolio-os",
    title: "Building a Web OS",
    subtitle:
      "A phone-like portfolio experience with lock screen, app navigation, gestures, and local-first data.",
    category: "Frontend Engineering",
    readTime: "10 min read",
    heroImage:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    date: "February 2026",
    tags: [
      "React",
      "TypeScript",
      "Framer Motion",
      "IndexedDB",
      "Frontend Architecture",
    ],
    content: [
      {
        type: "text",
        content:
          "The concept was simple: portfolio sites feel static, so I designed mine as a small operating system. Instead of scrolling sections, users unlock a phone UI, open apps, and explore my projects through interaction.",
      },
      { type: "heading", content: "The Challenge" },
      {
        type: "text",
        content:
          "How do I implement a responsive, operating system-like interface thats work on browser and mobile? I needed a way to manage global state for multiple 'apps', handle complex animations, and ensure smooth performance across devices.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop",
        caption: "Early prototype of the window manager state machine.",
      },
      { type: "heading", content: "The Solution" },
      {
        type: "text",
        content:
          "I used App.tsx as the main controller of the phone UI. It handles lock/unlock, which app or folder is open, swipe-to-unlock, and bottom navigation. Shared features like wallpaper and notifications are kept in separate providers so every screen can use them easily. ",
      },
      {
        type: "code",
        language: "typescript",
        caption: "App shell state that drives the entire interaction model",
        code: `const [isLocked, setIsLocked] = useState(true);
const [activeAppId, setActiveAppId] = useState<string | null>(null);
const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
const [folderOrigin, setFolderOrigin] = useState<DOMRect | null>(null);

const handleAppClick = (appId: string, origin?: DOMRect) => {
  const appConfig = apps.find((app) => app.id === appId);
  if (appConfig?.type === "folder") {
    setActiveAppId(null);
    setActiveFolderId(appId);
    setFolderOrigin(origin ?? null);
    return;
  }

  setActiveFolderId(null);
  setFolderOrigin(null);
  setActiveAppId(appId);
};`,
      },
      { type: "heading", content: "Animation and Gesture System" },
      {
        type: "text",
        content:
          "The UX depends on motion, so I used Framer Motion for app open/close transitions, folder zoom from icon origin, and screen-to-screen spring navigation. A custom useSwipe hook handles touch and mouse gestures with a shared threshold so behavior stays consistent across devices.",
      },
      { type: "heading", content: "Interactive Demo: Window Physics" },
      {
        type: "text",
        content:
          "One of the key features is the 'spring' physics when you open or close an app. Try interacting with this mini-window below to see the physics engine in action.",
      },
      {
        type: "demo",
        componentName: "WindowPhysicsDemo",
        caption: "Live interactive demo of the framer-motion spring config.",
        height: "300px",
      },
      { type: "heading", content: "Data, Personalization, and AI" },
      {
        type: "text",
        content:
          "To make the portfolio feel like a real device, I added local-first persistence. Gallery media and wallpaper settings are stored in IndexedDB.",
      },
      { type: "heading", content: "Performance and Reliability" },
      {
        type: "text",
        content:
          "I kept the runtime lightweight by rendering only one active app window, using AnimatePresence for controlled mounting/unmounting, and limiting chat context sent to the model. For resilience, the app validates API payloads, handles malformed local storage safely, and falls back gracefully when AI requests fail.",
      },
      { type: "heading", content: "Results" },
      {
        type: "text",
        content:
          "The final project ships as a cohesive interactive portfolio: lock screen to unlock, swipe-based navigation, app-style content discovery, local media persistence, and an AI assistant that stays scoped to portfolio-related questions. The architecture is modular enough to add new apps without rewriting the shell.",
      },
    ],
  },
  {
    id: "diagram-annotation-system",
    title: "Digitizing Diagram-Based Record Marking",
    subtitle:
      "From paper-based visual markups to an interactive SVG annotation workflow.",
    category: "Interactive UI",
    readTime: "7 min read",
    heroImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop",
    date: "March 2026",
    tags: [
      "SVG",
      "Interactive UI",
      "Data Modeling",
      "Digital Transformation",
      "Frontend Engineering",
    ],
    content: [
      {
        type: "text",
        content:
          "The client relied on manual paper markups for diagram-based records. Teams had to annotate by hand, which made updates slow, hard to standardize, and difficult to track over time.",
      },
      { type: "heading", content: "The Challenge" },
      {
        type: "text",
        content:
          "We needed to preserve familiar visual workflows while moving to a digital system. Users still had to mark specific surfaces/regions, apply symbols and colors, and keep records readable for follow-up reviews.",
      },
      { type: "heading", content: "The Solution" },
      {
        type: "text",
        content:
          "We built an interactive SVG-based annotation module. Each region in the diagram is selectable, and users can apply predefined visual markers such as color states and symbols directly on the canvas.",
      },
      { type: "heading", content: "Interactive Demo: Surface Annotation" },
      {
        type: "text",
        content:
          "Click a surface to select it, then choose a color from the right panel. The selected region updates immediately, matching the core annotation workflow.",
      },
      {
        type: "demo",
        componentName: "SurfaceAnnotationDemo",
        caption: "Clickable SVG surfaces with right-panel color assignment.",
        height: "360px",
      },
      {
        type: "code",
        language: "typescript",
        caption: "Region-level annotation model",
        code: `interface RegionAnnotation {
  regionId: string;
  color?: string;
  symbol?: string;
  notes?: string;
}

type DiagramRecord = {
  recordId: string;
  annotations: RegionAnnotation[];
};`,
      },
      { type: "heading", content: "Interaction Design" },
      {
        type: "text",
        content:
          "The UI keeps the experience close to manual marking: click a region, choose marker style, and apply. Marker legends keep meaning consistent across users, and updates are immediately reflected in the diagram.",
      },
      { type: "heading", content: "Data and Traceability" },
      {
        type: "text",
        content:
          "Instead of storing only a final image, the system stores structured annotation data per region. That enables editing, validation, history tracking, and downstream reporting without losing visual context.",
      },
      { type: "heading", content: "Results" },
      {
        type: "text",
        content:
          "The workflow moved from paper markup to a consistent digital process. Teams can annotate faster, review records more clearly, and maintain more reliable history with less manual error.",
      },
    ],
  },
  {
    id: "dynamic-form-builder",
    title: "From Manual Forms to a Form Builder Platform",
    subtitle:
      "A shift from one-by-one form development to client-managed digital form creation.",
    category: "Full Stack Engineering",
    readTime: "9 min read",
    heroImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    date: "March 2026",
    tags: [
      "Form Builder",
      "Product Architecture",
      "Scalability",
      "Internal Tools",
      "Digital Transformation",
    ],
    content: [
      {
        type: "text",
        content:
          "In DocFlowPortal, the client needed to digitize many operational forms. The old approach was custom delivery per form, where each request became a separate development task and release cycle.",
      },
      { type: "heading", content: "The Challenge" },
      {
        type: "text",
        content:
          "This became a bottleneck. When forms grew in number, we had to build and maintain them one by one. Even small changes like adding a required field or updating options still depended on developers.",
      },
      { type: "heading", content: "Traditional Approach Limitations" },
      {
        type: "text",
        content:
          "Custom-per-form development did not scale. It increased lead time, repeated the same work, and kept business users dependent on engineering for routine form updates.",
      },
      { type: "heading", content: "The Solution" },
      {
        type: "text",
        content:
          "We created a platformthat lets clients customize and manage their own digital forms instead of requesting developers to build each form one by one.",
      },
      {
        type: "code",
        language: "typescript",
        caption: "Schema model used by the Form Builder",
        code: `type FieldType = "text" | "number" | "date" | "select" | "checkbox" | "file";

interface FieldDefinition {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  order: number;
}

interface FormDefinition {
  id: string;
  name: string;
  version: number;
  status: "draft" | "published";
  fields: FieldDefinition[];
}`,
      },
      {
        type: "heading",
        content: "Interactive Demo: Builder to Submission to Answer",
      },
      {
        type: "text",
        content:
          "This demo mirrors the same module flow in the Form Builder platform. Configure fields like FormBuilder, enter values and validate required fields like FormSubmission, then review the read-only output like FormAnswer.",
      },
      {
        type: "demo",
        componentName: "FormBuilderFlowDemo",
        caption:
          "Live mini-flow of FormBuilder, FormSubmission, and FormAnswer behavior.",
        height: "420px",
      },
      { type: "heading", content: "Architecture Decisions" },
      {
        type: "text",
        content:
          "FormBuilder persists schema metadata and supports page/field composition, field ordering, and preview mode. FormSubmission consumes that schema, enforces required validation per page, supports draft save and final submit, and normalizes values (including files). FormAnswer renders responses in read-only mode and supports document preview/download workflows.",
      },
      { type: "heading", content: "What We Delivered" },
      {
        type: "text",
        content:
          "The shipped flow includes text, selection, date, and file fields; required rules; page navigation; save as draft; submit; and answer review. File workflows support retrieval and watermark-aware preview/download in the answer stage.",
      },
      { type: "heading", content: "Adoption and Enablement" },
      {
        type: "text",
        content:
          "Beyond coding, we focused on enablement: short training sessions, examples, and governance guidelines. The client team quickly learned how to build and maintain their own digital forms.",
      },
      { type: "heading", content: "Results" },
      {
        type: "text",
        content:
          "The model shifted from developer-led form creation to self-service operations. New forms and updates were delivered faster, repetitive engineering workload dropped, and client teams gained direct control of their digital forms.",
      },
      { type: "heading", content: "Lessons Learned" },
      {
        type: "text",
        content:
          "A scalable form builder needs strong versioning, permissions, and validation standards. Flexibility is valuable, but governance is what keeps the platform reliable in real operations.",
      },
    ],
  },
  {
    id: "procedure-builder",
    title: "Building a Procedure Builder for Approval Flows",
    subtitle:
      "One configurable workflow builder replacing separate systems for each procedure.",
    category: "Workflow Engineering",
    readTime: "8 min read",
    heroImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
    date: "March 2026",
    tags: [
      "Workflow Builder",
      "Approval Flow",
      "React Flow",
      "System Design",
      "Internal Tools",
    ],
    content: [
      {
        type: "text",
        content:
          "The client had different approval procedures for each business process. Traditionally, each procedure was implemented as a different system flow, which made delivery and maintenance slow.",
      },
      { type: "heading", content: "The Challenge" },
      {
        type: "text",
        content:
          "Custom-building every procedure did not scale. Every new process required new implementation work and separate logic. As procedure count increased, engineering became a bottleneck.",
      },
      { type: "heading", content: "The Solution" },
      {
        type: "text",
        content:
          "We created a platform/system where users can build their own procedure flow using reusable nodes: form node (Data Entry), approval node, and notification node.",
      },
      { type: "heading", content: "Interactive Demo: Basic Procedure Flow" },
      {
        type: "text",
        content:
          "This simple demo shows the base flow we use in the builder: Data Entry -> Approval -> Notify. Nodes are draggable to mimic canvas interaction.",
      },
      {
        type: "demo",
        componentName: "ProcedureBuilderFlowDemo",
        caption: "Draggable three-node procedure flow.",
        height: "320px",
      },
      { type: "heading", content: "Architecture and Builder Behavior" },
      {
        type: "text",
        content:
          "In DocFlowPortal, the workflow canvas is implemented with React Flow. The builder stores states plus transitions, and each node has configurable metadata such as label, description, assignments, and completion rules. Data Entry nodes include attached form schema, approval nodes handle decision paths, and notify nodes handle read/notification steps.",
      },
      { type: "heading", content: "Guardrails We Added" },
      {
        type: "text",
        content:
          "To keep flows valid, we added connection rules and save-time checks: one outgoing edge per handle, reject-path conventions for approval, and warnings for disconnected states before save.",
      },
      { type: "heading", content: "Results" },
      {
        type: "text",
        content:
          "Instead of building separate systems per procedure, the team now delivers through one builder platform. Procedure setup became faster, changes became easier for users, and engineering effort shifted from repetitive implementation to platform improvements.",
      },
    ],
  },
  {
    id: "mandatory-2fa-admin-portal",
    title: "Adding Mandatory 2FA for a Sensitive Admin Portal",
    subtitle:
      "Mandatory TOTP-based two-factor authentication to strengthen access accountability in a sensitive admin portal.",
    category: "Security Engineering",
    readTime: "6 min read",
    heroImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    date: "March 2026",
    tags: ["2FA", "TOTP", ".NET", "OTP.NET", "Access Control", "Security"],
    content: [
      {
        type: "text",
        content:
          "This project was an internal admin portal that centralizes important company documents. Because access was high impact, account security and user accountability were critical requirements.",
      },
      { type: "heading", content: "The Challenge" },
      {
        type: "text",
        content:
          "Users were sharing credentials, so identity attribution was weak. Even when actions were recorded, it was hard to be certain which individual actually accessed sensitive files.",
      },
      { type: "heading", content: "The Solution" },
      {
        type: "text",
        content:
          "We enforced mandatory two-factor authentication for all users using TOTP. The login flow became: employee ID + password, followed by a one-time authenticator code before access is granted.",
      },
      {
        type: "code",
        language: "csharp",
        caption: "Server-side TOTP verification concept (.NET + OTP.NET)",
        code: `var totp = new Totp(secretBytes);
var isValid = totp.VerifyTotp(inputCode, out long timeStepMatched);

if (!isValid)
{
    return Unauthorized("Invalid authentication code.");
}`,
      },
      { type: "heading", content: "Recovery and Usability" },
      {
        type: "text",
        content:
          "To reduce lockout risk, we added recovery secret codes so users can still regain access when they lose their authenticator setup.",
      },
      { type: "heading", content: "Implementation Notes" },
      {
        type: "text",
        content:
          "The implementation was built in .NET using OTP.NET for TOTP generation and validation. 2FA is mandatory for every account, not optional per role.",
      },
      { type: "heading", content: "Results" },
      {
        type: "text",
        content:
          "After rollout, access tracking became more reliable at the individual level. The team gained clearer confidence on who actually accessed each document.",
      },
      { type: "heading", content: "Next Improvements" },
      {
        type: "text",
        content:
          "Future hardening can include stricter retry controls, cooldown policies, and additional audit signals around failed 2FA attempts.",
      },
    ],
  },
];
