# Frontend VPS

A modern Next.js application built with TypeScript and Tailwind CSS v4.

## 🚀 Features

- **Next.js 15.5.2** - Latest version with App Router and Server Components
- **TypeScript** - Full type safety and better development experience
- **Tailwind CSS v4** - Latest version with new features and improved performance
- **Dark Mode** - Built-in dark mode support with system preference detection
- **Responsive Design** - Mobile-first approach that works on all devices
- **ESLint** - Code quality and consistency
- **Modern UI Components** - Reusable components with TypeScript interfaces

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── components/        # Components showcase page
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with Header/Footer
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Navigation header
│   │   └── Footer.tsx    # Site footer
│   └── ui/               # UI components
│       ├── Button.tsx    # Button component
│       └── Card.tsx      # Card component
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd frontend-vps
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🎨 UI Components

The project includes several reusable UI components:

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg">
  Click me
</Button>
```

### Card
```tsx
import { Card } from '@/components/ui/Card';

<Card title="Card Title">
  Card content goes here
</Card>
```

## 🌙 Dark Mode

The application supports dark mode with automatic system preference detection. The dark mode styles are handled by Tailwind CSS using the `dark:` prefix.

## 📱 Responsive Design

Built with a mobile-first approach using Tailwind CSS responsive utilities:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

## 🔧 Configuration

### TypeScript
- Configuration in `tsconfig.json`
- Path aliases configured with `@/*` pointing to `src/*`

### Tailwind CSS
- Using Tailwind CSS v4 with the new `@import "tailwindcss"` syntax
- Configuration in `globals.css` with custom theme variables

### ESLint
- Next.js ESLint configuration
- TypeScript support enabled

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.# VPS-FE
