# Hatch Visual Workflows

Visual diagrams to understand Hatch's operation.

---

## 1. End-to-End User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Install Hatch
  $ npm install -g hatch-cli
           │
           ↓
Step 2: Describe Your Idea
  $ hatch init my-app --story "A fitness tracking app..."
           │
           ↓
Step 3: Answer Questions (Interactive)
  ? Project name: my-fitness-app
  ? Description: Track workouts and progress
  ? Author: Your Name
           │
           ↓
Step 4: Workspace Generated (2 min)
  ✓ Analyzing user story...
  ✓ Generating workspace...
  ✓ Creating apps...
  ✓ Creating libraries...
  ✓ Installing dependencies...
  ✓ Initializing git...
           │
           ↓
Step 5: Start Development
  $ cd my-fitness-app
  $ pnpm dev
           │
           ↓
Step 6: Apps Running
  ✓ Website:   http://localhost:3000
  ✓ Dashboard: http://localhost:4200
  ✓ API:       http://localhost:3333
  ✓ Blog:      http://localhost:3002
  ✓ Docs:      http://localhost:3001
           │
           ↓
Step 7: Customize & Deploy
  - Edit generated code
  - Add custom features
  - Run tests: pnpm test:e2e
  - Build: pnpm build
  - Deploy to Vercel/Railway
```

---

## 2. CLI Generation Flow

```
┌────────────────────────────────────────────────────────┐
│                   HATCH CLI ENGINE                      │
└────────────────────────────────────────────────────────┘

User Input
  │
  ├─ Project Name: "my-app"
  ├─ Description: "A SaaS app..."
  └─ Story: "Users can track tasks..."
          │
          ↓
    ┌─────────────┐
    │   PARSERS   │
    └─────────────┘
          │
          ├── Story Parser ──→ Entities: [Task, User, Project]
          │                   Features: [auth, tasks, teams]
          │                   Domain: productivity
          │
          └── Theme Generator ──→ Colors: blue/gray scheme
                                  Font: Inter
          ↓
    ┌─────────────┐
    │  GENERATORS │
    └─────────────┘
          │
          ├── Workspace Generator
          │   └─→ nx.json, package.json, tsconfig.json
          │
          ├── App Generators
          │   ├─→ Website (Next.js)
          │   ├─→ Dashboard (React)
          │   ├─→ Blog (Next.js)
          │   ├─→ Docs (Nextra)
          │   └─→ API (NestJS)
          │
          ├── Library Generators
          │   ├─→ @my-app/ui (shadcn/ui components)
          │   ├─→ @my-app/auth (auth logic)
          │   ├─→ @my-app/billing (Stripe)
          │   └─→ @my-app/shared (utilities)
          │
          ├── Schema Generator
          │   └─→ Prisma schema with User, Task, Project models
          │
          ├── Route Generator
          │   └─→ /dashboard/tasks, /dashboard/projects
          │
          └── Test Generator
              └─→ Playwright tests for all flows
          ↓
    ┌─────────────┐
    │   OUTPUT    │
    └─────────────┘
          │
          └─→ Complete Nx Workspace (ready to run)
```

---

## 3. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      WEB BROWSER                             │
└─────────────────────────────────────────────────────────────┘
      │                    │                    │
      │                    │                    │
┌─────▼──────┐      ┌──────▼─────┐      ┌──────▼──────┐
│  Website   │      │ Dashboard  │      │  Blog/Docs  │
│  (Static)  │      │  (React)   │      │   (Static)  │
│            │      │            │      │             │
│ Port 3000  │      │ Port 4200  │      │ Port 3001/2 │
└────────────┘      └──────┬─────┘      └─────────────┘
                           │
                           │ HTTP Requests
                           │ (Auth token in header)
                           │
                    ┌──────▼──────┐
                    │  API Server │
                    │  (NestJS)   │
                    │             │
                    │  Port 3333  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐  ┌───▼────┐  ┌───▼────┐
        │PostgreSQL │  │ Stripe │  │  S3    │
        │ Database  │  │  API   │  │ (Files)│
        └───────────┘  └────────┘  └────────┘
```

---

## 4. Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│              USER AUTHENTICATION JOURNEY                  │
└──────────────────────────────────────────────────────────┘

User visits website (localhost:3000)
    │
    ├─ Clicks "Sign Up"
    │
    ↓
Dashboard /signup page (localhost:4200/signup)
    │
    ├─ Enters email, password, name
    ├─ Submits form
    │
    ↓
POST /api/auth/register
    │
    ├─ Validate input
    ├─ Hash password (bcrypt)
    ├─ Create user in database
    ├─ Generate JWT token
    │
    ↓
Returns: { user, token }
    │
    ↓
