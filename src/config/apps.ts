export type AppConfig = {
  id: string;
  name: string;
  iconPath: string;
  type?: "app" | "folder";
  apps?: AppConfig[];
};

export const apps: AppConfig[] = [
  {
    id: "work",
    name: "Work",
    type: "folder",
    iconPath:
      "M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    apps: [
      {
        id: "about",
        name: "About Me",
        iconPath:
          "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      },
      {
        id: "projects",
        name: "Projects",
        iconPath: "M4 17l6-6-6-6 M12 19h8",
      },
      {
        id: "skills",
        name: "Skills",
        iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
      },
      {
        id: "chat",
        name: "Chat",
        iconPath:
          "M21 15a4 4 0 0 1-4 4H8l-5 3V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
      },
      {
        id: "camera",
        name: "Camera",
        iconPath:
          "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
      },
    ],
  },
  {
    id: "chat",
    name: "Chat",
    iconPath:
      "M21 15a4 4 0 0 1-4 4H8l-5 3V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
  },
  {
    id: "camera",
    name: "Camera",
    iconPath:
      "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  },
  {
    id: 'about',
    name: 'About Me',
    iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', // User
  },
  {
    id: 'projects',
    name: 'Projects',
    iconPath: 'M4 17l6-6-6-6 M12 19h8', // Terminal/Code
  },
  {
    id: 'skills',
    name: 'Skills',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', // Lightning
  },
  {
    id: 'gallery',
    name: 'Gallery',
    iconPath: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M11 14l3 3 4-4 M11 14l-4 4', // Image
  },
  {
    id: 'contact',
    name: 'Contact',
    iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', // Mail
  },
  {
    id: 'settings',
    name: 'Settings',
    iconPath: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', // Gear
  },
];
