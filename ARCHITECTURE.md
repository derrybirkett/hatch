# Hatch - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HATCH CLI                               │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │   Commands   │  │  Parsers     │  │  Template Engine    │  │
│  │              │  │              │  │                     │  │
│  │ • init       │→ │ • Story      │→ │ • EJS Renderer      │  │
│  │ • generate   │  │ • Theme      │  │ • File Generator    │  │
│  │ • dev        │  │ • Entity     │  │ • Code Formatter    │  │
│  │ • test       │  │   Extractor  │  │                     │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Generates Nx Workspace
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATED NX WORKSPACE                        │
│                                                                  │
│  ┌────────────┐  ┌─────────────┐  ┌────────┐  ┌──────────────┐│
│  │  WEBSITE   │  │  DASHBOARD  │  │  BLOG  │  │     DOCS     ││
│  │  (Next.js) │  │   (React)   │  │(Next.js)│ │   (Nextra)   ││
│  │            │  │             │  │         │  │              ││
│  │ • Landing  │  │ • Login     │  │ • Posts │  │ • Guides     ││
│  │ • Features │  │ • Profile   │  │ • Tags  │  │ • API Ref    ││
│  │ • Pricing  │  │ • Billing   │  │ • Search│  │ • Search     ││
│  │ • CTA      │  │ • Settings  │  │         │  │              ││
│  └────────────┘  └─────────────┘  └────────┘  └──────────────┘│
│         │                │              │              │        │
│         └────────────────┴──────────────┴──────────────┘        │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   SHARED LIBRARIES                        │  │
│  │                                                            │  │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐  │  │
│  │  │   UI    │  │  AUTH   │  │ BILLING  │  │  SHARED   │  │  │
│  │  │         │  │         │  │          │  │           │  │  │
│  │  │ shadcn/ │  │ Context │  │  Stripe  │  │ • Types   │  │  │
│  │  │ ui      │  │ Hooks   │  │  Hooks   │  │ • Utils   │  │  │
│  │  │ Radix   │  │ Guards  │  │ Components│ │ • API     │  │  │
│  │  └─────────┘  └─────────┘  └──────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  API (NestJS)                             │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  Auth    │  │  User    │  │ Billing  │  │  Custom  │ │  │
│  │  │  Module  │  │  Module  │  │  Module  │  │  Modules │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │       │              │              │              │      │  │
│  │       └──────────────┴──────────────┴──────────────┘      │  │
│  │                              │                             │  │
│  │                    ┌─────────▼─────────┐                  │  │
│  │                    │  Prisma ORM       │                  │  │
│  │                    └─────────┬─────────┘                  │  │
│  └──────────────────────────────┼──────────────────────────┘  │
│                                  │                              │
│  ┌───────────────────────────────▼────────────────────────┐   │
│  │              E2E TESTS (Playwright)                     │   │
│  │                                                          │   │
│  │  • Website Tests    • Dashboard Tests    • API Tests    │   │
│  │  • Auth Flows       • User Journeys      • Integration  │   │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌─────────────────┐
                    │  PostgreSQL DB  │
                    └─────────────────┘
```

## Data Flow

### 1. CLI Initialization Flow
```
User runs: hatch init my-app --story "..."
         │
         ↓
    ┌────────────────┐
    │ Parse CLI Args │
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Run Prompts    │  (name, description, etc.)
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Parse Story    │  Extract entities, features
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Generate Theme │  Colors, naming
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Create Config  │  Build template variables
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Generate Files │
    │                │
    │ • Workspace    │
    │ • Apps         │
    │ • Libs         │
    │ • Configs      │
    │ • Tests        │
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Install Deps   │  pnpm install
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │ Initialize Git │
    └────────┬───────┘
             ↓
         Success!
```

### 2. Authentication Flow
```
Website (Landing)
    │
    │ User clicks "Sign In"
    ↓
Dashboard (/login)
    │
    │ Submits credentials
    ↓
API (/auth/login)
    │
    │ Validates credentials
    ↓
Database (Check user)
    │
    │ Returns user data
    ↓
API (Generate JWT)
    │
    │ Returns token + user
    ↓
Dashboard
    │
    │ Store token in localStorage/cookie
    │ Redirect to /dashboard
    ↓
Protected Routes
    │
    │ Check token validity
    ↓
Dashboard Home
```

### 3. Billing Flow
```
Dashboard (/billing)
    │
    │ User selects plan
    ↓
Stripe Checkout
    │
    │ User enters payment
    ↓
Stripe (Process)
    │
    │ Sends webhook
    ↓
API (/webhooks/stripe)
    │
    │ Verify signature
    │ Update subscription
    ↓
Database
    │
    │ Save subscription data
    ↓
Dashboard
    │
    │ Update UI (polling or SSE)
    ↓
Success State
```

### 4. Testing Flow
```
Developer runs: pnpm test:e2e
         │
         ↓
    Playwright
         │
         ├─→ Website Tests
         │   └─ Check landing page
         │      renders correctly
         │
         ├─→ Dashboard Tests
         │   ├─ Test login flow
         │   ├─ Test profile editing
         │   ├─ Test billing page
         │   └─ Test logout redirect
         │
         └─→ API Tests
             ├─ Test auth endpoints
             ├─ Test CRUD operations
             └─ Test error handling
