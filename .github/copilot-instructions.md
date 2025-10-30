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

The project follows a feature-based architecture with clear separation of concerns:

- `src/app/` - Application root and routing
- `src/features/` - Feature-based modules (self-contained)
  - `calculator/` - Coffee calculator feature
  - `brewing/` - Brewing steps and timer
  - `presets/` - Preset management (FourSix and Custom recipes)
  - `history/` - Brewing history and sessions
  - `methods/` - Brew methods registry
- `src/shared/` - Reusable code across features
  - `components/` - Shared UI components (ui/, forms/, layout/)
  - `hooks/` - Custom React hooks
  - `utils/` - Pure utility functions
  - `constants/` - Application constants
  - `types/` - Shared TypeScript types
- `src/core/` - Core business logic
  - `services/` - Business logic services
  - `storage/` - Data persistence layer and repositories
  - `models/` - Domain models
- `src/config/` - Configuration files

### Legacy Structure (being phased out)
- `src/components/` - Old flat component structure (migrate to features/)
- `src/utils/` - Old utilities (migrate to shared/utils/ or feature-specific utils/)
- `src/types/` - Old types (migrate to shared/types/ or feature-specific types/)

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