Dashboard stores token
    │
    ├─ localStorage.setItem('token', token)
    ├─ Set auth context
    ├─ Redirect to /dashboard
    │
    ↓
Dashboard /dashboard (protected route)
    │
    ├─ Check token exists
    ├─ Verify token validity
    ├─ Fetch user data
    │
    ↓
User sees dashboard home
    │
    ├─ Profile link
    ├─ Billing link
    ├─ Settings link
    ├─ Logout button


LOGOUT FLOW:
User clicks "Logout"
    │
    ↓
POST /api/auth/logout
    │
    ├─ Invalidate session
    │
    ↓
Dashboard clears token
    │
    ├─ localStorage.removeItem('token')
    ├─ Clear auth context
    ├─ Redirect to website (/)
    │
    ↓
User sees landing page
```

---

## 5. Billing Integration Flow

```
┌──────────────────────────────────────────────────────────┐
│                SUBSCRIPTION FLOW (STRIPE)                 │
└──────────────────────────────────────────────────────────┘

User visits /dashboard/billing
    │
    ↓
View pricing plans
    │
    ├─ Free (current)
    ├─ Pro ($19/mo)
    └─ Enterprise ($99/mo)
    │
    ↓
User clicks "Upgrade to Pro"
    │
    ↓
POST /api/billing/create-checkout-session
    │
    ├─ Create Stripe customer (if new)
    ├─ Create checkout session
    ├─ Return session URL
    │
    ↓
Redirect to Stripe Checkout
    │
    ├─ User enters payment details
    ├─ Stripe processes payment
    │
    ↓
Stripe webhook: checkout.session.completed
    │
    ↓
POST /api/webhooks/stripe
    │
    ├─ Verify webhook signature
    ├─ Extract subscription ID
    ├─ Update user record
    │   └─ subscriptionStatus: "active"
    │       subscriptionPlan: "pro"
    │
    ↓
User redirected to /dashboard/billing?success=true
    │
    ↓
Dashboard polls subscription status
    │
    ↓
UI updates: "You're now on Pro plan!"
    │
    └─ Show active subscription
       Show payment method
       Show next billing date
       Show usage stats
```

---

## 6. Test Execution Flow

```
┌──────────────────────────────────────────────────────────┐
│              PLAYWRIGHT E2E TEST FLOW                     │
└──────────────────────────────────────────────────────────┘

Developer runs: pnpm test:e2e
    │
    ↓
Playwright starts
    │
    ├─ Start test database
    ├─ Seed test data
    ├─ Start all apps (parallel)
    │   ├─ API on port 3333
    │   ├─ Dashboard on port 4200
    │   └─ Website on port 3000
    │
    ↓
Run test suites (parallel)
    │
    ├── Website Tests
    │   ├─ ✓ Landing page loads
    │   ├─ ✓ Navigation works
    │   ├─ ✓ CTA redirects correctly
    │   └─ ✓ Forms validate
    │
    ├── Dashboard Tests
    │   ├─ Setup: Create test user
    │   ├─ ✓ Signup flow
    │   ├─ ✓ Login flow
    │   ├─ ✓ Profile edit
    │   ├─ ✓ Billing page displays
    │   ├─ ✓ Logout redirects
    │   └─ ✓ Protected routes
    │
    └── API Tests
        ├─ ✓ Auth endpoints
        ├─ ✓ User CRUD
        ├─ ✓ Error handling
        └─ ✓ Rate limiting
    │
    ↓
Generate test report
    │
    ├─ HTML report
    ├─ Coverage report
    ├─ Screenshots (on failure)
    └─ Videos (on failure)
    │
    ↓
Results:
  ✓ 45 passed
  ✗ 0 failed
  Duration: 2m 34s
```

---

## 7. Nx Task Execution

```
┌──────────────────────────────────────────────────────────┐
│              NX TASK ORCHESTRATION                        │
└──────────────────────────────────────────────────────────┘

Command: pnpm dev
    │
    ↓
Nx analyzes project graph
    │
┌───┴────────────────────────────────────┐
│  Apps        │  Dependencies            │
├──────────────┼──────────────────────────┤
│  website     │  @my-app/ui, shared      │
│  dashboard   │  @my-app/ui, auth,       │
│              │  billing, shared         │
│  blog        │  @my-app/ui, shared      │
│  docs        │  minimal                 │
│  api         │  @my-app/shared          │
└──────────────┴──────────────────────────┘
    │
    ↓
Build libraries first (parallel)
    │
    ├─→ @my-app/ui ──────────┐
    ├─→ @my-app/auth ────────┤
    ├─→ @my-app/billing ─────┼─→ Cache hits (if built before)
    └─→ @my-app/shared ──────┘
    │
    ↓