```

## Module Dependencies

```
┌─────────────┐
│   Website   │
└──────┬──────┘
       │
       ├─→ @hatch/ui
       ├─→ @hatch/auth (optional, for protected pages)
       └─→ @hatch/shared

┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ├─→ @hatch/ui
       ├─→ @hatch/auth
       ├─→ @hatch/billing
       └─→ @hatch/shared

┌─────────────┐
│    Blog     │
└──────┬──────┘
       │
       ├─→ @hatch/ui
       └─→ @hatch/shared

┌─────────────┐
│    Docs     │
└──────┬──────┘
       │
       └─→ @hatch/ui (minimal)

┌─────────────┐
│     API     │
└──────┬──────┘
       │
       └─→ @hatch/shared (types, validation schemas)
```

## Component Architecture

### UI Library (@hatch/ui)
```
@hatch/ui/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Card/
│   ├── Dialog/
│   ├── Navigation/
│   └── ...
├── hooks/
│   ├── useToast.ts
│   ├── useTheme.ts
│   └── ...
├── providers/
│   ├── ThemeProvider.tsx
│   └── ToastProvider.tsx
├── styles/
│   └── globals.css
└── index.ts
```

### Auth Library (@hatch/auth)
```
@hatch/auth/
├── components/
│   ├── ProtectedRoute.tsx
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSession.ts
│   └── useUser.ts
├── adapters/
│   ├── email-password.ts
│   ├── oauth.ts
│   └── magic-link.ts
├── utils/
│   ├── token.ts
│   └── storage.ts
└── index.ts
```

### Billing Library (@hatch/billing)
```
@hatch/billing/
├── components/
│   ├── PricingTable.tsx
│   ├── SubscriptionCard.tsx
│   ├── PaymentMethodForm.tsx
│   └── InvoiceList.tsx
├── hooks/
│   ├── useSubscription.ts
│   ├── useInvoices.ts
│   └── usePaymentMethods.ts
├── api/
│   ├── stripe.ts
│   └── subscriptions.ts
└── index.ts
```

## API Structure

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   ├── billing/
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── billing.module.ts
│   │   │   └── webhooks/
│   │   │       └── stripe.webhook.ts
│   │   └── [custom]/
│   │       └── ... (generated from user story)
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   │   └── schema.prisma
│   ├── config/
│   │   └── configuration.ts
│   ├── app.module.ts
│   └── main.ts
└── test/
    └── ...
```

## Database Schema (Prisma)

```prisma
// Base schema - always generated

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?  // null for OAuth users
  name      String?
  avatar    String?
  role      Role     @default(USER)
  
  // Billing
  stripeCustomerId       String?   @unique
  stripeSubscriptionId   String?   @unique
  subscriptionStatus     String?
  subscriptionPlan       String?
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  sessions      Session[]
  payments      Payment[]
  
  // Custom relations (generated from user story)
  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model Payment {
  id                String   @id @default(cuid())
  userId            String
  stripePaymentId   String   @unique
  amount            Int
  currency          String
  status            String
  createdAt         DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("payments")
}

enum Role {
  USER
  ADMIN
}

// Custom models generated from user story
// Example: For "fitness tracking app"
//
// model Workout {
//   id        String   @id @default(cuid())
//   userId    String
//   name      String
//   duration  Int
//   date      DateTime
//   createdAt DateTime @default(now())
//   
//   user User @relation(fields: [userId], references: [id])
// }
```

## Environment Variables

```bash
# Generated .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# API
API_PORT=3333
API_URL="http://localhost:3333"
NODE_ENV="development"

# JWT
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="7d"

# Auth (optional providers)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email (optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Frontend URLs
WEBSITE_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:4200"
BLOG_URL="http://localhost:3002"
DOCS_URL="http://localhost:3001"

# S3 (optional, for file uploads)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_S3_BUCKET=""
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Vercel / Netlify                   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Website  │  │   Blog   │  │   Docs   │          │
│  │ (Static) │  │ (Static) │  │ (Static) │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    Vercel (SSR)                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           Dashboard (React SPA)              │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Railway / Render / Fly.io               │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              API (NestJS)                    │   │
│  └─────────────────┬────────────────────────────┘   │
│                    │                                 │
│  ┌─────────────────▼────────────────────────────┐   │
│  │         PostgreSQL Database                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

                External Services
┌────────────┐  ┌────────────┐  ┌────────────┐
│   Stripe   │  │  Auth0/    │  │    S3      │
│  (Billing) │  │  Clerk     │  │  (Files)   │
└────────────┘  └────────────┘  └────────────┘
```

## Security Considerations

### Authentication
- JWT tokens with short expiration
- Refresh token rotation
- HTTP-only cookies for sensitive tokens
- CSRF protection
- Rate limiting on auth endpoints

### API Security
- Helmet.js for header security
- CORS configured per environment
- Input validation with class-validator/Zod
- SQL injection protection (Prisma)
- XSS protection

### Data Security
- Passwords hashed with bcrypt (12 rounds)
- Sensitive data encrypted at rest
- Environment variables for secrets
- No credentials in client-side code

### Infrastructure
- HTTPS enforced in production
- Database connection pooling
- Secrets management (Vault, AWS Secrets Manager)
- Logging (no sensitive data logged)

---

This architecture provides a solid, scalable foundation for generated SaaS applications. Ready to implement! 🚀
