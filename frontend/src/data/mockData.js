// Dedicated user data model
export const users = [
  {
    id: '1',
    name: 'Alice Example',
    role: 'Designer',
    avatar: '/src/assets/img/artpice1.png',
    bio: 'Passionate about creative ideas and design. And cats.',
    socialLinks: {
      twitter: 'https://twitter.com/alice',
      linkedin: 'https://linkedin.com/in/alice',
    },
  },
  {
    id: '2',
    name: 'Bob Creator',
    role: 'Developer',
    avatar: '/src/assets/img/artpice2.png',
    bio: 'Building the future, one idea at a time.',
    socialLinks: {
      twitter: 'https://twitter.com/bob',
      linkedin: 'https://linkedin.com/in/bob',
    },
  },
];
// Mock data for ideas - simulates backend API responses
export const mockIdeas = [
  {
    id: 1001,
    title: 'My First Example Idea',
    bodyText: 'This is a temporary example idea for development. It has a cool image.',
    author: 'You',
    role: 'Creator',
    createdAt: '2025-08-19',
    likes: 0,
    connections: 0,
    images: [
      '/mockImg/artpice1.png',
      '/mockImg/cells.png',
    ],
  },
  {
    id: 1002,
    title: 'My Second Example Idea',
    bodyText: 'Another temporary idea for development, with a different image.',
    author: 'You',
    role: 'Creator',
    createdAt: '2025-08-19',
    likes: 0,
    connections: 0,
    images: [
      '/mockImg/artpice2.png',
      '/mockImg/dots.png',
    ],
  },
  {
    id: 1,
    title: 'Revolutionary Social Media App',
    bodyText:
      'A new social media platform that focuses on meaningful connections rather than endless scrolling. Features include conversation starters, mood-based content filtering, and digital wellbeing tools.',
    author: 'Sarah Chen',
    role: 'UX Designer',
    createdAt: '2024-01-15',
    likes: 42,
    connections: 8,
    images: [
      '/mockImg/artpice1.png',
      '/mockImg/artpice2.png',
      '/mockImg/cells.png',
    ],
  },
  {
    id: 2,
    title: 'AI-Powered Recipe Generator',
    bodyText:
      'An app that creates personalized recipes based on ingredients you have at home. Uses machine learning to suggest creative combinations and dietary alternatives.',
    author: 'Marcus Rodriguez',
    role: 'Software Engineer',
    createdAt: '2024-01-14',
    likes: 67,
    connections: 12,
    images: [
      '/mockImg/artpice2.png',
      '/mockImg/cells.png',
      '/mockImg/dots.png',
    ],
  },
  {
    id: 3,
    title: 'Sustainable Fashion Marketplace',
    bodyText:
      'A platform connecting eco-conscious consumers with sustainable fashion brands. Features include carbon footprint tracking, material transparency, and circular fashion initiatives.',
    author: 'Emma Thompson',
    role: 'Product Manager',
    createdAt: '2024-01-13',
    likes: 89,
    connections: 15,
    images: [
      '/mockImg/cells.png',
      '/mockImg/dots.png',
      '/mockImg/artpice1.png',
    ],
  },
  {
    id: 4,
    title: 'Smart Home Energy Optimizer',
    bodyText:
      'IoT system that learns your energy usage patterns and automatically optimizes consumption. Integrates with solar panels, smart thermostats, and provides real-time cost savings.',
    author: 'David Kim',
    role: 'Data Scientist',
    createdAt: '2024-01-12',
    likes: 34,
    connections: 6,
    images: [
      '/mockImg/dots.png',
      '/mockImg/artpice1.png',
      '/mockImg/artpice2.png',
    ],
  },
];
