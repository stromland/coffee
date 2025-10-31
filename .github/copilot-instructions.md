# Copilot Instructions for Coffee Brew App

## Code Quality Principles

### DRY (Don't Repeat Yourself)

- **Avoid code duplication**: Extract common functionality into shared utility functions or components
- **Create reusable utilities**: Place shared functions in appropriate directories (e.g., `src/shared/utils/` for utility functions)
- **Use imports**: Always import shared code rather than duplicating it across files
- **Consistent patterns**: If you find similar code in multiple places, refactor it into a single, reusable implementation

### Examples

- ✅ **Good**: Create `src/shared/utils/idGenerator.ts` and import `generateSecureId` where needed
- ❌ **Bad**: Copy the same `generateSecureId` function into multiple component files

## Project Structure

The project follows a clean architecture with clear separation between app routing, business logic, and UI:

```
src/
├── app/                        # Application layer (routing & global state)
│   ├── components/
│   │   └── AppLayout.tsx      # Main layout with header, nav, footer
│   ├── pages/
│   │   ├── DashboardPage.tsx  # Main dashboard route
│   │   ├── MethodsPage.tsx    # Brew methods management route
│   │   └── HistoryPage.tsx    # Brewing history route
│   ├── router.tsx             # React Router configuration (basename: /coffee)
│   └── AppContext.tsx         # Global state (settings, methods, steps)
│
├── components/                 # Feature components (main UI)
│   ├── CoffeeCalculator.tsx   # Coffee/water ratio calculator
│   ├── BrewingSteps.tsx       # Brewing instructions display
│   ├── BrewingPresets.tsx     # Brew method selector
│   ├── BrewMode.tsx           # Fullscreen brewing timer
│   ├── BrewMethodManager.tsx  # Method list & CRUD
│   ├── BrewMethodEditor.tsx   # Create/edit brew methods
│   ├── BrewingHistory.tsx     # Session history list
│   └── SaveSessionForm.tsx    # Save brewing session
│
├── core/                       # Business logic & data layer
│   ├── services/
│   │   ├── BrewingService.ts  # Calculate brew steps from method
│   │   ├── BrewMethodService.ts # Method CRUD operations
│   │   └── SessionService.ts  # Session CRUD operations
│   └── storage/
│       └── repositories/
│           ├── interfaces/     # Repository contracts
│           ├── localStorage/   # LocalStorage implementations
│           └── RepositoryFactory.ts
│
├── shared/                     # Reusable UI & utilities
│   ├── components/
│   │   ├── ui/                # Base components (Button, Card, Input, Modal, Select)
│   │   └── layout/            # Layout components (Section, PageLayout)
│   └── utils/
│       ├── formatters.ts      # Time formatting utilities
│       └── idGenerator.ts     # Secure ID generation
│
├── types/                      # TypeScript type definitions
│   └── coffee.ts              # Core domain types (BrewMethod, Pour, BrewStep, etc.)
│
├── App.tsx                     # Root component (wraps Router)
└── main.tsx                    # Entry point
```

### Architecture Principles

- **App Layer** (`src/app/`) - Handles routing, navigation, and global state management
- **Components** (`src/components/`) - Feature-specific UI components, self-contained with their logic
- **Core** (`src/core/`) - Pure business logic and data access, no React dependencies
- **Shared** (`src/shared/`) - Generic reusable components and utilities
- **Types** (`src/types/`) - Domain models and type definitions

### Key Design Patterns

- **Repository Pattern**: Data access abstracted behind interfaces
- **Service Layer**: Business logic separated from UI
- **Context API**: Global state without prop drilling
- **Component Composition**: Reusable UI components

## Routing

- **Base URL**: `/coffee` (configured in vite.config.ts and router basename)
- **Routes**:
  - `/coffee` or `/coffee/` - Dashboard (index route)
  - `/coffee/methods` - Brew method management
  - `/coffee/history` - Brewing history
- **Navigation**: Uses React Router with AppLayout containing persistent navigation header
- **State Management**: AppContext provides global state across routes

## Security Best Practices

- Use cryptographically secure random generation (`window.crypto.getRandomValues()`) for IDs and tokens
- Never use `Math.random()` for security-sensitive operations
- Validate and sanitize user inputs

## Code Style

- Follow existing patterns in the codebase
- Use TypeScript types consistently
- Add JSDoc comments for exported functions
- Keep components focused and single-purpose

## Git Workflow

- **Always ask before committing**: Never commit changes without explicit user confirmation
- Present a summary of changes and wait for approval before running `git commit`

## GitHub Issue Workflow

When instructed to start working on a GitHub issue:

1. **Fetch issue details**: Use `gh issue view <issue-number>` to get the full issue information
2. **Assign the issue**: Use `gh issue edit <issue-number> --add-assignee @me` to assign the user
3. **Create feature branch**: Create a new branch using the pattern `issue-<number>-brief-description`
4. **Track progress**: Update the issue with progress comments as tasks are completed using `gh issue comment <issue-number> --body "message"`
5. **Complete work**: When all tasks are done, comment on the issue
6. **Ask before PR**: When you believe the issue is complete, **ask the user if you should create a pull request**
7. **Create PR**: If approved, push the branch and create a PR with:
   - Title matching the issue
   - Detailed description of changes
   - Reference to the issue (e.g., "Closes #16")
   - Update the issue with the PR link
