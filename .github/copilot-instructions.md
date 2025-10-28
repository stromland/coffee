# Copilot Instructions for Coffee Brew App

## Code Quality Principles

### DRY (Don't Repeat Yourself)
- **Avoid code duplication**: Extract common functionality into shared utility functions or components
- **Create reusable utilities**: Place shared functions in appropriate directories (e.g., `src/utils/` for utility functions)
- **Use imports**: Always import shared code rather than duplicating it across files
- **Consistent patterns**: If you find similar code in multiple places, refactor it into a single, reusable implementation

### Examples
- ✅ **Good**: Create `src/utils/idGenerator.ts` and import `generateSecureId` where needed
- ❌ **Bad**: Copy the same `generateSecureId` function into multiple component files

## Project Structure

- `src/components/` - React components
- `src/utils/` - Shared utility functions and helpers
- `src/types/` - TypeScript type definitions

## Security Best Practices

- Use cryptographically secure random generation (`window.crypto.getRandomValues()`) for IDs and tokens
- Never use `Math.random()` for security-sensitive operations
- Validate and sanitize user inputs

## Code Style

- Follow existing patterns in the codebase
- Use TypeScript types consistently
- Add JSDoc comments for exported functions
- Keep components focused and single-purpose
