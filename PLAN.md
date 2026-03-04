# Hatch - SaaS Application Bootstrapping Tool

## Overview
Hatch is a CLI-first tool that bootstraps complete SaaS applications from user stories, generating a production-ready Nx monorepo with multiple product surfaces, authentication, billing, and comprehensive testing.

---

## 🎯 Core Objectives

1. **User Story-Driven**: Accept natural language user stories and generate themed applications
2. **Complete Ecosystem**: Generate all necessary product surfaces in one command
3. **Production-Ready**: Include authentication, billing, testing, and deployment configs
4. **Modern Stack**: Leverage Nx, React, shadcn/ui, and Playwright
5. **Extensible**: Allow customization and extension of generated code

---

## 🏗️ Architecture

### Monorepo Structure (Nx)
```
hatch-output/
├── apps/
│   ├── website/              # Marketing landing page (Next.js)
│   ├── dashboard/            # Main SaaS application (React)
│   ├── blog/                 # Content/blog (Next.js)
│   ├── docs/                 # Product documentation (Docusaurus/Nextra)
│   └── api/                  # Backend API (NestJS/Express)
├── libs/
│   ├── ui/                   # Shared UI components (shadcn/ui)
│   ├── auth/                 # Authentication logic & adapters
│   ├── billing/              # Stripe integration & billing logic
│   ├── shared/               # Shared utilities, types, constants
│   └── e2e-utils/            # Shared Playwright utilities
├── tools/
│   └── generators/           # Custom Nx generators
└── e2e/
    ├── website-e2e/          # Website Playwright tests
    ├── dashboard-e2e/        # Dashboard Playwright tests
    └── api-e2e/              # API integration tests
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (for apps), Nx for orchestration
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: React Router v6
- **State Management**: Zustand / TanStack Query
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth) - ready for OAuth providers
- **API**: REST + optional GraphQL
- **Validation**: class-validator / Zod

### Testing
- **E2E**: Playwright with visual regression testing
- **Unit/Integration**: Vitest
- **API Testing**: Supertest

### Infrastructure
- **Monorepo**: Nx 18+
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions (generated workflows)
- **Containerization**: Docker & Docker Compose

---

## 📋 Implementation Phases

### Phase 1: CLI Foundation
**Goal**: Create the core CLI tool and scaffolding engine

#### Tasks:
1. **CLI Setup**
   - [ ] Initialize CLI project with Commander.js
   - [ ] Implement `hatch init` command
   - [ ] Create interactive prompts (Inquirer.js)
   - [ ] User story parser (basic NLP or structured prompts)
   - [ ] Configuration schema (hatch.config.json)

2. **Template System**
   - [ ] Design template engine (EJS/Handlebars)
   - [ ] Create template variable system
   - [ ] Theme extraction from user stories (colors, naming, etc.)
   - [ ] Template validation system

3. **CLI Commands**
   ```bash
   hatch init [project-name]           # Interactive setup
   hatch generate [app|lib|component]  # Generate additional resources
   hatch dev                           # Start all dev servers
   hatch test                          # Run all tests
   hatch build                         # Production build
   hatch deploy                        # Deploy (future)
   ```

---

### Phase 2: Nx Workspace Setup
**Goal**: Generate base Nx monorepo structure

#### Tasks:
1. **Workspace Initialization**
   - [ ] Generate nx.json configuration
   - [ ] Setup pnpm workspaces
   - [ ] Configure TypeScript paths and references
   - [ ] Setup Nx cache configuration
   - [ ] Create .gitignore, .prettierrc, .eslintrc

2. **Build Configuration**
   - [ ] Configure Vite for React apps
   - [ ] Setup Tailwind CSS configuration
   - [ ] Configure path aliases (@hatch/ui, etc.)
   - [ ] Setup build targets in project.json files

---

### Phase 3: Core Libraries
**Goal**: Create shared libraries for reuse across apps

#### Tasks:
1. **UI Library (@hatch/ui)**
   - [ ] Initialize shadcn/ui components
   - [ ] Create base components:
     - Button, Input, Card, Dialog, Toast
     - Navigation, Sidebar, Header
     - DataTable, Form components
   - [ ] Theme provider (light/dark mode)
   - [ ] Storybook setup for component documentation

2. **Auth Library (@hatch/auth)**
   - [ ] Auth context provider
   - [ ] Protected route wrapper
   - [ ] Auth adapters:
     - Email/Password
     - OAuth (Google, GitHub, etc.)
     - Magic link
   - [ ] Session management hooks
   - [ ] JWT handling utilities

3. **Billing Library (@hatch/billing)**
   - [ ] Stripe SDK integration
   - [ ] Subscription components
   - [ ] Pricing table component
   - [ ] Payment method management
   - [ ] Webhook handlers
   - [ ] Usage tracking utilities

4. **Shared Library (@hatch/shared)**
   - [ ] Common types and interfaces
   - [ ] API client (Axios/Fetch wrapper)
   - [ ] Error handling utilities
   - [ ] Date/time utilities
   - [ ] Validation schemas (Zod)

---

### Phase 4: Product Surfaces - Frontend

#### 4.1 Website (Marketing Landing Page)
**Tech**: Next.js 14+ with App Router

**Features**:
- [ ] Hero section (generated from user story)
- [ ] Features showcase
- [ ] Pricing section (connected to billing)
- [ ] FAQ section
- [ ] Footer with links
- [ ] CTA buttons → Dashboard login
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Responsive design
- [ ] Contact form

**Pages**:
- `/` - Home
- `/features` - Feature details
- `/pricing` - Pricing plans
- `/about` - About page
- `/contact` - Contact form

#### 4.2 Dashboard (Main SaaS App)
**Tech**: React + Vite + React Router

**Features**:
- [ ] Authentication flow (login/signup)
- [ ] User profile page
  - Avatar upload
  - Name, email, bio editing
  - Password change
  - Account deletion
- [ ] Billing page
  - Current plan display
  - Upgrade/downgrade
  - Payment method management
  - Billing history
  - Invoice downloads
- [ ] Settings page
- [ ] Logout functionality → redirects to website
- [ ] Dashboard layout with sidebar
- [ ] Notifications system
- [ ] User-story specific features (customizable)

**Routes**:
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Dashboard home
- `/dashboard/profile` - User profile
- `/dashboard/billing` - Billing management
- `/dashboard/settings` - Settings
- `/dashboard/[user-story-routes]` - Custom routes

#### 4.3 Blog
**Tech**: Next.js with MDX support

**Features**:
- [ ] Blog post listing
- [ ] Individual post pages
- [ ] Categories/tags
- [ ] Author profiles
- [ ] RSS feed
- [ ] Search functionality
- [ ] Code syntax highlighting
- [ ] Reading time estimates
- [ ] Social sharing

#### 4.4 Documentation Site
**Tech**: Nextra or Docusaurus

**Features**:
- [ ] Getting started guide
- [ ] API documentation
- [ ] Component documentation
- [ ] Search functionality
- [ ] Versioning support
- [ ] Code examples
- [ ] Interactive playground (optional)

---

### Phase 5: Backend (API Framework)

#### API Application
**Tech**: NestJS with TypeScript

**Modules**:
1. **Auth Module**
   - [ ] Registration endpoint
   - [ ] Login/logout endpoints
   - [ ] JWT token generation
   - [ ] Password reset flow
   - [ ] OAuth callback handlers
   - [ ] Session management
   - [ ] Guards and decorators

2. **User Module**
   - [ ] User CRUD operations
   - [ ] Profile management
   - [ ] Avatar upload (S3/local storage)
   - [ ] User preferences

3. **Billing Module**
   - [ ] Stripe integration
   - [ ] Subscription management
   - [ ] Webhook handler (Stripe events)
   - [ ] Invoice generation
   - [ ] Usage metering

4. **Core Module**
   - [ ] Health check endpoint
   - [ ] Configuration service
   - [ ] Logger service
   - [ ] Error handling middleware

5. **[User-Story Module]**
   - [ ] Custom endpoints based on user story
   - [ ] CRUD operations for domain entities
   - [ ] Business logic

**Database**:
- [ ] Prisma schema definition
- [ ] Migrations setup
- [ ] Seed data scripts
- [ ] Database models:
  - User
  - Session
  - Subscription
  - Payment
  - [Custom entities from user story]

**API Features**:
- [ ] OpenAPI/Swagger documentation
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Request validation
- [ ] Error handling
- [ ] Logging (Winston/Pino)
- [ ] Environment configuration

---

### Phase 6: Testing Infrastructure

#### Playwright E2E Tests
**Coverage for each app**:

1. **Website**
   - [ ] Landing page loads
   - [ ] Navigation works
   - [ ] Forms submit correctly
   - [ ] Responsive layout tests
   - [ ] CTA redirects to dashboard

2. **Dashboard**
   - [ ] Login flow
   - [ ] Signup flow
   - [ ] Profile editing
   - [ ] Billing page interactions
   - [ ] Logout redirects to website
   - [ ] Protected routes
   - [ ] User-story specific flows

3. **API**
   - [ ] Authentication endpoints
   - [ ] CRUD operations
   - [ ] Error handling
   - [ ] Rate limiting
   - [ ] Webhook processing

**Test Infrastructure**:
- [ ] Playwright config with multiple projects
- [ ] Test fixtures for authenticated users
- [ ] Visual regression testing
- [ ] CI integration
- [ ] Test reports (HTML, GitHub Actions)
- [ ] Database seeding for tests
- [ ] Mock Stripe webhooks

#### Unit/Integration Tests
- [ ] Vitest configuration
- [ ] Component tests (React Testing Library)
- [ ] API service tests
- [ ] Utility function tests
- [ ] Hook tests

---

### Phase 7: Developer Experience

#### Documentation
- [ ] CLI usage guide
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guide
- [ ] Contribution guide

#### Tooling
- [ ] Git hooks (Husky)
  - Pre-commit: Lint, format, type-check
  - Pre-push: Tests
- [ ] Code formatting (Prettier)
- [ ] Linting (ESLint)
- [ ] Type checking (TypeScript strict mode)
- [ ] Commit conventions (Conventional Commits)

#### Development Scripts
```json
{
  "dev": "nx run-many --target=serve --all",
  "dev:api": "nx serve api",
  "dev:dashboard": "nx serve dashboard",
  "dev:website": "nx serve website",
  "build": "nx run-many --target=build --all",
  "test": "nx run-many --target=test --all",
  "test:e2e": "nx run-many --target=e2e --all",
  "lint": "nx run-many --target=lint --all",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit"
}
```

---

### Phase 8: Deployment & DevOps

#### Containerization
- [ ] Dockerfile for each app
- [ ] Docker Compose for local development
- [ ] Multi-stage builds
- [ ] Production optimization

#### CI/CD
- [ ] GitHub Actions workflows
  - Build and test
  - Deploy to staging
  - Deploy to production
- [ ] Environment management
- [ ] Secrets management

#### Hosting Options (Templates)
- [ ] Vercel deployment config (Next.js apps)
- [ ] Railway/Render config (API)
- [ ] Docker deployment guide
- [ ] AWS/GCP deployment guide

---

## 🎨 User Story Processing

### Input Format
```bash
hatch init my-saas --story "A fitness tracking app where users can log workouts, track progress, and share achievements with friends"
```

### Processing Steps
1. **Parse Story**: Extract key concepts
   - Main purpose: "fitness tracking"
   - Entities: users, workouts, progress, achievements
   - Actions: log, track, share
   
2. **Generate Theme**
   - App name: "my-saas"
   - Primary color: Choose based on domain (fitness → energetic colors)
   - Naming conventions: workout, progress, achievement
   
3. **Generate Schema**
   - User model (with auth)
   - Workout model
   - Progress model  
   - Achievement model
   - Friendship model

4. **Generate Routes/Pages**
   - `/dashboard/workouts` - Log workouts
   - `/dashboard/progress` - View progress
   - `/dashboard/achievements` - Achievements
   - `/dashboard/friends` - Social features

5. **Generate API Endpoints**
   - `POST /api/workouts` - Create workout
   - `GET /api/progress` - Get user progress
   - etc.

6. **Generate Tests**
   - User can log a workout
   - User can view progress
   - User can share achievement

---

## 📦 CLI Implementation Details

### Project Structure
```
hatch/ (CLI project)
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── generate.ts
│   │   ├── dev.ts
│   │   └── build.ts
│   ├── generators/
│   │   ├── workspace/
│   │   ├── apps/
│   │   ├── libs/
│   │   └── tests/
│   ├── templates/
│   │   ├── base/
│   │   ├── apps/
│   │   ├── libs/
│   │   └── configs/
│   ├── parsers/
│   │   ├── story-parser.ts
│   │   └── theme-generator.ts
│   ├── utils/
│   │   ├── file-system.ts
│   │   ├── template-engine.ts
│   │   └── npm-runner.ts
│   └── index.ts
├── templates/
│   └── [all template files]
├── package.json
└── tsconfig.json
```

### Dependencies
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "ora": "^7.0.0",
    "execa": "^8.0.0",
    "fs-extra": "^11.0.0",
    "ejs": "^3.1.9",
    "zod": "^3.22.0",
    "cosmiconfig": "^9.0.0"
  }
}
```

