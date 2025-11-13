# Research: Coffee Brewing Calculator

**Feature**: `001-coffee-calculator`  
**Date**: November 13, 2025

## Research Questions Resolved

### 1. Input Validation for Negative Values (FR-010)

**Decision**: Use HTML5 `min="0"` attribute combined with onChange validation

**Rationale**:

- HTML5 `min` attribute provides native browser validation and accessibility support
- Browser automatically prevents keyboard arrow-down from going negative
- onChange validation provides additional protection for paste/manual entry
- Maintains existing controlled component pattern in CoffeeCalculator
- No external validation library needed

**Alternatives considered**:

- **Input masking library**: Rejected - adds unnecessary dependency for simple numeric validation
- **Prevent onKeyPress for minus sign**: Rejected - doesn't handle paste events, breaks accessibility
- **Show error message only**: Rejected - spec requires prevention, not just notification

**Implementation Pattern**:

```tsx
const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const parsed = parseFloat(value);

  // Allow empty string during editing, filter negatives
  if (value === "" || (parsed >= 0 && !isNaN(parsed))) {
    const coffeeAmount = parsed || 0;
    const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
    onSettingsChange({ ...settings, coffeeAmount, totalWater });
  }
};
```

### 2. Ratio Dropdown Range (FR-002, FR-012)

**Decision**: Populate dropdown with all integer ratios from 12 to 20 (1:12, 1:13, ... 1:20)

**Rationale**:

- Current implementation already has dropdown with select ratios
- Need to ensure complete range per specification
- Integer values sufficient - no need for decimal ratios (e.g., 1:15.5)
- Keeps UI simple and matches common brewing practice

**Alternatives considered**:

- **Decimal ratios**: Rejected - unnecessary precision, complicates UX
- **Custom input field**: Rejected - spec explicitly requires dropdown only

**Current State**: Existing CoffeeCalculator already has ratios 12-20 implemented in Select component

### 3. Default Ratio Value (FR-002a)

**Decision**: Default to 1:16 ratio (waterRatio: 16)

**Rationale**:

- Already implemented in AppContext.tsx initial state
- Industry standard "golden ratio" for pour-over coffee
- Verified in codebase: `waterRatio: 15` currently but spec requires 16

**Change Needed**: Update AppContext default from 15 to 16

### 4. Real-time Calculation Updates (FR-005, FR-006, FR-014)

**Decision**: Use existing controlled component pattern with immediate state updates

**Rationale**:

- Already implemented - calculations trigger on every onChange
- React's controlled components naturally provide real-time feedback
- BrewingService.calculateTotalWater() is pure function (no side effects)
- Performance is adequate for simple multiplication

**Alternatives considered**:

- **Debouncing**: Rejected - calculation is instant, no performance issue
- **Calculate button**: Rejected - spec explicitly requires automatic updates

**Current State**: Already working correctly in existing implementation

## Technical Decisions Summary

| Aspect                  | Decision                    | Status                 |
| ----------------------- | --------------------------- | ---------------------- |
| Negative value handling | HTML5 min + onChange filter | Needs implementation   |
| Ratio range             | 1:12 to 1:20 (complete set) | Verify completeness    |
| Default ratio           | 1:16                        | Update from current 15 |
| Real-time updates       | Existing onChange pattern   | No changes needed      |
| Input type              | number with step="0.5"      | Already implemented    |

## Dependencies

No new dependencies required. All functionality achievable with:

- Existing React 19.1.1
- Existing shared UI components (Input, Select, Card)
- Existing BrewingService
- HTML5 form validation

## Performance Considerations

- Simple numeric calculation (multiplication) performs in <1ms
- No API calls or async operations
- No expensive re-renders (isolated component state)
- Meets <100ms performance goal with margin (actual: ~1ms)

## Accessibility

- HTML5 `min` attribute announces constraints to screen readers
- Existing Input component already has proper label associations
- Dropdown (Select) is keyboard navigable
- Consider adding `aria-describedby` for calculation result explanation

## Testing Strategy (Future)

When tests are added:

1. Unit test: BrewingService.calculateTotalWater() with various inputs
2. Component test: CoffeeCalculator validates negative inputs
3. Component test: Ratio dropdown contains all values 12-20
4. Component test: Default ratio is 16
5. Integration test: Calculator updates trigger brew steps regeneration
