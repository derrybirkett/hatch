# Hatch Quick Reference Card

One-page cheat sheet for common tasks.

---

## 🚀 Installation & Setup

```bash
# Install Hatch CLI globally
npm install -g hatch-cli

# Verify installation
hatch --version

# Get help
hatch --help
```

---

## 📦 Creating a New Project

```bash
# Interactive mode (recommended for beginners)
hatch init

# With project name
hatch init my-saas-app

# With user story
hatch init my-app --story "A project management tool for remote teams"

# Without installing dependencies
hatch init my-app --no-install

# Skip git initialization
hatch init my-app --no-git
```

---

## 🎯 User Story Examples

```bash
# Fitness app
hatch init fitness-tracker --story "A fitness app where users log workouts, track progress, and share achievements"

# E-commerce
hatch init my-store --story "An online store where customers browse products, add to cart, and checkout with Stripe"

# Social network
hatch init social-app --story "A social platform where users post updates, follow friends, and send messages"

# SaaS dashboard
hatch init analytics-tool --story "An analytics tool where teams upload data, create charts, and share reports"

# Project management
hatch init project-mgr --story "A project management tool to create tasks, assign to team members, and track progress"
```

---

## 🛠️ Generated Project Commands

```bash
# Navigate to project
cd my-app

# Install dependencies (if skipped)
pnpm install

# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev:website      # Port 3000
pnpm dev:dashboard    # Port 4200
pnpm dev:api          # Port 3333
pnpm dev:blog         # Port 3002
pnpm dev:docs         # Port 3001

# Build for production
pnpm build

# Build specific app
pnpm build:website
pnpm build:dashboard
pnpm build:api

# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run unit tests
pnpm test:unit

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Database commands
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database
```

---

## 📁 Generated Project Structure

```
my-app/
├── apps/
│   ├── website/          # Port 3000 - Landing page
│   ├── dashboard/        # Port 4200 - Main SaaS app
│   ├── blog/            # Port 3002 - Blog
│   ├── docs/            # Port 3001 - Documentation
│   └── api/             # Port 3333 - Backend API
├── libs/
│   ├── ui/              # Shared UI components
│   ├── auth/            # Authentication logic
│   ├── billing/         # Stripe integration
│   └── shared/          # Utilities & types
├── e2e/
│   ├── website-e2e/
│   ├── dashboard-e2e/
│   └── api-e2e/
├── nx.json
├── package.json
├── docker-compose.yml
└── README.md
```

---

## 🌐 Default URLs

| App | Dev URL | Purpose |
|-----|---------|---------|
| Website | http://localhost:3000 | Marketing landing page |
| Dashboard | http://localhost:4200 | Main SaaS application |
| API | http://localhost:3333 | Backend REST API |
| Blog | http://localhost:3002 | Content/blog |
| Docs | http://localhost:3001 | Product documentation |

---

## 🔑 Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Key variables to configure:
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
```

---

## 🗄️ Database Commands

```bash
# Start PostgreSQL (Docker)
docker-compose up -d postgres

# Create migration
pnpm db:migrate dev --name add_user_field

# Apply migrations
pnpm db:migrate deploy

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed

# Reset database (⚠️ deletes all data)
pnpm db:reset
```

---

## 📝 Common File Locations

```bash
# Add new page to dashboard
apps/dashboard/src/pages/MyPage.tsx

# Add API endpoint
apps/api/src/modules/my-module/

# Add UI component
libs/ui/src/components/MyComponent.tsx

# Modify database schema
prisma/schema.prisma

# Add E2E test
e2e/dashboard-e2e/src/my-test.spec.ts

# Configure Nx
nx.json

# Environment variables
.env
```

---

## 🧪 Testing

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e --grep "login"

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run in UI mode (interactive)
pnpm test:e2e --ui

# Run unit tests
pnpm test:unit

# Run unit tests in watch mode
pnpm test:unit --watch

# Generate coverage report
pnpm test:coverage
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Start specific service
docker-compose up postgres
```

---

## 🔧 Nx Commands

```bash
# Run command for specific project
nx serve dashboard
nx build website
nx test api

# Run command for all projects
nx run-many --target=build --all

# Run command for affected projects only
nx affected:build

# View project graph
nx graph

# Clear cache
nx reset
```

---

## 📦 Adding Dependencies

```bash
# Add to workspace root
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Add to specific app/lib
pnpm add package-name --filter=@my-app/ui
```

---

## 🎨 Customization Points

### Add Custom Page to Dashboard
```bash
# 1. Create page component
apps/dashboard/src/pages/MyFeature.tsx

# 2. Add route
apps/dashboard/src/routes.tsx

# 3. Add to navigation
libs/ui/src/components/Navigation.tsx
```

### Add Custom API Endpoint
```bash
# 1. Generate module
cd apps/api
nest g module my-feature
nest g controller my-feature
nest g service my-feature

# 2. Add to app.module.ts
```

### Add Database Model
```bash
# 1. Edit schema
prisma/schema.prisma

# 2. Create migration
pnpm db:migrate dev --name add_my_model

# 3. Update TypeScript types (auto-generated)
```

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Docker
```bash
# Build production image
docker build -t my-app-api ./apps/api

# Run container
docker run -p 3333:3333 my-app-api
```

---

## ⚡ Quick Tips

```bash
# Hot reload not working?
nx reset

# Port already in use?
lsof -ti:4200 | xargs kill -9

# Database connection issues?
docker-compose restart postgres

# Type errors in libs?
pnpm build:libs

# Clear all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
pnpm install
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found: hatch` | Run `npm link` in hatch CLI directory |
| Port 4200 in use | Change port in `project.json` or kill process |
| Database connection failed | Check `DATABASE_URL` in `.env` |
| Migration failed | Check Prisma schema syntax |
| Build errors | Run `nx reset` then `pnpm build` |
| E2E tests failing | Ensure all apps are running |
| Module not found | Run `pnpm install` |

---

## 📚 File Templates

### Component Template
```typescript
// libs/ui/src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  // props
}

export const MyComponent: FC<MyComponentProps> = (props) => {
  return <div>My Component</div>;
};
```

### API Controller Template
```typescript
// apps/api/src/modules/my-module/my.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MyService } from './my.service';

@Controller('my-endpoint')
export class MyController {
  constructor(private readonly myService: MyService) {}

  @Get()
  findAll() {
    return this.myService.findAll();
  }
}
```

### E2E Test Template
```typescript
// e2e/dashboard-e2e/src/my-test.spec.ts
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

---

## 📖 Documentation Links

- **Nx**: https://nx.dev
- **React**: https://react.dev
- **Next.js**: https://nextjs.org
- **NestJS**: https://nestjs.com
- **Prisma**: https://prisma.io
- **Playwright**: https://playwright.dev
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind**: https://tailwindcss.com
- **Stripe**: https://stripe.com/docs

---

**Print this page for quick reference while developing!** 📄
