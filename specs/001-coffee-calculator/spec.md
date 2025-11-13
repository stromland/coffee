# Feature Specification: Coffee Brewing Calculator

**Feature Branch**: `001-coffee-calculator`  
**Created**: November 13, 2025  
**Status**: Implemented  
**Input**: User description: "I need a coffee brewing calculator that helps users determine the correct water amount based on their coffee weight and desired brewing ratio. Users should be able to input the amount of coffee they want to use (in grams) and adjust the coffee-to-water ratio (e.g., 1:15, 1:16, 1:17). The calculator should instantly display the total water amount needed. The calculations should update in real-time as users change either the coffee amount or the ratio. This is essential for consistent brewing results."

## Clarifications

### Session 2025-11-13

- Q: Input control type for ratio adjustment? → A: Dropdown menu with preset ratio options only
- Q: Preset ratio options? → A: See FR-012 for complete range
- Q: Default ratio value? → A: 1:16
- Q: Negative number handling? → A: Prevent entry of negative values in the input field
- Q: Maximum coffee amount limit? → A: No maximum limit (accept any positive number)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Calculate Water Amount from Coffee Weight (Priority: P1)

A home coffee brewer wants to determine how much water to use for their morning pour-over. They know they want to use 20 grams of coffee and prefer a 1:16 ratio for a balanced cup. They enter these values and immediately see they need 320 grams of water.

**Why this priority**: This is the core functionality of the calculator and delivers immediate value. Without this, the feature has no purpose.

**Independent Test**: Can be fully tested by entering a coffee amount and viewing the calculated water amount. Delivers value by providing accurate brewing measurements.

**Acceptance Scenarios**:

1. **Given** the calculator is displayed with default ratio 1:16, **When** a user enters 20 grams of coffee, **Then** the calculator displays 320 grams of total water
2. **Given** the calculator is displayed, **When** a user enters 15 grams of coffee with a ratio of 1:15, **Then** the calculator displays 225 grams of total water
3. **Given** the calculator shows a calculation, **When** the user changes the coffee amount from 20g to 25g, **Then** the total water updates immediately to reflect the new amount (400g at 1:16 ratio)
4. **Given** the calculator is displayed, **When** a user enters 0 grams of coffee, **Then** the calculator displays 0 grams of water

---

### Edge Cases

- What happens when a user enters a very large coffee amount (e.g., 1000g)? System calculates correctly for any positive number without imposing a maximum limit.
- What happens when a user enters decimal values (e.g., 18.5g coffee)? System should handle decimal precision appropriately.
- What happens when a user enters negative numbers? System prevents entry of negative values by filtering input to minimum of 0.
- What happens when a user enters non-numeric values? System treats invalid/empty input as 0 grams and updates calculation accordingly.
- What happens when the ratio is set to very high values (e.g., 1:25)? System should calculate correctly within reasonable brewing ratios.
- What happens when the ratio is set to very low values (e.g., 1:10)? System should calculate correctly or warn about unusual ratios.
- What happens when calculations result in very precise decimals (e.g., 326.66666g)? System should round appropriately for practical use.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST accept coffee amount input in grams as a text value and parse it to numeric value
- **FR-002**: System MUST provide a dropdown menu for selecting coffee-to-water ratio from preset options ranging from 1:12 to 1:20
- **FR-002a**: System MUST default to 1:16 ratio when the calculator first loads
- **FR-003**: System MUST calculate total water amount using the formula: water = coffee × ratio multiplier
- **FR-004**: System MUST display the calculated total water amount in grams
- **FR-005**: System MUST update calculations in real-time as user changes coffee amount or ratio without requiring a "calculate" button
- **FR-006**: (Consolidated into FR-005)
- **FR-007**: System MUST display calculated water amount rounded to whole grams for practical measurement
- **FR-008**: System MUST handle zero coffee amount by displaying zero water amount
- **FR-009**: System MUST handle decimal values for coffee amount (e.g., 18.5g)
- **FR-010**: System MUST prevent entry of negative values for coffee amount in the input field
- **FR-011**: System MUST accept any positive number for coffee amount without imposing a maximum limit
- **FR-012**: System MUST include all ratio values from 1:12 to 1:20 in the dropdown menu
- **FR-013**: System MUST provide clear labels indicating units of measurement (grams for both coffee and water)
- **FR-014**: (Consolidated into FR-005 - real-time updates)
- **FR-015**: System MUST display the ratio in readable format (e.g., "1:16" rather than just "16")

### Key Entities _(include if feature involves data)_

- **Coffee Settings**: Represents the calculation parameters including coffee amount (numeric, in grams), water ratio (numeric multiplier from 1:X format), and calculated total water (numeric, in grams)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can input a coffee amount and see the calculated water amount
- **SC-002**: Calculations are mathematically accurate to within 0.1 grams for all valid inputs
- **SC-003**: Users can change values and see updated results without any explicit "calculate" action
- **SC-004**: The calculator works correctly for ratio values from 1:10 to 1:20 (common brewing range)
- **SC-005**: Invalid inputs are handled gracefully without application errors or crashes
