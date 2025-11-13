# Data Model: Coffee Brewing Calculator

**Feature**: `001-coffee-calculator`  
**Date**: November 13, 2025

## Overview

The Coffee Brewing Calculator feature uses a simple data model for ephemeral calculation state. No persistence is required for calculator inputs - they flow through to other features (brewing steps, session history) which handle their own persistence.

## Entities

### CoffeeSettings

Represents the calculation parameters and result for brewing calculations.

**Location**: `src/types/coffee.ts` (existing interface)

**Attributes**:

- `coffeeAmount`: `number` - Amount of coffee in grams (input)
  - Must be >= 0 (non-negative)
  - Supports decimal values (e.g., 18.5)
  - No maximum limit per specification
  - Default: 20
- `waterRatio`: `number` - Water multiplier from 1:X format (input)
  - Range: 12-20 (integers only)
  - Represents the "X" in "1:X" ratio
  - Default: 16
- `totalWater`: `number` - Calculated total water in grams (output)
  - Derived: `coffeeAmount × waterRatio`
  - Rounded to 1 decimal place for display
  - Always >= 0

**Validation Rules**:

- `coffeeAmount`: Must not be negative (FR-010)
- `coffeeAmount`: Must be numeric (parseFloat result, NaN handled as 0)
- `waterRatio`: Must be one of [12, 13, 14, 15, 16, 17, 18, 19, 20] (FR-012)
- `totalWater`: Read-only, always recalculated when inputs change

**Lifecycle**:

1. **Creation**: Initialized in AppContext with defaults
2. **Update**: Modified via AppContext.handleSettingsChange()
3. **Usage**: Passed to CoffeeCalculator component for display/editing
4. **Propagation**: Changes trigger BrewingService to regenerate brew steps
5. **Persistence**: Not persisted directly; values saved in BrewingSession when user saves a brewing session

**Relationships**:

- Used by: CoffeeCalculator (UI), DashboardPage (coordinator)
- Consumed by: BrewingService.calculateTotalWater() and BrewMethodService.generateSteps()
- Indirectly persisted in: BrewingSession (when session saved to history)

## State Management

### Component State Flow

```
User Input (CoffeeCalculator)
    ↓
handleSettingsChange (DashboardPage)
    ↓
setSettings (AppContext)
    ↓
updateBrewSteps (AppContext)
    ↓
BrewingService.generateBrewSteps()
    ↓
UI Re-render (BrewingSteps, BrewMode, etc.)
```

### Context Storage

**Location**: `src/app/AppContext.tsx`

**State Hook**:

```tsx
const [settings, setSettings] = useState<CoffeeSettings>({
  coffeeAmount: 20,
  waterRatio: 16, // Note: Currently 15, needs update to 16
  totalWater: 320, // 20 * 16
});
```

**Update Handler**:

```tsx
const handleSettingsChange = (newSettings: CoffeeSettings) => {
  setSettings(newSettings);
  updateBrewSteps(selectedMethodId, newSettings.totalWater);
};
```

## Validation Schema

### Input Constraints

| Field        | Type     | Min | Max      | Step | Required | Default |
| ------------ | -------- | --- | -------- | ---- | -------- | ------- |
| coffeeAmount | number   | 0   | none     | 0.5  | yes      | 20      |
| waterRatio   | enum     | 12  | 20       | 1    | yes      | 16      |
| totalWater   | computed | 0   | computed | 0.1  | n/a      | 320     |

### Validation Logic

**Coffee Amount** (handled in CoffeeCalculator.handleCoffeeAmountChange):

```tsx
const value = e.target.value;
const parsed = parseFloat(value);

// Only allow non-negative numbers or empty string (for editing)
if (value === "" || (parsed >= 0 && !isNaN(parsed))) {
  // Accept input
} else {
  // Reject input (don't update state)
}
```

**Water Ratio** (handled by Select component):

- Dropdown restricts to valid options only
- No manual entry possible
- Pre-populated with integers 12-20

**Total Water** (calculated, not validated):

```tsx
const totalWater = brewingService.calculateTotalWater(coffeeAmount, waterRatio);
```

## Edge Cases Handling

| Scenario              | Behavior     | Implementation                        |
| --------------------- | ------------ | ------------------------------------- |
| Coffee = 0            | Water = 0    | Natural result of multiplication      |
| Coffee = empty string | Treated as 0 | `parseFloat("") \|\| 0`               |
| Coffee = negative     | Rejected     | onChange filter prevents state update |
| Coffee = decimal      | Accepted     | parseFloat handles naturally          |
| Coffee = very large   | Accepted     | No maximum limit per spec             |
| Ratio = invalid       | Impossible   | Dropdown only allows valid options    |
| Paste negative value  | Rejected     | onChange validation catches           |

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AppContext                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ settings: CoffeeSettings                             │   │
│  │  - coffeeAmount: 20                                  │   │
│  │  - waterRatio: 16                                    │   │
│  │  - totalWater: 320                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ props
┌─────────────────────────────────────────────────────────────┐
│                   CoffeeCalculator                           │
│  ┌──────────────────┐  ┌────────────────────────┐          │
│  │  Input           │  │  Select                │          │
│  │  coffeeAmount    │  │  waterRatio            │          │
│  │  [20]______      │  │  [1:16 ▼]              │          │
│  └──────────────────┘  └────────────────────────┘          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Display: Total Water: 320g                        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────┬────────────────────────────────────────────┘
                  │
                  ↓ onChange callback
┌─────────────────────────────────────────────────────────────┐
│               handleSettingsChange                           │
│  1. Update settings state                                    │
│  2. Call updateBrewSteps()                                   │
│  3. Trigger re-render                                        │
└─────────────────────────────────────────────────────────────┘
```

## Calculation Service

**Location**: `src/core/services/BrewingService.ts`

**Method**: `calculateTotalWater(coffeeAmount: number, ratio: number): number`

**Implementation**:

```typescript
calculateTotalWater(coffeeAmount: number, ratio: number): number {
  return coffeeAmount * ratio;
}
```

**Properties**:

- Pure function (no side effects)
- Deterministic (same inputs → same output)
- No validation (assumes valid inputs from UI layer)
- Performance: O(1), <1ms execution time

## No Persistence Required

Unlike other entities in the application (BrewMethod, Coffee, BrewingSession), CoffeeSettings is **ephemeral state** that:

1. Does not require repository pattern
2. Not stored in localStorage
3. Reset to defaults on page reload
4. Values propagate to BrewingSession when user explicitly saves a session

This design keeps calculator state simple and stateless, following the principle that only user-generated content (methods, sessions) needs persistence.