Start apps (parallel)
    │
    ├─→ website:serve  → Port 3000 ✓
    ├─→ dashboard:serve → Port 4200 ✓
    ├─→ blog:serve     → Port 3002 ✓
    ├─→ docs:serve     → Port 3001 ✓
    └─→ api:serve      → Port 3333 ✓
    │
    ↓
Watch for changes
    │
    ├─ File changed: libs/ui/Button.tsx
    │     ↓
    │  Rebuild @my-app/ui
    │     ↓
    │  Hot reload: website, dashboard (dependents)
    │
    └─ File changed: apps/api/user.service.ts
          ↓
       Restart: api only
```

---

## 8. Deployment Pipeline

```
┌──────────────────────────────────────────────────────────┐
│            CI/CD DEPLOYMENT FLOW                          │
└──────────────────────────────────────────────────────────┘

Developer: git push origin main
    │
    ↓
GitHub Actions triggered
    │
    ├── Job: Build & Test
    │   ├─ Checkout code
    │   ├─ Install dependencies
    │   ├─ Run linting
    │   ├─ Run type checking
    │   ├─ Run unit tests
    │   ├─ Build all apps
    │   └─ Run E2E tests ✓
    │
    ├── Job: Deploy Frontend (Vercel)
    │   ├─ Deploy website
    │   ├─ Deploy dashboard
    │   ├─ Deploy blog
    │   └─ Deploy docs
    │
    └── Job: Deploy Backend (Railway)
        ├─ Build Docker image
        ├─ Push to registry
        ├─ Deploy to Railway
        ├─ Run database migrations
        └─ Health check ✓
    │
    ↓
Slack notification: "Deployment successful! 🚀"
    │
    ↓
Production URLs:
  - Website:   https://my-app.com
  - Dashboard: https://app.my-app.com
  - API:       https://api.my-app.com
  - Blog:      https://blog.my-app.com
  - Docs:      https://docs.my-app.com
```

---

## 9. File Generation Process

```
┌──────────────────────────────────────────────────────────┐
│          TEMPLATE → OUTPUT TRANSFORMATION                 │
└──────────────────────────────────────────────────────────┘

Template File: dashboard/login.tsx.ejs
────────────────────────────────────────
import { useState } from 'react';
import { Button } from '@<%= projectName %>/ui';
import { useAuth } from '@<%= projectName %>/auth';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  
  const primaryColor = '<%= theme.primaryColor %>';
  
  return (
    <div style={{ accentColor: primaryColor }}>
      <h1>Welcome to <%= projectName %></h1>
      <Button onClick={() => login(email)}>
        Sign In
      </Button>
    </div>
  );
}

Template Variables:
────────────────────────────────────────
{
  projectName: "my-fitness-app",
  theme: {
    primaryColor: "#10b981"
  }
}

Generated Output: apps/dashboard/login.tsx
────────────────────────────────────────
import { useState } from 'react';
import { Button } from '@my-fitness-app/ui';
import { useAuth } from '@my-fitness-app/auth';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  
  const primaryColor = '#10b981';
  
  return (
    <div style={{ accentColor: primaryColor }}>
      <h1>Welcome to my-fitness-app</h1>
      <Button onClick={() => login(email)}>
        Sign In
      </Button>
    </div>
  );
}
```

---

## 10. Developer Customization Points

```
┌──────────────────────────────────────────────────────────┐
│         WHERE DEVELOPERS CUSTOMIZE GENERATED CODE         │
└──────────────────────────────────────────────────────────┘

Generated Project Structure
└── my-app/
    │
    ├── apps/dashboard/src/
    │   ├── pages/
    │   │   ├── Login.tsx           ← Customize UI
    │   │   ├── Profile.tsx         ← Add custom fields
    │   │   └── [custom]/           ← Add new pages
    │   │
    │   └── routes.tsx              ← Add custom routes
    │
    ├── apps/api/src/modules/
    │   ├── user/
    │   │   └── user.service.ts     ← Add business logic
    │   │
    │   └── [custom]/               ← Add new modules
    │       ├── custom.controller.ts
    │       ├── custom.service.ts
    │       └── custom.module.ts
    │
    ├── libs/ui/src/components/
    │   └── [custom]/               ← Add custom components
    │
    ├── prisma/schema.prisma
    │   └── [Add custom models]     ← Extend database
    │
    ├── e2e/dashboard-e2e/
    │   └── [custom].spec.ts        ← Add custom tests
    │
    └── .env
        └── [Add custom env vars]   ← Configuration

🎯 Golden Rule:
   Generated code is YOUR starting point.
   Modify anything to fit your needs!
```

---

These diagrams provide a complete visual understanding of how Hatch works from end to end! 📊
