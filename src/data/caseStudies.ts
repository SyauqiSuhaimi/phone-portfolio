export type CaseStudyBlock = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'code'; code: string; language: string; caption?: string }
  | { type: 'heading'; content: string }
  | { type: 'demo'; componentName: string; caption?: string; height?: string };

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
    id: 'portfolio-os',
    title: 'Building a Web OS',
    subtitle: 'How I recreated iOS in the browser using React and Framer Motion.',
    category: 'Frontend Engineering',
    readTime: '8 min read',
    heroImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Placeholder high-quality tech image
    date: 'February 2026',
    tags: ['React', 'TypeScript', 'Framer Motion', 'System Design'],
    content: [
        { 
            type: 'text', 
            content: "The concept was simple: web portfolios are boring. I wanted to build something that felt alive, playful, and technically impressive. The result is a fully functional 'Operating System' running in the browser." 
        },
        { type: 'heading', content: 'The Challenge' },
        { 
            type: 'text', 
            content: "Managing state for a windowing system on the web is notoriously difficult. You have to handle Z-index stacking, minimization, focus management, and mobile responsiveness—all while maintaining 60fps animations." 
        },
        { 
            type: 'image', 
            src: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop', 
            caption: 'Early prototype of the window manager state machine.' 
        },
        { type: 'heading', content: 'The Solution: Global State' },
        { 
            type: 'text', 
            content: "I opted for a centralized 'OS Context' that acts as the kernel. It tracks every active process (app), its state (minimized/open), and its visual position." 
        },
        {
            type: 'code',
            language: 'typescript',
            caption: 'The core interface for an App Process',
            code: `interface AppProcess {
  id: string;
  zIndex: number;
  status: 'active' | 'minimized' | 'background';
  position: { x: number; y: number };
}`
        },
        { type: 'heading', content: 'Interactive Demo: Window Physics' },
        {
            type: 'text',
            content: "One of the key features is the 'spring' physics when you open or close an app. Try interacting with this mini-window below to see the physics engine in action."
        },
        {
            type: 'demo',
            componentName: 'WindowPhysicsDemo',
            caption: 'Live interactive demo of the framer-motion spring config.',
            height: '300px'
        },
        { type: 'heading', content: 'Performance Optimization' },
        {
            type: 'text',
            content: "To ensure smooth performance on mobile devices, I utilized CSS hardware acceleration (transform: translate3d) and carefully memoized the heavy context providers."
        }
    ]
  },
  {
    id: 'realtime-chat',
    title: 'Building a Real-Time Chat',
    subtitle: 'Implementing WebSocket-based messaging with typing indicators and read receipts.',
    category: 'Full Stack',
    readTime: '6 min read',
    heroImage: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop',
    date: 'January 2026',
    tags: ['Node.js', 'WebSocket', 'React', 'Redis'],
    content: [
        { 
            type: 'text', 
            content: "Chat applications seem simple on the surface, but they hide a world of complexity: real-time synchronization, presence detection, message ordering, and offline support. This case study explores how I tackled each challenge." 
        },
        { type: 'heading', content: 'The Problem' },
        { 
            type: 'text', 
            content: "The client needed a chat system that could handle thousands of concurrent users with sub-100ms message delivery. Traditional REST APIs wouldn't cut it—we needed persistent connections." 
        },
        { type: 'heading', content: 'Architecture Overview' },
        { 
            type: 'image', 
            src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop', 
            caption: 'High-level architecture: Client → WebSocket Gateway → Redis Pub/Sub → Database' 
        },
        { 
            type: 'text', 
            content: "I chose a microservices approach with a dedicated WebSocket gateway. Redis Pub/Sub handles cross-instance message broadcasting, ensuring horizontal scalability." 
        },
        { type: 'heading', content: 'Key Implementation: Typing Indicator' },
        {
            type: 'text',
            content: "One of the trickiest features was the typing indicator. It needs to appear when someone starts typing and disappear after they stop—without flooding the network with events."
        },
        {
            type: 'code',
            language: 'typescript',
            caption: 'Debounced typing indicator logic',
            code: `const TYPING_TIMEOUT = 2000;
let typingTimer: NodeJS.Timeout;

function handleTyping(userId: string, roomId: string) {
  // Broadcast "typing" event
  socket.to(roomId).emit('user_typing', { userId });
  
  // Clear previous timer
  clearTimeout(typingTimer);
  
  // Stop typing after timeout
  typingTimer = setTimeout(() => {
    socket.to(roomId).emit('user_stopped_typing', { userId });
  }, TYPING_TIMEOUT);
}`
        },
        { type: 'heading', content: 'Results' },
        {
            type: 'text',
            content: "The final system handles 5,000+ concurrent connections per server instance with an average message latency of 47ms. The typing indicator updates feel instantaneous, and read receipts sync within 200ms across all devices."
        },
        { type: 'heading', content: 'Lessons Learned' },
        {
            type: 'text',
            content: "WebSocket connection management is critical—always implement heartbeats and reconnection logic. Redis Pub/Sub is excellent for fan-out but watch your memory usage. And never underestimate the UX impact of a well-tuned typing indicator."
        }
    ]
  }
];
