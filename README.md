# Just Chatting 💬

A modern, secure chat application built with **privacy-first** and **local-first** architecture. Experience lightning-fast messaging with end-to-end encryption, where your messages are stored locally for instant access while being securely synchronized across devices.

![Just Chatting](https://img.shields.io/badge/Next.js-15-blue) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)

## ✨ Features

### 🔐 Security & Privacy First
- **Server-side encryption** - Your messages are encrypted on our servers, and only you hold the decryption keys
- **You own your data** - No one else, including us, can access your private conversations
- **Secure authentication** - Industry-standard authentication with Clerk integration
- **Privacy by design** - Minimal metadata collection, maximum user control

### ⚡ Local-First Architecture
- **Instant messaging** - Messages load instantly from local storage (IndexedDB)
- **Offline capable** - Read and compose messages even without an internet connection
- **Seamless sync** - Encrypted synchronization across all your devices
- **Zero lag experience** - Native-like performance on web and mobile

### 🌟 User Experience
- **Real-time messaging** - Instant message delivery with live typing indicators
- **Friend system** - Send friend requests, manage connections, and build your network
- **Group conversations** - Create and participate in group chats
- **Responsive design** - Beautiful interface that works on desktop and mobile
- **Dark/Light themes** - Customizable appearance with system theme support
- **Modern UI** - Clean, intuitive design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - User interface library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Services
- **[Convex](https://www.convex.dev/)** - Backend-as-a-Service for real-time data
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Socket.io](https://socket.io/)** - Real-time bidirectional communication

### Development Tools
- **[React Hook Form](https://react-hook-form.com/)** - Forms with validation
- **[Zod](https://zod.dev/)** - Schema validation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

## 🚀 Getting Started

### Prerequisites
- Node.js (18.0 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShreyanshVishwakarma/justchatting.git
   cd justchatting
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your configuration:
   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Convex Backend
   CONVEX_DEPLOYMENT=your_convex_deployment_url
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   
   # Optional: Webhook URLs
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## 🏗️ Project Structure

```
justchatting/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (home)/         # Landing page
│   │   ├── (root)/         # Authenticated app pages
│   │   │   ├── conversations/  # Chat interface
│   │   │   └── friends/        # Friend management
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── providers/         # React context providers
├── convex/                # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.config.ts     # Authentication configuration
│   ├── conversations.ts   # Chat functionality
│   ├── friends.ts         # Friend system
│   └── messages.ts        # Message handling
└── public/               # Static assets
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run Convex development server
npx convex dev
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
This Next.js application can be deployed to any platform that supports Node.js:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📱 Features in Detail

### Messaging System
- **Real-time delivery** - Messages appear instantly across all devices
- **Message editing** - Edit sent messages with revision history
- **Typing indicators** - See when someone is typing
- **Message context menu** - Right-click for additional options
- **Emoji reactions** - React to messages with emojis

### Friend Management
- **Send friend requests** - Connect with other users
- **Accept/decline requests** - Manage incoming friend requests
- **Friend discovery** - Find friends by username or email
- **Online status** - See when friends are online

### Security Features
- **End-to-end encryption** - Messages encrypted with user-controlled keys
- **Secure key storage** - Encryption keys stored locally, never on servers
- **Session management** - Secure session handling with automatic logout
- **Privacy controls** - Control who can send you messages

## 🐛 Bug Reports

If you encounter any bugs, please [create an issue](https://github.com/ShreyanshVishwakarma/justchatting/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Convex](https://www.convex.dev/) for the powerful backend infrastructure
- [Clerk](https://clerk.com/) for seamless authentication
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/ShreyanshVishwakarma">Shreyansh Vishwakarma</a></p>
  <p>⭐ If you like this project, please give it a star on GitHub!</p>
</div>
