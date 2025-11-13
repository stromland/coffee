<!--
Sync Impact Report:
- Version change: None → 1.0.0 (Initial constitution)
- Added principles: 6 new core principles
- Added sections: Development Constraints
- Removed: Git Workflow principle (AI-specific, belongs in copilot-instructions.md)
- Templates status:
  ✅ .specify/templates/plan-template.md (reviewed - Constitution Check section compatible)
  ✅ .specify/templates/spec-template.md (reviewed - requirements alignment compatible)
  ✅ .specify/templates/tasks-template.md (reviewed - task organization compatible)
  ✅ .github/copilot-instructions.md (AI-specific git workflow guidance remains there)
  ✅ .github/instructions/reactjs.instructions.md (reviewed - React patterns align)
- Follow-up TODOs: None
-->

# Coffee Brew Dashboard Constitution

## Core Principles

### I. DRY Principle (NON-NEGOTIABLE)

Code duplication is forbidden. All developers MUST extract common functionality into shared utilities located in `src/shared/utils/` for functions and `src/shared/components/` for UI components. When similar code patterns appear in two or more places, immediate refactoring to a single reusable implementation is required. Always import shared code rather than duplicating it across files. This principle ensures maintainability, reduces bugs from inconsistent implementations, and creates a library of battle-tested utilities that benefit the entire application.

### II. Layered Architecture with Clean Separation

The application MUST maintain strict separation between layers. The core layer located in `src/core/` implements pure business logic through services and repositories and MUST NOT import React or any UI dependencies. The service layer contains all calculations and business rules. The repository pattern abstracts data access with interfaces that allow storage implementation to change without affecting business logic. Components in `src/components/` and `src/app/` connect services to UI via hooks and Context API. Type definitions in `src/types/` are shared across all layers. This separation enables independent testing of business logic, supports future migrations such as cloud sync, and prevents coupling between concerns.

### III. TypeScript-First with Strict Types

All source code MUST use TypeScript with strict mode enabled in `tsconfig.json`. No JavaScript files are permitted in `src/` directories. The `any` type is forbidden except in justified edge cases that MUST be documented with inline comments explaining why type safety cannot be achieved. All domain models require interface definitions. Component props MUST be typed with interfaces rather than inline types. This principle prevents runtime type errors, enables superior IDE support, documents expected data shapes, and makes refactoring safer through compile-time validation.

### IV. Mobile-First Responsive Design

All features MUST work on mobile viewports first before desktop optimization. Development and testing begin with small screen sizes and expand upward. Use Tailwind responsive classes such as `sm:`, `md:`, and `lg:` to progressively enhance layouts. Interactive elements MUST have minimum 44px touch targets. Layouts MUST stack vertically on small screens when horizontal arrangements become cramped. This principle ensures the application serves its primary use case of brewing coffee in the kitchen with a phone, provides excellent experience for the majority of users on mobile devices, and prevents desktop-centric designs that break on small screens.

### V. Component Simplicity and Single Responsibility

Components MUST focus on a single concern and remain focused. The application pattern favors inline forms and dedicated sections rather than modal dialogs, following the BrewMethodEditor pattern as the standard. Prefer composition over complex conditional rendering. Extract custom hooks for reusable stateful logic that can be shared across components. All exported functions MUST include JSDoc comments explaining purpose, parameters, and return values. This principle keeps components understandable, testable, and maintainable while preventing modal fatigue and improving user experience by keeping context visible during interactions.

### VI. Data Persistence and Offline-First Architecture

All user data including brew methods, coffee profiles, and session history MUST persist to browser localStorage through repository interfaces. The repository pattern enables future storage migration to cloud sync or other backends without changing service or component code. The application is a Progressive Web App with full offline support via Vite PWA plugin and service worker. No external API dependencies are permitted for core functionality. LocalStorage schema MUST be versioned to support future migrations. This principle ensures users never lose their brewing data, enables the app to work anywhere without internet connectivity, and maintains architectural flexibility for future enhancements.

## Development Constraints

The user interface MUST avoid modal components in favor of inline forms and dedicated sections, following the BrewMethodEditor pattern. State management uses React Context API exclusively without external libraries such as Redux or Zustand unless the component count exceeds 50 and Context becomes unmaintainable. All development MUST follow the patterns and standards documented in `.github/instructions/reactjs.instructions.md` for React best practices. Performance optimizations using React.memo, useMemo, and useCallback should only be applied when profiling identifies actual performance issues. Accessibility features including semantic HTML, proper ARIA attributes, and keyboard navigation support are required for all interactive elements.

## Governance

This constitution supersedes all other development practices and guidelines. All code reviews MUST verify compliance with the core principles before approval. Architectural changes such as adding new layers, changing state management approaches, or introducing external dependencies require written justification explaining why the current architecture is insufficient and documenting the expected benefits. Complexity in implementation MUST be justified with clear reasoning. Amendments to this constitution require documentation of the change rationale, approval from project maintainers, and a migration plan for existing code if principles change significantly. Use `.github/copilot-instructions.md` for runtime development guidance that complements these constitutional principles. The project is actively developing features including brewing troubleshooting assistance, method library expansion, and session analytics, all of which MUST maintain architectural consistency with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-11-13 | **Last Amended**: 2025-11-13
