# Implementation Plan: Coffee Brewing Calculator

**Branch**: `001-coffee-calculator` | **Date**: November 13, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-coffee-calculator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a coffee brewing calculator that accepts coffee amount input (in grams) and a selectable coffee-to-water ratio from a dropdown menu (1:12 to 1:20). The calculator displays the calculated total water amount in real-time as users adjust inputs. The implementation will **enhance** the existing `CoffeeCalculator` component in `src/components/CoffeeCalculator.tsx` to meet the new specification requirements, particularly:

- Enforcing the dropdown menu for ratio selection (already implemented)
- Adding input validation to prevent negative values
- Ensuring all ratios from 1:12 to 1:20 are available
- Setting default ratio to 1:16 (already implemented as 16)

## Technical Context

**Language/Version**: TypeScript 5.9.3 with React 19.1.1  
**Primary Dependencies**: React, Vite 7.1.12 (build tool), Tailwind CSS 3.4.18  
**Storage**: LocalStorage via repository pattern (not needed for calculator state - ephemeral)  
**Testing**: Not yet configured (existing project lacks test setup)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), Progressive Web App  
**Project Type**: Web application (single-page React app)  
**Performance Goals**: Real-time calculation updates (<100ms response to input changes)  
**Constraints**: Mobile-first responsive design, offline-capable PWA, no external API dependencies  
**Scale/Scope**: Single-user web application, ~10-20 components, small feature enhancement

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with principles from `.specify/memory/constitution.md`:

### Pre-Phase 0 Check ✅

- [x] **DRY Principle**: No code duplication; existing CoffeeCalculator component will be enhanced, calculation logic already in BrewingService
- [x] **Layered Architecture**: Calculator uses BrewingService from core layer which has no React dependencies; clean separation maintained
- [x] **TypeScript-First**: All code uses TypeScript strict mode; existing CoffeeCalculator already fully typed
- [x] **Mobile-First**: CoffeeCalculator already uses responsive grid (grid-cols-1 md:grid-cols-2); enhancement maintains this
- [x] **Component Simplicity**: Calculator is inline form (not modal); single responsibility (calculation only); will remain simple
- [x] **Data Persistence**: Calculator state is ephemeral (not persisted); calculation results flow to brewing steps and sessions which ARE persisted via repository pattern

**Status**: ✅ All gates pass. This is a minor enhancement to existing component following established patterns.

### Post-Phase 1 Re-check ✅

- [x] **DRY Principle**: Validation logic will be added to existing handleCoffeeAmountChange; no duplication
- [x] **Layered Architecture**: No changes to layer boundaries; pure UI enhancement
- [x] **TypeScript-First**: All changes maintain strict typing; no any types introduced
- [x] **Mobile-First**: No UI layout changes; maintains responsive design
- [x] **Component Simplicity**: Adds simple validation filter; maintains single responsibility
- [x] **Data Persistence**: No persistence changes; remains ephemeral state

**Status**: ✅ Design maintains constitutional compliance. Ready for implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-coffee-calculator/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── CoffeeCalculator.tsx        # PRIMARY: Component to be enhanced
├── core/
│   ├── services/
│   │   ├── BrewingService.ts       # REFERENCE: Contains calculateTotalWater()
│   │   └── index.ts                # REFERENCE: Service exports
│   └── index.ts
├── shared/
│   └── components/
│       └── ui/
│           ├── Input.tsx            # USED: Text input component
│           ├── Select.tsx           # USED: Dropdown component
│           └── Card.tsx             # USED: Container component
├── types/
│   └── coffee.ts                    # REFERENCE: CoffeeSettings interface
└── app/
    ├── AppContext.tsx               # REFERENCE: Uses CoffeeCalculator
    └── pages/
        └── DashboardPage.tsx        # REFERENCE: Renders CoffeeCalculator

tests/
└── (No test infrastructure exists yet)
```

**Structure Decision**: Web application using React component architecture. This feature enhances a single existing component (`CoffeeCalculator.tsx`) that uses shared UI components and calls business logic from the core services layer. No new files needed - only modifications to existing component to add validation logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. This feature follows existing architectural patterns and adds minimal complexity.

---

## Implementation Phases

### Phase 0: Research ✅ COMPLETE

**Output**: `research.md`

**Key Findings**:

- HTML5 `min` attribute + onChange validation for negative prevention
- Complete ratio range 12-20 already implemented
- Default ratio needs update from 15 to 16
- Real-time updates already working correctly
- No new dependencies required

### Phase 1: Design & Contracts ✅ COMPLETE

**Outputs**:

- `data-model.md` - CoffeeSettings entity documentation
- `quickstart.md` - Developer guide for modifying calculator
- Updated `.github/copilot-instructions.md` with tech stack

**Key Decisions**:

- Enhance existing CoffeeCalculator component (no new files)
- Add validation filter in handleCoffeeAmountChange
- Update AppContext default from 15 to 16
- Verify ratio dropdown completeness
- No API contracts needed (UI-only feature)

**No Contracts Directory**: This is a UI-only enhancement with no API endpoints, so the contracts/ directory is not applicable.

### Phase 2: Task Breakdown

**Status**: Pending `/speckit.tasks` command

This phase will break down implementation into specific tasks for:

1. Adding negative value validation
2. Updating default ratio
3. Verifying ratio range
4. Testing acceptance scenarios

---

## Ready for Implementation

**Branch**: `001-coffee-calculator`  
**Next Command**: `/speckit.tasks`

All planning artifacts complete. Implementation can proceed with:

1. Small, focused changes to existing component
2. Clear validation patterns documented
3. Constitution compliance verified
4. Developer guide available
