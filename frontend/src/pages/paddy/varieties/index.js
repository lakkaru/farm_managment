import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { navigate } from 'gatsby';
import BackButton from '../../../components/BackButton';
import Layout from '../../../components/Layout/Layout';
import AppProviders from '../../../providers/AppProviders';
import { useTranslation } from 'react-i18next';
import { paddyVarietyAPI } from '../../../services/api';
import { toast } from 'react-toastify';

const PaddyVarietiesContent = () => {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVarieties, setFilteredVarieties] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    loadPaddyVarieties();
  }, []);

  useEffect(() => {
    // Filter varieties based on search term
    const filtered = varieties.filter(variety =>
      variety.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVarieties(filtered);
  }, [varieties, searchTerm]);

  const loadPaddyVarieties = async () => {
    try {
      setLoading(true);
      const response = await paddyVarietyAPI.getPaddyVarieties();
      console.log('Varieties page - API response:', response.data);
      console.log('First variety in varieties page:', response.data.data?.[0]);
      console.log('First variety duration in varieties page:', response.data.data?.[0]?.duration);
      setVarieties(response.data.data || []);
    } catch (error) {
      console.error('Error loading paddy varieties:', error);
      toast.error('Failed to load paddy varieties');
      setVarieties([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Traditional': 'primary',
      'Improved': 'success',
      'Hybrid': 'warning',
      'Other': 'default',
    };
    return colors[type] || 'default';
  };

  // (formatDuration removed — formatMonthsShort + parseDays cover the UI needs)

  // Parse days as integer (average if range)
  const parseDays = (durationStr) => {
    if (!durationStr) return null;
    const match = durationStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
    if (!match) return null;
    return match[2] ? Math.round((parseInt(match[1]) + parseInt(match[2])) / 2) : parseInt(match[1]);
  };

  // Short months formatter for compact display on chips, e.g. "2 1/2 m"
  const formatMonthsShort = (durationStr) => {
    const days = parseDays(durationStr);
    if (!days) return '';
    const monthsFloat = days / 30.4;
    const halfMonths = Math.round(monthsFloat * 2) / 2;
    const whole = Math.floor(halfMonths);
    const fractional = (halfMonths % 1) !== 0;
    const monthsPart = fractional ? `${whole} 1/2` : `${whole}`;
    const lang = (typeof window !== 'undefined' && window?.localStorage?.i18nextLng) || undefined;
    // If running in SSR or no localStorage, fallback to t()
    const currentLang = lang || (typeof navigator !== 'undefined' && navigator.language) || 'en';

    // Sinhala specific: show 'මාස N'
    if (currentLang.startsWith('si')) {
      return `මාස ${monthsPart}`;
    }

    const monthsUnitShort = t('paddyVarieties.monthsUnit', { defaultValue: 'm' });
    return `${monthsPart} ${monthsUnitShort}`;
  };

  // Slugify a label to match translation keys (e.g. "Short Bold" -> "short_bold")
  const slugify = (s) => {
    if (!s) return '';
    return s.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  // Small helper to decide readable text color (black/white) against a background hex
  const readableTextColor = (hex) => {
    if (!hex) return '#000';
    // strip # if present
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0,2), 16);
    const g = parseInt(h.substring(2,4), 16);
    const b = parseInt(h.substring(4,6), 16);
    // Perceived luminance
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.6 ? '#000' : '#fff';
  };

  // Map a few known pericarp colours to hex values. Keep minimal as per seeded values.
  const grainColorToHex = (colorLabel) => {
    if (!colorLabel) return null;
    const k = slugify(colorLabel);
    const map = {
      'red': '#c62828',
      'white': '#ffffff',
      'brown': '#8d6e63',
      'black': '#212121',
      'yellow': '#f9a825'
    };
    return map[k] || null;
  };

  // Translate a list of values using a base i18n path and slugified keys
  // NOTE: translateList removed because translateListArray is used for chips and
  // joining strings wasn't required; keeping translateListArray only to avoid
  // unused-variable linter warnings.

  // Translate a list of values to an array of translated strings (used for Chips)
  const translateListArray = (arr, basePath) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr.map(v => t(`${basePath}.${slugify(v)}`, { defaultValue: v }));
  };

  // Format yield string by replacing common hectare-ton unit variants with localized unit
  const formatYield = (yieldStr) => {
    if (!yieldStr) return yieldStr;
    // Common patterns: 't/ha', 't / ha', 't per ha', 'tons/ha' etc.
    const localizedUnit = t('paddyVarieties.units.tonPerHectare', { defaultValue: 'ton/ha' });
    // Replace occurrences in a case-insensitive way, allow spaces around slash
    return yieldStr.replace(/t\s*\/\s*ha/ig, localizedUnit)
                   .replace(/tons?\s*\/\s*ha/ig, localizedUnit)
                   .replace(/t\s+per\s+ha/ig, localizedUnit);
  };

  // Clean description: hide placeholder descriptions and strip recommendation phrases.
  // Uses `t` and `i18n` from the surrounding scope when needed.
  const cleanDescription = (desc, recommendation) => {
    if (!desc) return '';
    let text = desc.trim();

    // Remove 'Popular Name: ...' prefix if present
    text = text.replace(/Popular Name:\s*[^.]+\.\s*/i, '').trim();

    // Remove any 'Recommendation is ...' or 'Recommendation: ...' fragments
    text = text.replace(/recommendation\s*(is|:)\s*[^.]*\.?/gi, '').trim();

    // If the whole text is a common placeholder, hide it
    if (/^no specific description provided( in source)?[.\s]*$/i.test(text)) return '';

    // If the description merely repeats the recommendation, hide it
    if (recommendation && text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '').includes(recommendation.toString().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ''))) {
      const cleanedNorm = text.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
      const recNorm = recommendation.toString().replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
      if (!cleanedNorm || cleanedNorm === recNorm) return '';
    }

    // Split into sentences and drop sentences that are placeholders or mention recommendations
    const sentences = text.split(/(?<=[.!?])\s+/);
    const filtered = sentences.filter(s => {
      if (!s) return false;
      if (/^n\/?a\.?$/i.test(s.trim())) return false;
      if (/no specific description provided/i.test(s)) return false;
      if (/recommendation\b/i.test(s)) return false;
      if (recommendation && s.toLowerCase().includes(recommendation.toString().toLowerCase())) return false;
      return true;
    });

  let cleaned = filtered.join(' ').trim();
    if (!cleaned) return '';

  // Final cleanup: trim punctuation and normalize spaces
  // Avoid unnecessary escape characters: dot and hyphen don't need escaping
  // inside a character class when positioned safely.
  // Remove common leading/trailing punctuation and normalize spaces.
  // Handle hyphens separately to avoid regex escaping warnings from ESLint.
  cleaned = cleaned.replace(/^[\s.,;:]+|[\s.,;:]+$/g, '')
                   .replace(/-/g, ' ')
                   .replace(/\s{2,}/g, ' ');

    // If current locale is Sinhala, attempt to translate using seeded-driven keys.
    try {
      const locale = (i18n && i18n.language) ? i18n.language : 'en';
      if (locale && locale.startsWith && locale.startsWith('si')) {
        const descSlug = slugify(cleaned);
        if (descSlug) {
          const key = `paddyVarieties.descriptions.${descSlug}`;
          const translated = t(key);
          // If a translation exists (i18next returns the key when missing), use it
          if (translated && translated !== key) {
            return translated;
          }
        }
      }
    } catch (e) {
      // ignore translation errors and fall back to cleaned
    }

    return cleaned;
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading paddy varieties...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header - responsive */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
            <BackButton to="/dashboard" sx={{ mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('paddyVarieties.title')}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {t('paddyVarieties.subtitle')}
              </Typography>
            </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t('paddyVarieties.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: '100%', sm: 500 } }}
        />
      </Box>

      {/* Varieties Grid */}
      {filteredVarieties.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AgricultureIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchTerm ? t('paddyVarieties.noVarietiesFound') : t('paddyVarieties.noPaddyVarietiesAvailable')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm 
              ? t('paddyVarieties.noVarietiesMatch', { term: searchTerm })
              : t('paddyVarieties.noPaddyVarietiesAvailable')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredVarieties.map((variety) => (
            <Grid item xs={12} sm={6} md={4} key={variety._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  {/* Variety Name and Type */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {variety.name}
                    </Typography>
                    <Chip
                      label={`${formatMonthsShort(variety.duration) ? `${formatMonthsShort(variety.duration)}` : ''}`}
                      size="small"
                      color={getTypeColor(variety.type)}
                    />
                  </Box>

                  {/* Duration */}
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('paddyVarieties.durationLabel')}</strong> {parseDays(variety.duration) ? `${parseDays(variety.duration)} ${t('paddyVarieties.daysUnit')}` : variety.duration}
                  </Typography>

                  {/* Grain Color */}
                  {variety.characteristics?.grainQuality?.pericarpColour && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{t('paddyVarieties.grainColorLabel')}</strong>
                      </Typography>
                      {(() => {
                        const raw = variety.characteristics.grainQuality.pericarpColour;
                        const label = t(`paddyVarieties.colors.${slugify(raw)}`, { defaultValue: raw });
                        const hex = grainColorToHex(raw);
                        if (hex) {
                          return <Chip label={label} size="small" sx={{ bgcolor: hex, color: readableTextColor(hex), border: '1px solid rgba(0,0,0,0.12)' }} />;
                        }
                        return <Chip label={label} size="small" />;
                      })()}
                    </Box>
                  )}

                  {/* Average Yield (moved up after Grain Color) */}
                  {(variety.characteristics?.averageYield || variety.characteristics?.yield) && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.yieldLabel')}</strong> {formatYield(variety.characteristics?.averageYield || variety.characteristics?.yield)}
                    </Typography>
                  )}

                  {/* Grain Shape */}
                  {variety.characteristics?.grainQuality?.grainShape && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.grainSizeLabel')}</strong> {t(`paddyVarieties.grainSizes.${slugify(variety.characteristics.grainQuality.grainShape)}`, { defaultValue: variety.characteristics.grainQuality.grainShape })}
                    </Typography>
                  )}

                  {/* Duration in Days (Numeric) */}
                  {/* {(() => {
                    const durationMatch = variety.duration?.match(/(\d+)(?:-(\d+))?/);
                    if (durationMatch) {
                      const minDuration = parseInt(durationMatch[1]);
                      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
                      const avgDuration = (minDuration + maxDuration) / 2;
                      return (
                        <Typography variant="body2" gutterBottom>
                          <strong>Average Days:</strong> {avgDuration} days
                        </Typography>
                      );
                    }
                    return null;
                  })()}

                  {/* Year of Release */}
                  {variety.yearOfRelease && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.releasedLabel')}</strong> {variety.yearOfRelease}
                    </Typography>
                  )}

                  {/* Popular Name */}
                  {variety.popularName && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.popularNameLabel')}</strong> {variety.popularName}
                    </Typography>
                  )}

                  {/* Parentage */}
                  {variety.parentage && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.parentageLabel')}</strong> {variety.parentage}
                    </Typography>
                  )}

                  {/* Recommendation (localized using seeder-driven keys) */}
                  {variety.recommendation && (
                    <Typography variant="body2" gutterBottom>
                      <strong>{t('paddyVarieties.recommendationLabel')}</strong> {t(`paddyVarieties.recommendations.${slugify(variety.recommendation)}`, { defaultValue: variety.recommendation })}
                    </Typography>
                  )}

                  {/* Characteristics */}
                  {variety.characteristics && (
                    <Box sx={{ mt: 2 }}>
                      {/* Resistance list */}
                      {variety.characteristics.resistance && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            <strong>{t('paddyVarieties.resistanceLabel')}</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {translateListArray(variety.characteristics.resistance, 'paddyVarieties.characteristics.resistances').map((r, idx) => (
                              <Chip key={idx} label={r} size="small" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* {variety.characteristics.grainType && (
                        <Typography variant="body2" color="textSecondary">
                          {t('paddyVarieties.grainTypeLabel')} {t(`paddyVarieties.characteristics.grainTypes.${slugify(variety.characteristics.grainType)}`, { defaultValue: variety.characteristics.grainType })}
                        </Typography>
                      )} */}
                    </Box>
                  )}

                  {/* Description: show only if cleaned description has content and is not a placeholder/repeat of recommendation */}
                  {(() => {
                      const cleaned = cleanDescription(variety.description, variety.recommendation);
                    return cleaned ? (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        {cleaned}
                      </Typography>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Results Count */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {t('paddyVarieties.showingCount', { shown: filteredVarieties.length, total: varieties.length })}
        </Typography>
      </Box>
    </Box>
  );
};

// ...existing code...

const PaddyVarieties = () => {
  return (
    <AppProviders>
      <Layout>
        <PaddyVarietiesContent />
      </Layout>
    </AppProviders>
  );
};

export default PaddyVarieties;
