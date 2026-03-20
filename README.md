<div align="center">

# 🐣 Hatch

**Bootstrap production-ready SaaS applications in seconds**

Part of the [Bloom system](https://github.com/derrybirkett/bloom) - a modular, composable development stack.

[![Version](https://img.shields.io/badge/version-0.7.0-blue.svg)](https://github.com/yourusername/hatch)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Nx](https://img.shields.io/badge/Nx-21.3-blueviolet.svg)](https://nx.dev)

[Features](#-features) • [Quick Start](#-quick-start) • [Generated Stack](#-generated-stack) • [Documentation](#-documentation) • [Examples](#-examples) • [Roadmap](#-roadmap)

</div>

---

## 🎯 What is Hatch?

Hatch is a **CLI tool that generates complete, production-ready SaaS applications** from user stories. In under 3 minutes, you get a fully-configured Nx monorepo with:

### 🚀 Applications (3)
- **Website** (Next.js 15) - Marketing site with landing page and pricing
- **Dashboard** (React 18 + Vite) - Authenticated SPA with user management  
- **API** (NestJS 11) - RESTful backend with JWT authentication

### 📦 Libraries (3)
- **@your-app/ui** - Reusable React components (Button, Input, Card, Badge, Alert)
- **@your-app/auth** - Authentication context and protected routes
- **@your-app/shared** - Shared utilities, types, and API client

### ✅ DevOps & Testing
- **E2E Tests** - Playwright tests for all critical user flows (Chromium, Firefox, WebKit)
- **Docker** - Multi-stage builds for all apps + docker-compose with PostgreSQL & Redis
- **CI/CD** - GitHub Actions workflows for testing and deployment
- **TypeScript** - Strict mode enabled across the entire codebase

### 📚 Documentation  
- Comprehensive README with quick start guide
- Architecture documentation with diagrams
- Deployment guide for multiple platforms (Vercel, Railway, Render, Docker)
- Environment variable examples

---

## 🚀 Quick Start

```bash
# Install Hatch CLI globally
npm install -g hatch-cli

# Generate your SaaS application
hatch init

# Answer the prompts:
# → Project name: my-fitness-app
# → Description: A fitness tracking SaaS application
# → User story: Users can track workouts, monitor progress, and share achievements
# → Theme: vibrant

# Navigate and install dependencies
cd my-fitness-app
npm install

# Start all development servers
npm run dev

# Your apps are now running:
# ✓ Website:   http://localhost:3001 (Next.js marketing site)
# ✓ Dashboard: http://localhost:3000 (React SPA)
# ✓ API:       http://localhost:3333 (NestJS backend)

# Run E2E tests across all browsers
npm run test:e2e

# Build for production
npm run build:all
```

---

## ✨ Features

### 🎨 **Story-Driven Generation**
Describe your SaaS idea in plain English, and Hatch generates matching code:
- Automatically creates project structure
- Parses user story to extract features  
- Generates theme colors and branding
- Creates pages based on your description

### 🔐 **Authentication Built-In**
Complete authentication system ready to use:
- JWT-based authentication
- Login and signup pages
- Protected routes with redirects
- User context with React hooks (`useAuth`, `useUser`)
- Password hashing with bcrypt (salt rounds: 10)
- Token storage in localStorage

### 🎨 **Beautiful UI Components**
Tailwind CSS-based component library with `class-variance-authority`:
- **Button** - 5 variants (default, destructive, outline, ghost, link) + 3 sizes
- **Input** - Text fields with error states and validation
- **Card** - Container with header, content, and footer slots
- **Badge** - 4 variants (default, secondary, destructive, outline)
- **Alert** - 2 variants (default, destructive)
- All fully typed with TypeScript and accessible (ARIA attributes)

### 🧪 **End-to-End Testing**
Playwright tests for critical user flows:
- **Multi-browser testing** - Chromium, Firefox, and WebKit
- **Complete auth flow** - Signup, login, logout, protected routes
- **Test reports** - HTML reports with screenshots on failure
- **CI/CD integration** - Runs automatically in GitHub Actions

### 🐳 **Docker & Deployment Ready**
Production deployment made easy:
- **Multi-stage Dockerfiles** - Optimized for size (API: 200MB, Dashboard: 25MB with nginx)
- **docker-compose.yml** - PostgreSQL 16, Redis 7, all 3 apps orchestrated
- **GitHub Actions** - CI workflow (build, lint, test) + deployment workflow
- **Deployment guides** - Vercel, Railway, Render, Docker Hub

### 📦 **Nx Monorepo**
Intelligent build system with caching:
- **Task caching** - Never rebuild the same code twice
- **Affected commands** - Test/build only what changed
- **Dependency graph** - Visualize project relationships (`npx nx graph`)
- **Code sharing** - Import shared libraries with `@projectname/libname`
- **Task orchestration** - Run tasks in parallel or sequence

---

## 📋 Generated Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Monorepo** | Nx | 21.3.0 | Task orchestration & caching |
| **Website** | Next.js | 15.1.6 | Marketing site with App Router & RSC |
| **Dashboard** | React + Vite | 18.3.1 + 6.0.7 | SPA with fast HMR |
| **Backend** | NestJS | 11.0.0 | RESTful API server |
| **Routing** | React Router | 7.1.1 | Client-side routing for Dashboard |
| **UI Library** | Tailwind CSS | 3.4.18 | Utility-first styling |
| **UI Variants** | CVA | 0.7.1 | Type-safe component variants |
| **Auth** | JWT + bcrypt | 9.4.5 + 5.1.1 | Token-based auth |
| **Validation** | class-validator | 0.14.1 | DTO validation in API |
| **Testing** | Playwright | 1.48.0 | E2E browser testing |
| **DevOps** | Docker + GH Actions | - | Containerization & CI/CD |
| **Database** | PostgreSQL | 16 | Relational database (in docker-compose) |
| **Cache** | Redis | 7 | In-memory cache (in docker-compose) |
| **Language** | TypeScript | 5.8.3 | Strict mode everywhere |

---

## 📂 Project Structure (Generated)

```
my-app/
├── apps/
│   ├── website/                      # Next.js 15 marketing site
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing page with hero & features
│   │   │   ├── layout.tsx           # Root layout with Inter font
│   │   │   ├── globals.css          # Tailwind directives
│   │   │   └── pricing/
│   │   │       └── page.tsx         # Pricing page
│   │   ├── next.config.mjs          # Next.js configuration
│   │   ├── tailwind.config.ts       # Tailwind configuration
│   │   ├── tsconfig.json            # TypeScript configuration
│   │   ├── project.json             # Nx targets (build, serve, lint)
│   │   └── Dockerfile               # Production build (Next.js standalone)
│   │
│   ├── dashboard/                    # React 18 + Vite SPA
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx        # Login page
│   │   │   │   ├── Signup.tsx       # Signup page
│   │   │   │   ├── Dashboard.tsx    # Protected dashboard
│   │   │   │   ├── Profile.tsx      # Protected profile
│   │   │   │   └── Settings.tsx     # Protected settings
│   │   │   ├── App.tsx              # Routes & AuthProvider
│   │   │   ├── main.tsx             # Entry point
│   │   │   └── styles.css           # Global styles
│   │   ├── index.html               # HTML template
│   │   ├── vite.config.ts           # Vite configuration
│   │   ├── tailwind.config.ts       # Tailwind configuration
│   │   ├── project.json             # Nx targets
│   │   ├── Dockerfile               # Multi-stage: build + nginx serve
│   │   └── nginx.conf               # Nginx configuration
│   │
│   └── api/                          # NestJS 11 backend
│       ├── src/
│       │   ├── auth/
│       │   │   ├── auth.controller.ts   # POST /api/auth/login, /register
│       │   │   ├── auth.service.ts      # JWT & bcrypt logic
│       │   │   ├── auth.module.ts       # Module definition
│       │   │   ├── jwt.strategy.ts      # JWT strategy
│       │   │   ├── jwt-auth.guard.ts    # Guard for protected routes
│       │   │   └── dto/                 # Data transfer objects
│       │   ├── app.module.ts        # Root module
│       │   └── main.ts              # Bootstrap (port 3333)
│       ├── test/
│       │   └── app.e2e-spec.ts      # API tests
│       ├── Dockerfile               # Multi-stage Node 22 Alpine
│       ├── project.json             # Nx targets
│       └── tsconfig.json            # TypeScript strict mode
│
├── libs/
│   ├── ui/                           # Shared UI components library
│   │   ├── src/
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx       # <Button variant="..." size="..." />
│   │   │   │   └── index.ts         # Export
│   │   │   ├── input/
│   │   │   │   ├── Input.tsx        # <Input error={...} />
│   │   │   │   └── index.ts
│   │   │   ├── card/
│   │   │   │   ├── Card.tsx         # Card, CardHeader, CardContent, CardFooter
│   │   │   │   └── index.ts
│   │   │   ├── badge/
│   │   │   │   ├── Badge.tsx        # <Badge variant="..." />
│   │   │   │   └── index.ts
│   │   │   ├── alert/
│   │   │   │   ├── Alert.tsx        # <Alert variant="destructive" />
│   │   │   │   └── index.ts
│   │   │   ├── lib/
│   │   │   │   └── utils.ts         # cn() utility (clsx + tailwind-merge)
│   │   │   └── index.ts             # Export all components
│   │   ├── tailwind.config.ts       # Shared Tailwind config
│   │   ├── project.json             # Nx config
│   │   └── tsconfig.json
│   │
│   ├── auth/                         # Authentication library
│   │   ├── src/
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx  # AuthProvider, useAuth, useUser hooks
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.tsx   # Route guard with redirect
│   │   │   └── index.ts             # Exports
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── shared/                       # Shared utilities library
│       ├── src/
│       │   ├── api-client/
│       │   │   └── index.ts         # Configured fetch with base URL
│       │   ├── types/
│       │   │   └── index.ts         # User, AuthResponse interfaces
│       │   └── index.ts
│       ├── project.json
│       └── tsconfig.json
│
├── e2e/
│   ├── tests/
│   │   └── auth-flow.spec.ts        # Complete user journey tests
│   ├── playwright.config.ts         # Multi-browser configuration
│   ├── project.json                 # Nx target for e2e
│   ├── package.json
│   └── README.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Build, typecheck, lint, test, E2E, audit
│       └── deploy.yml               # Deploy to Vercel, Docker Hub, Railway
│
├── docker-compose.yml               # PostgreSQL + Redis + all apps
├── .dockerignore                     # Optimize Docker builds
├── nx.json                          # Nx workspace configuration
├── package.json                     # Root dependencies & scripts
├── tsconfig.base.json               # Shared TypeScript configuration
├── README.md                        # This file (comprehensive setup guide)
├── ARCHITECTURE.md                  # System design & architecture
└── DEPLOYMENT.md                    # Deployment guide for all platforms
```

---

## 📖 Examples

### E-Commerce SaaS
```bash
hatch init

# → Project name: my-store
# → Description: An online marketplace for handmade goods
# → Story: "Customers can browse products, add to cart, checkout, 
#          and sellers can manage inventory and track orders"
# → Theme: warm
```

**Generated features**:
- Product browsing pages
- Shopping cart UI  
- Checkout flow (ready for Stripe integration)
- Order management dashboard
- Seller inventory management (future enhancement)

### Project Management SaaS
```bash
hatch init

# → Project name: teamflow
# → Description: A project management tool for remote teams
# → Story: "Teams can create projects, assign tasks, track progress, 
#          comment on tasks, and share files"
# → Theme: professional
```

**Generated features**:
- Project list and detail pages
- Task management UI
- Collaboration features (comments, assignments)
- Progress tracking dashboard
- File upload components (future enhancement)

### Analytics SaaS
```bash
hatch init

# → Project name: datalyze
# → Description: A business intelligence platform
# → Story: "Users upload CSV data, create charts and dashboards, 
#          and share reports with their team"
# → Theme: modern
```

**Generated features**:
- File upload interface
- Data visualization components (charts)
- Dashboard builder
- Report sharing system
- Team management

---

## 🛠️ Development Workflow

### Available Commands

```bash
# Development (start all apps concurrently)
npm run dev                     # All apps (website, dashboard, API)
npm run dev:api                 # API only (port 3333)
npm run dev:dashboard           # Dashboard only (port 3000)
npm run dev:website             # Website only (port 3001)

# Testing
npm run test                    # All unit tests (future)
npm run test:e2e                # Run Playwright tests (headless)
npm run test:e2e:ui             # Open Playwright UI mode
npm run test:e2e:chromium       # Chromium only
npm run test:e2e:firefox        # Firefox only
npm run test:e2e:webkit         # WebKit only
npm run test:e2e:report         # Open test report

# Building
npm run build:all               # Build all apps for production
npm run build:api               # Build API
npm run build:dashboard         # Build Dashboard
npm run build:website           # Build Website

# Linting & Formatting
npm run lint                    # Lint all projects
npm run lint:fix                # Auto-fix lint issues
npm run format                  # Format code with Prettier
npm run typecheck               # TypeScript type checking

# Docker (full stack with database)
docker-compose up               # Start all services
docker-compose up -d            # Start in detached mode
docker-compose down             # Stop all services
docker-compose logs -f api      # View API logs
docker-compose ps               # List running containers

# Nx Commands (powerful!)
npx nx graph                    # Visualize project dependencies
npx nx affected:test            # Test only affected projects
npx nx affected:build           # Build only affected projects
npx nx affected:lint            # Lint only affected projects
npx nx run-many --target=test   # Run target for all projects
npx nx show project api         # Show API project details
npx nx reset                    # Clear Nx cache
```

### Adding Features

#### Add a new page to Dashboard

```bash
# 1. Create page component
cat > apps/dashboard/src/pages/Team.tsx << 'EOF'
import { useUser } from '@myapp/auth';

export function Team() {
  const user = useUser();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      <p>Manage your team members, {user?.name || 'User'}.</p>
    </div>
  );
}
EOF

# 2. Add route in App.tsx
# Add import: import { Team } from './pages/Team';
# Add route: <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
```

#### Add a new API endpoint

```bash
# 1. Generate NestJS resource
cd apps/api
npx nest generate module projects
npx nest generate controller projects
npx nest generate service projects

# 2. Implement CRUD in projects.controller.ts
# 3. Add to app.module.ts imports
```

#### Add a new shared component

```bash
# 1. Create component directory
mkdir -p libs/ui/src/tooltip

# 2. Create component
cat > libs/ui/src/tooltip/Tooltip.tsx << 'EOF'
import React from 'react';

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute hidden group-hover:block bg-gray-900 text-white text-sm rounded py-1 px-2 bottom-full mb-2">
        {text}
      </div>
    </div>
  );
}
EOF

# 3. Create index export
echo "export { Tooltip, type TooltipProps } from './Tooltip';" > libs/ui/src/tooltip/index.ts

# 4. Export from main index
echo "export * from './tooltip';" >> libs/ui/src/index.ts

# 5. Use anywhere
# import { Tooltip } from '@myapp/ui';
# <Tooltip text="Helpful hint"><Button>Hover me</Button></Tooltip>
```

---

## 🧪 Testing

### E2E Tests with Playwright

Your generated project includes comprehensive E2E tests covering the complete user journey:

```typescript
// e2e/tests/auth-flow.spec.ts

test('complete signup and login flow', async ({ page, context }) => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'SecurePass123!'
  };

  // 1. Navigate to signup page
  await page.goto('http://localhost:3000/signup');
  await expect(page).toHaveTitle(/Signup/);

  // 2. Fill and submit signup form
  await page.fill('[name="name"]', testUser.name);
  await page.fill('[name="email"]', testUser.email);
  await page.fill('[name="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // 3. Verify redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('h1')).toContainText('Welcome');

  // 4. Verify token persists across page refresh
  await page.reload();
  await expect(page).toHaveURL(/.*dashboard/);

  // 5. Test logout
  await page.click('text=Logout');
  await expect(page).toHaveURL(/.*login/);

  // 6. Test login with same credentials
  await page.fill('[name="email"]', testUser.email);
  await page.fill('[name="password"]', testUser.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
});

test('protected routes redirect unauthenticated users', async ({ page }) => {
  // Clear any existing auth
  await context.clearCookies();
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());

  // Try to access protected route
  await page.goto('http://localhost:3000/dashboard/profile');
  
  // Should redirect to login
  await expect(page).toHaveURL(/.*login/);
});
```

**Running Tests**:

```bash
# All browsers (headless)
npm run test:e2e

# Interactive UI mode (debug tests)
npm run test:e2e:ui

# Specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Generate and view report
npm run test:e2e:report

# Update snapshots
npm run test:e2e -- --update-snapshots

# Run specific test file
npx playwright test auth-flow

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode with Playwright Inspector
npx playwright test --debug
```

**Test Output**:
- **Reports**: `e2e/playwright-report/index.html`
- **Screenshots**: `e2e/test-results/` (on failure)
- **Videos**: `e2e/test-results/` (in headed mode)
- **Traces**: `e2e/test-results/` (for debugging)

---

## 🚢 Deployment

Your generated project is ready to deploy to multiple platforms:

### Vercel (Recommended for Website & Dashboard)

**Website (Next.js)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from website directory
cd apps/website
vercel --prod

# Or connect GitHub repo for auto-deployment
# https://vercel.com/new
```

**Dashboard (React SPA)**:
```bash
cd apps/dashboard
npm run build
vercel --prod
```

**Environment Variables** (set in Vercel dashboard):
```env
VITE_API_URL=https://your-api.railway.app/api
```

### Railway (Recommended for API)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize and deploy API
cd apps/api
railway init
railway up

# Set environment variables
railway variables set JWT_SECRET=your-secret-key-change-this
railway variables set DATABASE_URL=postgresql://...
```

### Render (Alternative for API)

1. Create new **Web Service** on [Render](https://render.com)
2. Connect your Git repository
3. Configure:
   - **Build Command**: `npm install && npm run build:api`
   - **Start Command**: `node dist/apps/api/main.js`
   - **Environment Variables**: `JWT_SECRET`, `DATABASE_URL`

### Docker Compose (Self-Hosted)

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Scale services
docker-compose up -d --scale api=3
```

**Services** (all running locally):
- **Website**: http://localhost:3001
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3333
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Docker Hub (Push Images)

```bash
# Login to Docker Hub
docker login

# Build and tag
docker build -t yourusername/myapp-api:latest -f apps/api/Dockerfile .
docker build -t yourusername/myapp-dashboard:latest -f apps/dashboard/Dockerfile .
docker build -t yourusername/myapp-website:latest -f apps/website/Dockerfile .

# Push
docker push yourusername/myapp-api:latest
docker push yourusername/myapp-dashboard:latest
docker push yourusername/myapp-website:latest
```

### GitHub Actions (Automated CI/CD)

Your project includes two workflows that run automatically:

**`.github/workflows/ci.yml`** (Pull Requests):
- Install dependencies
- TypeScript typecheck all projects
- Lint all projects
- Build all apps
- Run E2E tests (Chromium only in CI)
- npm audit security check

**`.github/workflows/deploy.yml`** (Push to `main`):
- Build Docker images
- Push to Docker Hub
- Deploy Website to Vercel
- Deploy API to Railway

**Setup**:
1. Add GitHub repository secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `RAILWAY_TOKEN`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`

2. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/my-app.git
git push -u origin main
```

3. Workflows run automatically!

For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) in your generated project.

---

## 🏗️ Architecture

### System Design Diagram

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Website  │      │Dashboard │      │  Mobile  │
│(Next.js) │      │ (React)  │      │ (Future) │
│Port 3001 │      │Port 3000 │      │          │
└────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │
     │                 │                  │
     └─────────────────┼──────────────────┘
                       │
                 HTTP/REST API
                       │
                       ▼
              ┌────────────────┐
              │   API Server   │
              │   (NestJS)     │
              │   Port 3333    │
              └────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐  ┌──────────┐  ┌──────────┐
│ PostgreSQL  │  │  Redis   │  │   S3     │
│  Database   │  │  Cache   │  │ Storage  │
│  Port 5432  │  │Port 6379 │  │ (Future) │
└─────────────┘  └──────────┘  └──────────┘
```

### Authentication Flow

```
1. User visits /dashboard
2. No auth token → <ProtectedRoute> redirects to /login
3. User submits login form (email + password)
4. Dashboard → POST /api/auth/login { email, password }
5. API validates credentials with bcrypt.compare()
6. API generates JWT token (expiresIn: '1h')
7. API returns { token, user: { id, email, name } }
8. Dashboard stores token in localStorage.setItem('token', ...)
9. Dashboard sets user in AuthContext
10. Dashboard redirects to /dashboard
11. Protected routes check token before rendering
12. Dashboard sends token in Authorization header for API calls
```

### Data Flow

```
Component → useAuth() hook → AuthContext → localStorage
                                    ↓
                            API calls with token
                                    ↓
                        API validates with JwtStrategy
                                    ↓
                          Returns protected data
```

### Technology Choices

**Why Nx?**
- Monorepo management without the complexity
- Intelligent caching (rebuilds are instant)
- Code sharing between apps (`@projectname/lib`)
- Affected command (only test what changed)
- Task orchestration (parallel builds)

**Why Next.js for Website?**
- SEO optimization (Server-side rendering)
- App Router with React Server Components
- Automatic code splitting
- Built-in image optimization
- Fast page loads

**Why Vite for Dashboard?**
- Extremely fast HMR (instant updates)
- Optimized production builds
- Simple configuration
- Modern ES modules

**Why NestJS for API?**
- TypeScript native
- Modular architecture (easy to scale)
- Built-in dependency injection
- Excellent documentation
- Easy testing

**Why Playwright?**
- Multi-browser testing (Chromium, Firefox, WebKit)
- Auto-wait (no flaky tests)
- Great debugging tools (UI mode, traces)
- Fast parallel execution

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md) in your generated project.

---

## 🔒 Security Features

Your generated application includes production-grade security:

### Authentication
- ✅ **JWT Tokens** - Signed with secret key (set `JWT_SECRET` env var)
- ✅ **Password Hashing** - bcrypt with salt rounds (10)
- ✅ **Token Expiration** - 1 hour (configurable in `auth.module.ts`)
- ✅ **Secure Storage** - localStorage (upgrade to httpOnly cookies in production)

### API Security
- ✅ **Input Validation** - class-validator DTOs on all endpoints
- ✅ **CORS Configuration** - Specific origins only (configure in `main.ts`)
- ✅ **Rate Limiting** - Ready to add with `@nestjs/throttler`
- ✅ **Helmet** - Security headers (uncomment in `main.ts`)

### Frontend Security
- ✅ **XSS Protection** - React escapes output by default
- ✅ **Type Safety** - TypeScript strict mode
- ✅ **Environment Variables** - Never commit secrets
- ✅ **Dependency Audits** - `npm audit` in CI/CD

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Enable HTTPS (required in production)
- [ ] Switch to httpOnly cookies for tokens
- [ ] Add rate limiting to API endpoints
- [ ] Set up Content Security Policy (CSP)
- [ ] Configure CORS allowlist properly
- [ ] Add refresh tokens for longer sessions
- [ ] Implement password strength requirements
- [ ] Add CSRF protection for state-changing operations
- [ ] Set up database backups

---

## 📚 Documentation

Each generated project includes comprehensive documentation:

### README.md
- Project overview with your user story
- Quick start guide (install, run, test)
- Development mode instructions (Nx + Docker)
- Project structure tree with explanations
- Testing instructions
- Available npm scripts
- Links to other docs

### ARCHITECTURE.md
- System design diagrams
- Authentication flow
- Data flow diagrams
- Technology stack rationale
- Security considerations
- Database design guidelines
- Caching strategy
- Deployment architecture
- Scaling considerations
- Future enhancements roadmap

### DEPLOYMENT.md (250+ lines)
- **Docker Deployment** - Full docker-compose setup
- **Vercel** - Deploy Website and Dashboard
- **Railway** - Deploy API with PostgreSQL
- **Render** - Alternative API deployment
- **GitHub Actions** - Automated CI/CD setup
- **Environment Variables** - Complete reference
- **Domain Setup** - Custom domain instructions
- **SSL/HTTPS** - Certificate configuration
- **Monitoring** - Logging and error tracking
- **Troubleshooting** - Common deployment issues

---

## 🎯 Current Status

### ✅ Completed (v0.7.0)

- **Phase 1** - CLI Foundation (Commander.js, Inquirer, EJS templates)
- **Phase 2** - Nx Workspace Generation
- **Phase 3** - Shared Libraries (`@app/ui`, `@app/auth`, `@app/shared`)
- **Phase 4** - Dashboard App (React + Vite, full auth)
- **Phase 4** - API App (NestJS, JWT, bcrypt)
- **Phase 5** - Website App (Next.js 15, App Router, pricing page)
- **Phase 6** - E2E Testing (Playwright multi-browser tests)
- **Phase 7** - DevOps (Docker, docker-compose, GitHub Actions CI/CD)
- **Phase 8** - Documentation (README, ARCHITECTURE, DEPLOYMENT guides)

### 🚧 In Progress (v0.8.0)

- [ ] CLI enhancements (`hatch dev`, `hatch build`, `hatch deploy` commands)
- [ ] Improved error handling and validation
- [ ] Enhanced user story parsing
- [ ] Better progress indicators
- [ ] CLI documentation updates

### 🔮 Planned (v1.0.0+)

- [ ] Database integration (Prisma ORM + PostgreSQL)
- [ ] User profile management UI
- [ ] Password reset flow
- [ ] Email verification
- [ ] Billing integration (Stripe)
- [ ] Admin dashboard generator
- [ ] Blog app generator (Next.js + MDX)
- [ ] Docs app generator (Nextra)
- [ ] Mobile app generator (React Native)
- [ ] GraphQL API option
- [ ] Real-time features (WebSockets)
- [ ] File upload with S3
- [ ] Advanced entity extraction from stories
- [ ] Custom page generation based on entities
- [ ] Multiple theme presets
- [ ] Plugin system

---

## 📊 Comparison with Alternatives

| Feature | Hatch | Create Next App | T3 Stack | Create React App | RedwoodJS |
|---------|-------|-----------------|----------|------------------|-----------|
| **Story-Driven** | ✅ Natural language | ❌ | ❌ | ❌ | ❌ |
| **Full-Stack** | ✅ Frontend + Backend | ❌ Frontend only | ✅ | ❌ Frontend only | ✅ |
| **Monorepo** | ✅ Nx | ❌ | ❌ | ❌ | ❌ |
| **Multiple Apps** | ✅ 3 apps | ❌ 1 app | ❌ 1 app | ❌ 1 app | ⚠️ Cells |
| **Auth Built-In** | ✅ JWT + Protected Routes | ❌ | ✅ NextAuth | ❌ | ✅ |
| **E2E Tests** | ✅ Playwright | ❌ | ❌ | ❌ | ⚠️ |
| **Docker** | ✅ + docker-compose | ❌ | ❌ | ❌ | ❌ |
| **CI/CD** | ✅ GitHub Actions | ❌ | ❌ | ❌ | ❌ |
| **UI Components** | ✅ 5 components | ❌ | ❌ | ❌ | ❌ |
| **Documentation** | ✅ 3 guides | ⚠️ Basic | ⚠️ Basic | ⚠️ Basic | ✅ |
| **TypeScript** | ✅ Strict mode | ⚠️ Optional | ✅ | ⚠️ Optional | ✅ |
| **Modern Stack** | ✅ 2025 | ✅ | ✅ | ❌ Outdated | ✅ |

---

## 🤝 Contributing

Hatch is currently in active development. Contributions welcome!

### Development Setup

```bash
# Clone the Hatch CLI repository
git clone https://github.com/yourusername/hatch.git
cd hatch

# Install dependencies
npm install

# Link CLI globally for testing
npm link

# Test the CLI
hatch init test-project

# Make changes to templates in templates/ directory

# Build
npm run build

# Unlink when done
npm unlink -g hatch-cli
```

### Areas to Contribute

- 🎨 New UI components
- 📦 Additional libraries (billing, email, etc.)
- 🧪 More test coverage
- 📖 Documentation improvements
- 🐛 Bug fixes
- ✨ Feature enhancements
- 🎨 Theme presets
- 🌍 Internationalization (i18n)

---

## 📝 License

MIT © 2025

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [Nx](https://nx.dev) - Monorepo orchestration
- [Next.js](https://nextjs.org) - React framework
- [NestJS](https://nestjs.com) - Node.js framework
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Playwright](https://playwright.dev) - Browser testing
- [TypeScript](https://www.typescriptlang.org) - Type safety

---

## 📞 Support

- 📖 [Documentation](https://github.com/yourusername/hatch/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/hatch/issues)
- 💬 [Discussions](https://github.com/yourusername/hatch/discussions)
- 📧 Email: support@hatch.dev (coming soon)

---

<div align="center">

**Built with ❤️ for developers who ship fast**

[Get Started](#-quick-start) • [View Examples](#-examples) • [Read Docs](#-documentation)

</div>

---

## 🌱 The Bloom System

Hatch is part of the Bloom system for AI-assisted product development:

| Component | Purpose |
|-----------|---------|
| **seed** | Bootstrap CLI - converts intent to scaffolded project |
| **prefs** | Design values - can be swapped for custom preferences |
| **grove** | Agentic layer - guides autonomous development |
| **hatch** | Stack scaffold - generates production-ready code |

**Override pattern**: prefs overrides grove and hatch defaults.

See [github.com/derrybirkett/bloom](https://github.com/derrybirkett/bloom) for full system documentation.
