
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
    platform: "post",
    name: "Post",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10,9 9,9 8,9"></polyline>
    </svg>`,
    links: [
      { name: "text2 - post", url: "https://text2.medium.com" }
    ]
  }
];

// Partners Data
const partnersData = [
  {
    id: 1,
    name: "05 Production",
    url: "https://05.text02.com",
    icon: "https://05.text02.com/favicon.ico",
    description: "05 Production"
  }
];

// Navigation Data
const navigationData = [
  {
    name: "APP",
    url: "https://text02.com/app",
    dataLink: "GAME",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>`
  },
  {
    name: "GAME",
    url: "https://game.text02.com",
    dataLink: "https://game.text02.com",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4" ry="4"></rect>
      <circle cx="8" cy="12" r="1.5"></circle>
      <circle cx="16" cy="12" r="1.5"></circle>
      <path d="M12 10v4"></path>
      <path d="M10 14h4"></path>
    </svg>`
  },
  {
    name: "Post",
    url: "https://text02.com/post/",
    dataLink: "https://text02.com/post/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10,9 9,9 8,9"></polyline>
    </svg>`
  }
];

// Sidebar Data
const sidebarData = {
  mainLinks: [
    {
      name: "App Center",
      url: "https://text02.com/app",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
        <rect x="3" y="3" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="14" y="3" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="14" y="14" width="7" height="7" rx="2" ry="2"></rect>
        <rect x="3" y="14" width="7" height="7" rx="2" ry="2"></rect>
      </svg>`
    },
    {
      name: "Text2 Team",
      url: "https://team.text02.com",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    },
    {
      name: "Post",
      url: "https://text02.com/post/",
      dataSameTab: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
        <path d="M4 4h16v16H4z"></path>
        <path d="M8 4v16"></path>
        <path d="M4 8h4"></path>
        <path d="M4 12h4"></path>
      </svg>`
    }
  ],
  socialMedia: [] // No social items in sidebar
};

