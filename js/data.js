// Text2 Website Data
// Centralized data structure for all website content

// App Data - Text2 Ecosystem Apps (Unified Domain)
const appData = [
  { id: 1, name: "Note", description: "Take notes quickly.", icon: "https://text2.pro/app/note/apple-touch-icon.png", url: "https://text2.pro/app/note" },
  { id: 2, name: "Translate", description: "Translate text.", icon: "https://text2.pro/app/translate/apple-touch-icon.png", url: "https://text2.pro/app/translate" },
  { id: 3, name: "Create QR", description: "Generate QR codes.", icon: "https://text2.pro/app/qr/apple-touch-icon.png", url: "https://text2.pro/app/qr" },
  { id: 4, name: "Grammar", description: "Check grammar.", icon: "https://text2.pro/app/grammar/apple-touch-icon.png", url: "https://text2.pro/app/grammar" },
  { id: 5, name: "Chat AI", description: "Chat with AI.", icon: "https://text2.pro/app/chat/apple-touch-icon.png", url: "https://text2.pro/app/chat" },
  { id: 6, name: "Camera", description: "Camera tools.", icon: "https://text2.pro/app/camera/apple-touch-icon.png", url: "https://text2.pro/app/camera" },
  { id: 7, name: "HTML View", description: "View HTML files.", icon: "https://text2.pro/app/html/apple-touch-icon.png", url: "https://text2.pro/app/html" },
  { id: 8, name: "Calendar", description: "Manage dates.", icon: "https://text2.pro/app/calendar/apple-touch-icon.png", url: "https://text2.pro/app/calendar" },
  { id: 9, name: "Img Design", description: "Design images.", icon: "https://text2.pro/app/img/apple-touch-icon.png", url: "https://text2.pro/app/img" },
  { id: 10, name: "Love Match", description: "Love fortune.", icon: "https://text2.pro/app/love/apple-touch-icon.png", url: "https://text2.pro/app/love" },
  { id: 11, name: "Scan QR", description: "Scan QR codes.", icon: "https://text2.pro/app/qr/scan/apple-touch-icon.png", url: "https://text2.pro/app/qr/scan" },
  { id: 12, name: "Add Luts", description: "Apply LUTs.", icon: "https://text2.pro/app/luts/apple-touch-icon.png", url: "https://text2.pro/app/luts" },
  { id: 14, name: "Create Img", description: "AI Image Generator.", icon: "https://text2.pro/app/create-img/apple-touch-icon.png", url: "https://text2.pro/app/create-img" },
  { id: 15, name: "Weather", description: "Check weather.", icon: "https://text2.pro/app/weather/apple-touch-icon.png", url: "https://text2.pro/app/weather" },
  { id: 16, name: "Game Chess", description: "Play game chess.", icon: "https://text2.pro/app/chess/apple-touch-icon.png", url: "https://text2.pro/app/chess/" },
  { id: 17, name: "Game Caro", description: "Play Caro.", icon: "https://text2.pro/app/caro/apple-touch-icon.png", url: "https://text2.pro/app/caro" }
];

// Social Media Data
const socialMediaData = [
  {
    platform: "facebook",
    name: "Facebook",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>`,
    links: [
      { name: "Text2 Vietnam", url: "https://www.facebook.com/text2.click" },
      { name: "Text2 Team", url: "https://www.facebook.com/text2team" }
    ]
  },
  {
    platform: "youtube",
    name: "YouTube",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75,15.02 15.5,11.75 9.75,8.48 9.75,15.02"></polygon>
    </svg>`,
    links: [
      { name: "Text2 Team", url: "https://www.youtube.com/@text2_team" },
      { name: "Text2", url: "https://www.youtube.com/@text2_click" },
      { name: "Text2 - Vietnam", url: "https://www.youtube.com/@Text2_Vietnam" },
      { name: "Text2 - Magic", url: "https://www.youtube.com/@text2_magic" },
      { name: "Text2 - Tech", url: "https://www.youtube.com/@text2_tech" }
    ]
  },
  {
    platform: "tiktok",
    name: "TikTok",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>`,
    links: [
      { name: "Text2 Vietnam", url: "https://www.tiktok.com/@text2_" },
      { name: "Text2 Magic", url: "https://www.tiktok.com/@text2magic" }
    ]
  },
  {
    platform: "instagram",
    name: "Instagram",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>`,
    links: [
      { name: "Text2 Magic", url: "https://www.instagram.com/text2_magic" }
    ]
  },
  {
    platform: "twitter",
    name: "Twitter (X)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>`,
    links: [
      { name: "Text2", url: "https://x.com/Text2click" },
      { name: "HOA NHAT ANH", url: "https://x.com/hoanhatanh123" }
    ]
  },
  {
    platform: "pinterest",
    name: "Pinterest",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1a11 11 0 0 0-11 11 11 11 0 0 0 7.5 10.5c-.1-.9-.2-2.2 0-3.2.2-.9 1.3-5.4 1.3-5.4s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3-.1.3-.3 1.2-.3 1.4-.1.2-.2.2-.4.1-1.4-.7-2.3-2.7-2.3-4.4 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.2-5.2 6.2-1 0-2-.5-2.3-1.2 0 0-.5 2-.6 2.5-.2.9-.8 2.1-1.2 2.8A11 11 0 0 0 12 23a11 11 0 0 0 11-11A11 11 0 0 0 12 1z"></path>
    </svg>`,
    links: [
      { name: "Text2", url: "https://www.pinterest.com/text2img/" }
    ]
  }
];

// Partners Data
const partnersData = [
  {
    id: 1,
    name: "05 Production",
    url: "https://05.text2.pro",
    icon: "https://05.text2.pro/favicon.ico",
    description: "05 Production"
  }
];

// Navigation Data
const navigationData = [
  {
    name: "APP",
    url: "https://team.text2.pro/",
    dataLink: "GAME",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>`
  },
  {
    name: "GAME",
    url: "https://game.text2.pro",
    dataLink: "https://game.text2.pro",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4" ry="4"></rect>
      <circle cx="8" cy="12" r="1.5"></circle>
      <circle cx="16" cy="12" r="1.5"></circle>
      <path d="M12 10v4"></path>
      <path d="M10 14h4"></path>
    </svg>`
  },
  {
    name: "Camera",
    url: "https://camera.text2.pro",
    dataLink: "https://camera.text2.pro",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>`
  }
];

// Sidebar Data
const sidebarData = {
  mainLinks: [
    {
      name: "Text2 - Team",
      url: "https://team.text2.pro",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    },
    {
      name: "Gamme",
      url: "https://game.text2.pro/",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>`
    },
    {
      name: "Camera",
      url: "https://camera.text2.pro/",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="background:linear-gradient(135deg,#1e1e1e,#242424);border-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,0.4);">
        <rect x="3" y="7" width="18" height="13" rx="2" ry="2"></rect>
        <circle cx="12" cy="13.5" r="3.5"></circle>
        <path d="M8.5 7V5a2.5 2.5 0 0 1 5 0v2"></path>
      </svg>`
    }
  ],
  socialMedia: socialMediaData // Reuse social media data
};

