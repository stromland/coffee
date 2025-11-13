# Quickstart Guide: Coffee Brewing Calculator

**Feature**: `001-coffee-calculator`  
**Date**: November 13, 2025

## Overview

This guide helps developers understand and modify the Coffee Brewing Calculator component. The calculator is a simple React component that accepts coffee amount input and ratio selection, then displays calculated water amount in real-time.

## Component Location

**Primary File**: `src/components/CoffeeCalculator.tsx`

**Related Files**:

- `src/app/AppContext.tsx` - State management
- `src/core/services/BrewingService.ts` - Calculation logic
- `src/types/coffee.ts` - TypeScript interfaces
- `src/shared/components/ui/` - Reusable UI components

## Quick Start

### 1. View the Calculator

Start the dev server:

```bash
npm run dev
```

Navigate to: `http://localhost:5173/coffee`

The calculator appears at the top of the dashboard.

### 2. Component Structure

```tsx
<CoffeeCalculator
  settings={settings} // Current calculator state
  onSettingsChange={handleUpdate} // Callback for state updates
/>
```

**Props Interface**:

```typescript
interface CoffeeCalculatorProps {
  settings: CoffeeSettings;
  onSettingsChange: (settings: CoffeeSettings) => void;
}
```

**CoffeeSettings Interface**:

```typescript
interface CoffeeSettings {
  coffeeAmount: number; // Grams of coffee (input)
  waterRatio: number; // Multiplier from 1:X format (input)
  totalWater: number; // Calculated result (output)
}
```

### 3. How It Works

**User Flow**:

1. User enters coffee amount (e.g., 20g)
2. User selects ratio from dropdown (e.g., 1:16)
3. Calculator displays total water (320g)
4. Changes propagate to brewing steps automatically

**Data Flow**:

```
User Input → handleChange → calculateTotalWater → setState → Re-render
```

### 4. Key Functions

**Handle Coffee Amount Change**:

```tsx
const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const coffeeAmount = parseFloat(e.target.value) || 0;
  const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
  onSettingsChange({ ...settings, coffeeAmount, totalWater });
};
```

**Handle Ratio Change**:

```tsx
const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const waterRatio = parseFloat(e.target.value);
  const totalWater = brewingService.calculateTotalWater(settings.coffeeAmount, waterRatio);
  onSettingsChange({ ...settings, waterRatio, totalWater });
};
```

## Making Changes

### Add Input Validation (FR-010)

**Goal**: Prevent negative coffee amounts

**Location**: `src/components/CoffeeCalculator.tsx`

**Change**:

```tsx
const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const parsed = parseFloat(value);

  // Only allow non-negative numbers or empty string
  if (value === "" || (parsed >= 0 && !isNaN(parsed))) {
    const coffeeAmount = parsed || 0;
    const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
    onSettingsChange({ ...settings, coffeeAmount, totalWater });
  }
  // Negative values are ignored (not stored in state)
};
```

**HTML Attribute** (already present):

```tsx
<Input
  type="number"
  min="0" // Browser-level validation
  step="0.5"
  // ...
/>
```

### Verify Ratio Range (FR-012)

**Goal**: Ensure all ratios from 1:12 to 1:20 are available

**Location**: `src/components/CoffeeCalculator.tsx`

**Current Implementation** (line 40-48):

```tsx
<Select
  id="water-ratio"
  value={settings.waterRatio}
  onChange={handleRatioChange}
  label="Water Ratio (1:X)"
  options={[
    { value: 12, label: "1:12 (Strong)" },
    { value: 13, label: "1:13" },
    { value: 14, label: "1:14" },
    { value: 15, label: "1:15 (Balanced)" },
    { value: 16, label: "1:16" },
    { value: 17, label: "1:17 (Light)" },
    { value: 18, label: "1:18" },
    { value: 19, label: "1:19" },
    { value: 20, label: "1:20 (Very Light)" },
  ]}
  fullWidth
/>
```

**Status**: ✅ Already complete (contains all values 12-20)

### Update Default Ratio (FR-002a)

**Goal**: Set default ratio to 1:16 instead of 1:15

**Location**: `src/app/AppContext.tsx`

**Current Code** (line 26):

```tsx
const [settings, setSettings] = useState<CoffeeSettings>({
  coffeeAmount: 20,
  waterRatio: 15, // ← Change to 16
  totalWater: 300, // ← Will become 320
});
```

**Required Change**:

```tsx
const [settings, setSettings] = useState<CoffeeSettings>({
  coffeeAmount: 20,
  waterRatio: 16, // Updated default
  totalWater: 320, // 20 * 16
});
```

## Testing Changes

### Manual Testing Checklist

1. **Positive values**: Enter 20 → should show 320g (at 1:16 ratio)
2. **Zero value**: Enter 0 → should show 0g
3. **Decimal values**: Enter 18.5 → should show 296g (at 1:16 ratio)
4. **Negative attempt**: Try to enter -5 → should be prevented/rejected
5. **Ratio change**: Change from 1:16 to 1:17 → should update to 340g (at 20g coffee)
6. **Empty field**: Clear input → should treat as 0
7. **Large values**: Enter 1000 → should calculate correctly (16000g at 1:16)

### Browser DevTools

Check React DevTools:

```
AppProvider
  └─ settings
      ├─ coffeeAmount: 20
      ├─ waterRatio: 16
      └─ totalWater: 320
```

## Common Issues

### Issue: Negative values accepted

**Solution**: Add validation in handleCoffeeAmountChange (see "Add Input Validation" above)

### Issue: Default ratio is 1:15 instead of 1:16

**Solution**: Update AppContext initial state (see "Update Default Ratio" above)

### Issue: Calculator not updating in real-time

**Check**:

- onChange handlers are attached
- onSettingsChange callback is called
- AppContext is re-rendering

### Issue: Decimal precision issues

**Solution**: Round display values:

```tsx
{
  settings.totalWater.toFixed(0);
}
g; // Already implemented
```

## Architecture Notes

### Why No Direct State in Calculator?

The calculator is a **controlled component** - it doesn't manage its own state. This ensures:

- Single source of truth (AppContext)
- Other components can access settings
- Changes propagate to brew steps
- Consistent state across app

### Why BrewingService?

Calculation logic lives in the service layer (not component) because:

- **Testability**: Pure functions easy to unit test
- **Reusability**: Other features use calculateTotalWater()
- **Separation**: Business logic separate from UI
- **Constitution**: Core layer has no React dependencies

### Component Hierarchy

```
AppContext (state)
  └─ DashboardPage (coordinator)
      └─ CoffeeCalculator (UI)
          ├─ Input (shared/ui)
          ├─ Select (shared/ui)
          └─ Card (shared/ui)
```

## Next Steps

1. **Implement validation**: Add negative value prevention
2. **Update default**: Change default ratio to 16
3. **Manual test**: Verify all acceptance scenarios
4. **Code review**: Ensure TypeScript types are correct
5. **Document**: Update inline comments if needed

## Resources

- **Spec**: `specs/001-coffee-calculator/spec.md`
- **Research**: `specs/001-coffee-calculator/research.md`
- **Data Model**: `specs/001-coffee-calculator/data-model.md`
- **Constitution**: `.specify/memory/constitution.md`

## Questions?

Check existing implementation in `src/components/CoffeeCalculator.tsx` - it's well-structured and serves as a good reference for React patterns in this codebase.