---

## 🚀 MVP Feature Checklist

### Phase 1 MVP (Core Functionality)
- [ ] CLI with `init` command
- [ ] Nx workspace generation
- [ ] Basic website app (home page only)
- [ ] Basic dashboard app (login + profile)
- [ ] API with auth endpoints
- [ ] Auth library
- [ ] UI library with 5 core components
- [ ] Basic Playwright test for login flow
- [ ] Docker setup

### Phase 2 MVP (Complete Features)
- [ ] All product surfaces
- [ ] Billing integration
- [ ] Blog and docs sites
- [ ] Comprehensive E2E tests
- [ ] CI/CD workflows
- [ ] User story parser
- [ ] Theme generation

---

## 📊 Success Metrics

1. **Generation Speed**: Full project in < 2 minutes
2. **Test Coverage**: > 80% for generated code
3. **Build Success**: All apps build without errors
4. **Type Safety**: 100% TypeScript strict mode compliance
5. **Documentation**: Every generated component documented
6. **Accessibility**: WCAG 2.1 AA compliance

---

## 🔄 Workflow Example

```bash
# 1. Initialize project
hatch init awesome-saas --story "A project management tool for remote teams"

# 2. Navigate to project
cd awesome-saas

# 3. Install dependencies
pnpm install

# 4. Start development
pnpm dev

# Apps now running:
# - Website: http://localhost:3000
# - Dashboard: http://localhost:4200
# - API: http://localhost:3333
# - Docs: http://localhost:3001
# - Blog: http://localhost:3002

# 5. Run tests
pnpm test:e2e

# 6. Build for production
pnpm build

# 7. Deploy
pnpm deploy
```

