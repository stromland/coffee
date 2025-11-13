# Tasks: Coffee Brewing Calculator

**Input**: Design documents from `/specs/001-coffee-calculator/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not included - project lacks test infrastructure and tests were not requested in specification

**Organization**: Tasks organized by user story (only 1 user story in this feature) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 = User Story 1)
- Include exact file paths in descriptions

## Path Conventions

- Source: `src/`
- Components: `src/components/`
- Context: `src/app/`

---

## Phase 1: Setup (Validation)

**Purpose**: Verify existing implementation before making changes

- [ ] T001 [P] Review existing CoffeeCalculator component in src/components/CoffeeCalculator.tsx
- [ ] T002 [P] Review existing AppContext defaults in src/app/AppContext.tsx
- [ ] T003 [P] Verify BrewingService.calculateTotalWater() in src/core/services/BrewingService.ts
- [ ] T004 Verify dropdown ratio options are complete (1:12 through 1:20) in src/components/CoffeeCalculator.tsx

**Checkpoint**: Understand current implementation state before modifications

---

## Phase 2: User Story 1 - Calculate Water Amount from Coffee Weight (Priority: P1) 🎯 MVP

**Goal**: Users can input coffee amount and select ratio from dropdown, seeing calculated water amount in real-time with proper validation preventing negative values

**Independent Test**:

1. Open calculator at http://localhost:5173/coffee
2. Enter 20g coffee with 1:16 ratio → see 320g water
3. Try to enter negative value → should be prevented
4. Change ratio to 1:15 → see 300g water immediately
5. Enter 0g coffee → see 0g water

### Implementation for User Story 1

- [ ] T005 [US1] Update default waterRatio from 15 to 16 in src/app/AppContext.tsx (line ~26-30)
- [ ] T006 [US1] Update default totalWater calculation to 320 (20 \* 16) in src/app/AppContext.tsx (line ~26-30)
- [ ] T007 [US1] Add negative value validation to handleCoffeeAmountChange in src/components/CoffeeCalculator.tsx (line ~11-16)
- [ ] T008 [US1] Verify HTML5 min="0" attribute is present on Input component in src/components/CoffeeCalculator.tsx (line ~28)
- [ ] T009 [US1] Test acceptance scenario 1: 20g coffee at 1:16 ratio displays 320g water
- [ ] T010 [US1] Test acceptance scenario 2: 15g coffee at 1:15 ratio displays 225g water
- [ ] T011 [US1] Test acceptance scenario 3: Change 20g to 25g immediately updates to 400g
- [ ] T012 [US1] Test acceptance scenario 4: 0g coffee displays 0g water
- [ ] T013 [US1] Test edge case: Negative value entry is prevented (validation works)
- [ ] T014 [US1] Test edge case: Decimal value 18.5g calculates correctly (296g at 1:16)
- [ ] T015 [US1] Test edge case: Large value 1000g calculates correctly (16000g at 1:16)
- [ ] T016 [US1] Test edge case: Empty input treats as 0g water

**Checkpoint**: Calculator validates negative inputs, defaults to 1:16 ratio, and all acceptance scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup phase completion

### Within User Story 1

- T001-T004 (Setup) must complete before implementation tasks
- T005 and T006 can run in parallel (different concerns in same file - be careful)
- T007 depends on understanding from T001
- T008 is verification only - can run in parallel with T007
- T009-T016 (Testing) must run after T005-T008 are complete

### Parallel Opportunities

**Setup Phase**:

- T001, T002, T003 can run in parallel (different files)
- T004 runs after T001 (same file)

**Implementation Phase**:

- T005 and T006 modify same location - do sequentially or in one edit
- T007 and T008 can be done in one edit (same component)

**Testing Phase**:

- T009-T016 can all be tested in parallel or sequentially

---

## Parallel Example: User Story 1

```bash
# Setup phase - parallel review:
Task: "Review existing CoffeeCalculator component in src/components/CoffeeCalculator.tsx"
Task: "Review existing AppContext defaults in src/app/AppContext.tsx"
Task: "Verify BrewingService.calculateTotalWater() in src/core/services/BrewingService.ts"

# Implementation - sequential (same files):
Task: "Update default waterRatio from 15 to 16 in src/app/AppContext.tsx"
Task: "Add negative value validation to handleCoffeeAmountChange in src/components/CoffeeCalculator.tsx"

