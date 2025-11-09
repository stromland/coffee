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

## Code Style

- Follow existing patterns in the codebase
- Use TypeScript types consistently
- Add JSDoc comments for exported functions
- Keep components focused and single-purpose

## UI Component Guidelines

- **Avoid Modal components** unless explicitly requested
- For forms and editors (adding/editing items), follow the pattern used in **BrewMethodEditor** and **MethodsPage**:
  - Use inline forms or dedicated pages/sections instead of modals
  - Keep forms visible and integrated into the page flow
  - This improves UX by allowing users to see context while filling forms
- **Mobile-first responsive design**: All features and UI changes must be fully functional and visually appropriate on smaller screens
  - Test layouts on mobile viewports (use responsive Tailwind classes like `sm:`, `md:`, `lg:`)
  - Ensure buttons, inputs, and interactive elements are accessible and not cut off on small screens
  - Stack elements vertically on mobile when horizontal layouts become cramped

## Git Workflow

- **Always ask before committing**: NEVER commit changes without explicit user confirmation!
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