---

## 🎯 Next Steps

1. **Immediate**: Set up CLI project structure
2. **Week 1**: Implement core CLI commands and template system
3. **Week 2**: Create workspace and library generators
4. **Week 3**: Build product surface generators (website, dashboard)
5. **Week 4**: Implement API generator and auth system
6. **Week 5**: Add billing, blog, and docs generators
7. **Week 6**: Testing infrastructure and E2E tests
8. **Week 7**: User story parser and theme generation
9. **Week 8**: Polish, documentation, and examples

---

## 📝 Notes & Considerations

### Security
- Environment variable management
- Secrets rotation
- HTTPS enforcement
- CSRF protection
- XSS prevention
- SQL injection protection (via Prisma)
- Rate limiting
- Input validation

### Performance
- Code splitting
- Lazy loading
- Image optimization
- CDN configuration
- Caching strategies
- Database indexing
- API response compression

### Scalability
- Horizontal scaling support
- Database connection pooling
- Queue system for background jobs
- Microservices-ready architecture
- API versioning

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (WCAG AA)
- Focus management

### Customization Hooks
- Custom templates override
- Plugin system for generators
- Configuration presets
- Theme customization
- Component library extension

---

## 🤝 Future Enhancements

- [ ] GraphQL API option
- [ ] Mobile app generation (React Native)
- [ ] Admin panel generation
- [ ] Multi-tenancy support
- [ ] Internationalization (i18n)
- [ ] Analytics integration (Plausible, PostHog)
- [ ] Email service integration
- [ ] Feature flags system
- [ ] A/B testing framework
- [ ] Design system generator
- [ ] CMS integration
- [ ] E-commerce module
- [ ] Real-time features (WebSocket)
- [ ] AI integration helpers
- [ ] Monitoring and observability setup

---

**This plan provides a comprehensive roadmap for building Hatch. Ready to start implementation when you are!**