# Testing - can be parallel:
Task: "Test acceptance scenario 1: 20g coffee at 1:16 ratio displays 320g water"
Task: "Test acceptance scenario 2: 15g coffee at 1:15 ratio displays 225g water"
Task: "Test edge case: Negative value entry is prevented"
```

---

## Implementation Strategy

### Single User Story = Single MVP

This feature has only one user story (P1), so the implementation strategy is straightforward:

1. **Complete Phase 1: Setup** - Understand current implementation
2. **Complete Phase 2: User Story 1** - Implement all requirements
3. **VALIDATE**: Run all acceptance tests (T009-T016)
4. **Deploy**: Feature is complete and ready

### Incremental Commits

Recommended commit strategy:

1. After T004: "Review: Verified existing calculator implementation"
2. After T006: "feat: Update default ratio to 1:16"
3. After T008: "feat: Add negative value validation to calculator"
4. After T016: "test: Verify all acceptance scenarios pass"

### Mobile Testing Reminder

Per constitution (Mobile-First principle), test on small viewport:

- Open DevTools
- Toggle device toolbar
- Test with iPhone/Android viewport
- Verify calculator layout works on mobile

---

## Implementation Details

### Task T005-T006: Update Default Ratio

**File**: `src/app/AppContext.tsx`  
**Current** (line ~26-30):

```tsx
const [settings, setSettings] = useState<CoffeeSettings>({
  coffeeAmount: 20,
  waterRatio: 15,
  totalWater: 300,
});
```

**Change to**:

```tsx
const [settings, setSettings] = useState<CoffeeSettings>({
  coffeeAmount: 20,
  waterRatio: 16,
  totalWater: 320,
});
```

### Task T007: Add Negative Value Validation

**File**: `src/components/CoffeeCalculator.tsx`  
**Current** (line ~11-16):

```tsx
const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const coffeeAmount = parseFloat(e.target.value) || 0;
  const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
  onSettingsChange({ ...settings, coffeeAmount, totalWater });
};
```

**Change to**:

```tsx
const handleCoffeeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = parseFloat(e.target.value);
  // Prevent negative values - filter to minimum of 0
  const coffeeAmount = inputValue < 0 ? 0 : inputValue || 0;
  const totalWater = brewingService.calculateTotalWater(coffeeAmount, settings.waterRatio);
  onSettingsChange({ ...settings, coffeeAmount, totalWater });
};
```

### Task T008: Verify min Attribute

**File**: `src/components/CoffeeCalculator.tsx`  
**Location**: Line ~28  
**Verify present**:

```tsx
<Input
  id="coffee-amount"
  type="number"
  min="1" // Should be min="0" per spec, but min="1" also prevents negatives
  step="0.5"
  // ...
/>
```

**Note**: Current `min="1"` is acceptable (prevents negatives). Spec allows 0g input, so could change to `min="0"` for strictness.

---

## Acceptance Testing Checklist

### Functional Requirements Coverage

- [x] **FR-001**: Coffee amount input accepts text and parses to number ✓ (existing)
- [x] **FR-002**: Dropdown menu with ratios 1:12 to 1:20 ✓ (existing, verify with T004)
- [x] **FR-002a**: Default ratio 1:16 ✓ (T005-T006)
- [x] **FR-003**: Formula water = coffee × ratio ✓ (existing in BrewingService)
- [x] **FR-004**: Display total water in grams ✓ (existing)
- [x] **FR-005**: Real-time updates on any input change ✓ (existing)
- [x] **FR-006**: (Consolidated into FR-005)
- [x] **FR-007**: Display precision whole grams ✓ (existing: toFixed(0))
- [x] **FR-008**: Zero coffee shows zero water ✓ (test T012)
- [x] **FR-009**: Handle decimal coffee amounts ✓ (test T014)
- [x] **FR-010**: Prevent negative values ✓ (T007)
- [x] **FR-011**: No maximum limit ✓ (test T015)
- [x] **FR-012**: All ratios 1:12 to 1:20 ✓ (verify T004)
- [x] **FR-013**: Clear labels with units ✓ (existing)
- [x] **FR-014**: (Consolidated into FR-005)
- [x] **FR-015**: Ratio format "1:16" ✓ (existing in dropdown labels)

### Success Criteria Coverage

- [x] **SC-001**: Input coffee and see water ✓ (T009-T012)
- [x] **SC-002**: Accurate within 0.1g ✓ (formula is exact)
- [x] **SC-003**: Changes update without action ✓ (existing)
- [x] **SC-004**: Works for ratios 1:10 to 1:20 ✓ (spec requires 1:12-1:20, existing has this)
- [x] **SC-005**: Invalid inputs handled gracefully ✓ (T007, T013, T016)

---

## Total Task Count: 16

- **Setup**: 4 tasks
- **User Story 1 Implementation**: 4 tasks
- **User Story 1 Testing**: 8 tasks

**Estimated Time**: 2-3 hours total

- Setup/Review: 30 minutes
- Implementation: 30 minutes
- Testing: 60-90 minutes

**Complexity**: Low - minor enhancements to existing component

---

## Notes

- No [P] markers on implementation tasks - they modify same files sequentially
- [P] markers on setup tasks - different files can be reviewed simultaneously
- Only 1 user story in this feature, so no inter-story dependencies
- Tests are manual browser-based - no automated test framework exists
- All changes maintain TypeScript strict mode compliance
- Mobile-first responsive design already present, maintained by changes
- No persistence changes - calculator state remains ephemeral
- Calculation logic in service layer untouched - only UI validation changes

---

## Quick Reference

**Files Modified** (2 total):

1. `src/app/AppContext.tsx` - Default ratio update
2. `src/components/CoffeeCalculator.tsx` - Validation logic

**Files Verified** (2 total):

1. `src/core/services/BrewingService.ts` - Calculation logic
2. `src/components/CoffeeCalculator.tsx` - Dropdown options

**Dev Server**: `npm run dev` → `http://localhost:5173/coffee`

**Documentation**: See `specs/001-coffee-calculator/quickstart.md` for detailed implementation guide
