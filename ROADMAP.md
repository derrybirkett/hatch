# Hatch Implementation Roadmap

## Quick Start Guide

### Week 1: Foundation

**Goal**: Working CLI that generates basic Nx workspace

```bash
# User can run:
hatch init my-app
cd my-app
pnpm install
pnpm dev
```

**Deliverables**:

1. CLI package structure
2. `init` command with prompts
3. Nx workspace generator
4. Basic template system
5. Package.json generation

---

### Week 2: Core Libraries

**Goal**: Shared libraries with shadcn/ui components

**Deliverables**:

1. `@hatch/ui` library with 10 components
2. `@hatch/auth` context and hooks
3. `@hatch/shared` utilities
4. Tailwind configuration
5. TypeScript path aliases working

---

### Week 3: Frontend Surfaces

**Goal**: Website and Dashboard apps up and running

**Deliverables**:

1. Website app (Next.js) - landing page
2. Dashboard app (React) - login, profile, logout
3. Auth flow connecting both apps
4. Routing configured
5. Layout components

---

### Week 4: Backend & Auth

**Goal**: API with working authentication

**Deliverables**:

1. NestJS API app
2. Prisma schema with User model
3. Auth endpoints (login, register, logout)
4. JWT implementation
5. Database migrations
6. Docker Compose for PostgreSQL

---

### Week 5: Billing & Extended Features

**Goal**: Stripe integration and additional pages

**Deliverables**:

1. `@hatch/billing` library
2. Billing page in dashboard
3. Stripe API integration
4. Subscription models
5. Webhook handler
6. Blog app (Next.js + MDX)
7. Docs app (Nextra)

---

### Week 6: Testing Infrastructure

**Goal**: Comprehensive Playwright tests

**Deliverables**:

1. Playwright configuration
2. E2E tests for website
3. E2E tests for dashboard (login, profile, billing, logout)
4. E2E tests for API
5. Vitest unit tests
6. CI workflow (GitHub Actions)

---

### Week 7: User Story Intelligence

**Goal**: Smart generation from user stories

**Deliverables**:

1. Story parser
2. Entity extraction
3. Schema generation from story
4. Route generation
5. Theme/color generation
6. Custom page generation

---

### Week 8: Polish & Release

**Goal**: Production-ready v1.0

**Deliverables**:

1. Complete documentation
2. Example projects
3. Error handling
4. Logging
5. CLI help text
6. README and guides
7. npm publish

---

## Priority Order for MVP

### Must Have (P0)

1. ✅ CLI with init command
2. ✅ Nx workspace generation
3. ✅ Website app (landing page)
4. ✅ Dashboard app (login + profile + logout)
5. ✅ API with auth
6. ✅ Auth library
7. ✅ Basic UI components
8. ✅ Playwright login test
9. ✅ Docker setup

### Should Have (P1)

- Billing integration
- Blog app
- Docs app
- Full E2E test coverage
- User story parser
- Theme generation
- CI/CD workflows

### Nice to Have (P2)

- Advanced story parsing
- Custom generators
- Plugin system
- Multiple auth providers
- Advanced billing features

---

## Development Phases

### Phase 1: Proof of Concept (2 weeks)

- CLI generates Nx workspace
- One app runs (dashboard with login)
- One test passes

### Phase 2: Feature Complete (4 weeks)

- All apps generate
- All core features work
- Tests cover critical paths

### Phase 3: Production Ready (2 weeks)

- Documentation complete
- Error handling robust
- Examples provided
- Published to npm

---

## Technical Decisions

| Decision           | Choice              | Rationale                            |
| ------------------ | ------------------- | ------------------------------------ |
| Monorepo Tool      | Nx                  | Best DX, caching, task orchestration |
| Frontend Framework | React               | Wide adoption, ecosystem             |
| UI Library         | shadcn/ui           | Customizable, accessible, modern     |
| Backend Framework  | NestJS              | TypeScript-native, structured        |
| Database           | PostgreSQL + Prisma | Reliable, type-safe ORM              |
| Auth               | Auth.js             | Flexible, supports many providers    |
| Testing            | Playwright          | Fast, reliable, visual testing       |
| Package Manager    | pnpm                | Fast, efficient, workspace support   |
| Styling            | Tailwind CSS        | Utility-first, fast development      |
| Validation         | Zod                 | Type-safe, composable                |

---

## File Generation Strategy

### Template Types

1. **Static Templates**: Files copied as-is
   - Config files (tsconfig, eslint, prettier)
   - Docker files
   - .gitignore, .nvmrc

2. **Dynamic Templates**: EJS/Handlebars with variables
   - Component files (with project name, theme)
   - API controllers (with entities from user story)
   - Pages (with custom routes)
   - Package.json (with dependencies)

