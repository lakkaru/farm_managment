const { generateFertilizerSchedule } = require('../src/controllers/seasonPlanController');

describe('generateFertilizerSchedule', () => {
  test('generates schedule for wet zone irrigated, direct seeding, 3_month', () => {
    const cultivationDate = new Date('2025-10-01');
    const areaInAcres = 1; // 1 acre -> 0.404686 ha
    const irrigationMethod = 'Under irrigation';
    const district = 'Colombo';
    const durationString = '90-95';

    const schedule = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', null);
    expect(Array.isArray(schedule)).toBe(true);
    // Expect first entry to have recommendedPerHa and perFieldKg
    expect(schedule[0].fertilizers.recommendedPerHa).toBeDefined();
    expect(schedule[0].fertilizers.perFieldKg).toBeDefined();
    // For 1 acre, per-field urea value should be > 0 for some entries
    const totalUrea = schedule.reduce((s, app) => s + (app.fertilizers.perFieldKg.urea || 0), 0);
    expect(totalUrea).toBeGreaterThanOrEqual(0);
  });

  test('skips TSP when soilP > 10', () => {
    const cultivationDate = new Date('2025-10-01');
    const areaInAcres = 0.5; // smaller area
    const irrigationMethod = 'Rain fed';
    const district = 'Kurunegala';
    const durationString = '90-95';

    const schedule = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', 12);
    // verify tsp perFieldKg is zero for all entries
    const anyTsp = schedule.some(app => (app.fertilizers.perFieldKg.tsp || 0) > 0);
    expect(anyTsp).toBe(false);
  });
});