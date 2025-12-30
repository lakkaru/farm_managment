const getVarietyLength = (variety) => {
  // If variety is not provided, default to 'short' (conservative seed rates)
  if (!variety) return 'short';

  // // First try explicit type/description fields (e.g. 'Long Duration')
  // const typeDesc = (variety.type || '').toLowerCase();
  // if (typeDesc.includes('long')) return 'long';
  // if (typeDesc.includes('short')) return 'short';
  // if (typeDesc.includes('intermediate') || typeDesc.includes('medium')) return 'short';

  // Otherwise, fall back to grain shape descriptors
  const grainShape = (variety.characteristics?.grainQuality?.grainShape || '').toLowerCase();
  if (grainShape.includes('long')) return 'long';
  if (grainShape.includes('short')) return 'short';
  if (grainShape.includes('intermediate') || grainShape.includes('medium')) return 'long';

  // Fallback
  return 'short';
};

const getSeedRatePerHa = (plantingMethod, varietyLength) => {
  if (!plantingMethod) return { min: null, max: null };
  if (plantingMethod === "direct_seeding") {
    if (varietyLength === "long") return { min: 100, max: 100 };
    return { min: 75, max: 80 };
  }
  if (plantingMethod === "parachute_seeding") {
    if (varietyLength === "long") return { min: 37.5, max: 37.5 };
    return { min: 32.5, max: 32.5 };
  }
  return { min: null, max: null };
};

const areaToHectares = (area, unit) => {
  const a = Number(area);
  if (isNaN(a) || a <= 0) return 0;
  switch ((unit || "").toLowerCase()) {
    case "hectares":
      return a;
    case "acres":
      return a * 0.404685642;
    case "sq meters":
      return a * 0.0001;
    case "sq feet":
      return a * 0.000009290304;
    default:
      return a;
  }
};

const computeSeedTotals = ({ area, unit, plantingMethod, variety }) => {
  const varietyLength =
    typeof variety === "object"
      ? getVarietyLength(variety)
      : variety || "short";
  const rate = getSeedRatePerHa(plantingMethod, varietyLength);
  if (!rate.min && rate.min !== 0)
    return {
      perHaLabel: "",
      minTotalKg: null,
      maxTotalKg: null,
      computed: false,
    };
  const areaHa = areaToHectares(area, unit);
  const minTotal = areaHa * rate.min;
  const maxTotal = areaHa * rate.max;
  const perHaLabel =
    rate.min === rate.max
      ? `${rate.min} kg/ha`
      : `${rate.min}-${rate.max} kg/ha`;

  const result = {
    perHaLabel,
    minTotalKg: minTotal || 0,
    maxTotalKg: maxTotal || 0,
    computed: true,
  };

  // For parachute seeding, provide an approximate tray count (≈1000 trays per hectare)
  if (plantingMethod === 'parachute_seeding') {
    const traysPerHa = 1000;
    const trayCount = Math.round(areaHa * traysPerHa);
    result.trayCount = trayCount;
    result.traysPerHa = traysPerHa;
  }

  return result;
};

module.exports = {
  getVarietyLength,
  getSeedRatePerHa,
  areaToHectares,
  computeSeedTotals,
};