3. **Generated Code**: Programmatically created
   - Prisma schema (from user story entities)
   - Routes (from user story)
   - API endpoints (from entities)
   - Tests (from generated features)

### Template Variables

```typescript
{
  projectName: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  entities: Array<{
    name: string;
    fields: Array<{name: string; type: string}>;
  }>;
  features: string[];
  author: string;
  license: string;
}
```

---

## Command Reference

### hatch init

```bash
hatch init [project-name] [options]

Options:
  --story, -s <story>      User story describing the app
  --template, -t <type>    Template preset (saas, marketplace, social)
  --pm <manager>           Package manager (pnpm, npm, yarn)
  --no-install             Skip installing dependencies
  --no-git                 Skip git initialization
```

### hatch generate

```bash
hatch generate <schematic> <name> [options]

Schematics:
  app <name>              Generate new application
  lib <name>              Generate new library
  component <name>        Generate component in lib/apps
  api-endpoint <name>     Generate API endpoint
  page <name>             Generate page in dashboard
```

### hatch dev

```bash
hatch dev [app-name]

# Start all apps
hatch dev

# Start specific app
hatch dev dashboard
hatch dev api
```

### hatch test

```bash
hatch test [options]

Options:
  --e2e                   Run E2E tests only
  --unit                  Run unit tests only
  --coverage              Generate coverage report
  --watch                 Watch mode
```

---

## Dependency Management

### Core CLI Dependencies

```json
{
  "commander": "^11.0.0",
  "inquirer": "^9.0.0",
  "chalk": "^5.0.0",
  "ora": "^7.0.0",
  "execa": "^8.0.0",
  "fs-extra": "^11.0.0",
  "ejs": "^3.1.9",
  "zod": "^3.22.0"
}
```

### Generated Project Dependencies

```json
{
  "nx": "^18.0.0",
  "react": "^18.2.0",
  "next": "^14.0.0",
  "@nestjs/core": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "next-auth": "^4.24.0",
  "stripe": "^14.0.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "playwright": "^1.40.0",
  "vitest": "^1.0.0"
}
```

---

## Success Criteria

### Functional

- [ ] CLI generates complete Nx workspace
- [ ] All apps start without errors
- [ ] Authentication works end-to-end
- [ ] User can edit profile
- [ ] Billing page displays
- [ ] Logout returns to website
- [ ] All Playwright tests pass
- [ ] Production build succeeds

### Non-Functional

- [ ] Generation completes in < 2 minutes
- [ ] Generated code passes linting
- [ ] TypeScript strict mode enabled
- [ ] No security vulnerabilities
- [ ] All apps are accessible (WCAG AA)
- [ ] Documentation is comprehensive

---

## Risk Mitigation

| Risk                     | Impact | Mitigation                                 |
| ------------------------ | ------ | ------------------------------------------ |
| Template complexity      | High   | Start with simple templates, iterate       |
| Dependency conflicts     | Medium | Lock versions, test combinations           |
| User story parsing       | High   | Start with structured input, add NLP later |
| Maintenance burden       | High   | Modular design, comprehensive tests        |
| Breaking changes in deps | Medium | Version pinning, update strategy           |

---

## GitHub Portfolio Feature (DevFolio)

### Overview

Generate developer portfolios from GitHub profiles to showcase skills to employers.

### User Story

> "As a developer I want an easy portfolio maker which takes info from my GitHub to promote my skills to employers so that I can find new work opportunities"

### Feature Spec

#### Phase 1: GitHub OAuth & Import

- [ ] GitHub OAuth integration for user login
- [ ] GitHub API integration to fetch:
  - Profile (avatar, name, bio, location)
  - Repositories (name, description, stars, forks, language)
  - Skills (based on top languages used)
  - Contributions calendar
  - Pinned repos
- [ ] Portfolio template customization

#### Phase 2: Portfolio Builder

- [ ] Dashboard for managing portfolio
- [ ] Theme customization (colors, layout)
- [ ] Bio/description editing
- [ ] Featured projects selection
- [ ] Contact info configuration
- [ ] Custom domain support

#### Phase 3: Portfolio Display

- [ ] Public portfolio pages
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Shareable links

### Technical Requirements

- GitHub OAuth App registration
- GitHub GraphQL API for comprehensive data
- Portfolio templates (minimal, cards, dark mode)
- Vercel/Netlify deployment support

---

## Next Immediate Steps

1. **Set up CLI project**

   ```bash
   cd /Users/dbirkett/Projects/hatch
   npm init -y
   # Install CLI dependencies
   # Create src/ directory structure
   ```

2. **Create first template**
   - Basic Nx workspace template
   - Test generation manually

3. **Implement init command**
   - Prompt for project name
   - Copy template files
   - Replace variables

4. **Test end-to-end**
   - Generate project
   - Install deps
   - Verify it runs

Ready to start with Step 1? 🚀
