# Irrigation Method Simplification - Migration Notes

## Changes Made

### Backend Changes:
1. **seasonPlanController.js**: Updated irrigation detection logic to use `irrigationMethod === 'Under irrigation'`
2. **SeasonPlan.js (Model)**: Updated enum values from multiple irrigation types to just `['Rain fed', 'Under irrigation']`
3. **seasonPlanRoutes.js**: Updated validation to accept only the two new irrigation methods

### Frontend Changes:
1. **PlanSeason.js**: Simplified irrigationMethods array to just 2 options
2. **paddy/plan-season.js**: Simplified irrigationMethods array to just 2 options  
3. **paddy/season-plans/create.js**: Updated MenuItem values to new irrigation methods
4. **paddy/season-plans/[id]/edit.js**: Updated MenuItem values to new irrigation methods

## New Irrigation Methods:
- **Rain fed** (replaces: "Rain-fed")
- **Under irrigation** (replaces: "Irrigated (Tank)", "Irrigated (River)", "Irrigated (Tube well)", "Irrigated (Canal)")

## Fertilizer Recommendation Logic:
- **Rain fed**: Uses 'rainfed' condition type in fertilizer calculations
- **Under irrigation**: Uses 'irrigated' condition type in fertilizer calculations

## Data Migration Considerations:
- Existing season plans with old irrigation method values will need to be updated
- Backend validation will reject old irrigation method values
- Consider running a migration script to update existing records

## Testing:
- Irrigation method logic verified to work correctly with new values
- Fertilizer calculations will properly select rainfed vs irrigated recommendations
- Frontend dropdowns now show only the two simplified options
