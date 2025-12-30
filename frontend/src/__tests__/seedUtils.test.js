const { getVarietyLength, getSeedRatePerHa, areaToHectares, computeSeedTotals } = require('../utils/seedUtils');

describe('seedUtils', () => {
  test('getVarietyLength', () => {
    expect(getVarietyLength({ type: 'Long Duration' })).toBe('long');
    expect(getVarietyLength({ type: 'Short Duration' })).toBe('short');
    expect(getVarietyLength({ type: 'Medium Duration' })).toBe('short');
    expect(getVarietyLength(null)).toBe('short');
  });

  test('getSeedRatePerHa', () => {
    expect(getSeedRatePerHa('direct_seeding', 'long')).toEqual({ min: 100, max: 100 });
    expect(getSeedRatePerHa('direct_seeding', 'short')).toEqual({ min: 75, max: 80 });
    expect(getSeedRatePerHa('parachute_seeding', 'long')).toEqual({ min: 37.5, max: 37.5 });
    expect(getSeedRatePerHa('parachute_seeding', 'short')).toEqual({ min: 32.5, max: 32.5 });
    expect(getSeedRatePerHa('transplanting', 'short')).toEqual({ min: null, max: null });
  });

  test('areaToHectares conversions', () => {
    expect(areaToHectares(1, 'hectares')).toBeCloseTo(1);
    expect(areaToHectares(1, 'acres')).toBeCloseTo(0.404685642);
    expect(areaToHectares(10000, 'sq meters')).toBeCloseTo(1);
    expect(areaToHectares(107639, 'sq feet')).toBeCloseTo(1, 2);
  });

  test('computeSeedTotals', () => {
    const res1 = computeSeedTotals({ area: 1, unit: 'hectares', plantingMethod: 'direct_seeding', variety: { type: 'Long Duration' } });
    expect(res1.perHaLabel).toBe('100 kg/ha');
    expect(res1.minTotalKg).toBeCloseTo(100);

    const res2 = computeSeedTotals({ area: 0.5, unit: 'hectares', plantingMethod: 'direct_seeding', variety: { type: 'Short Duration' } });
    expect(res2.perHaLabel).toBe('75-80 kg/ha');
    expect(res2.minTotalKg).toBeCloseTo(37.5);
    expect(res2.maxTotalKg).toBeCloseTo(40);

    const res3 = computeSeedTotals({ area: 1, unit: 'acres', plantingMethod: 'parachute_seeding', variety: { type: 'Short Duration' } });
    // 1 acre -> ~0.404686 ha * 32.5 = ~13.16
    expect(res3.minTotalKg).toBeCloseTo(0.404685642 * 32.5, 5);
  });
});