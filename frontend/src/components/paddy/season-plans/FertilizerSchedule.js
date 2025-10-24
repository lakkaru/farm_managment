import React from "react";
import dayjs from "dayjs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Science as ScienceIcon,
  Colorize as ColorizeIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  PlayArrow as PlayArrowIcon,
  Notes as NotesIcon,
  OndemandVideo as OndemandVideoIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from "@mui/icons-material";

const buildYouTubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const getFertilizerStageSlug = (stage) => {
  if (!stage) return "";
  return String(stage)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const FERTILIZER_STAGE_VIDEO_PREFERENCES = {
  basic_application: {
    query: "paddy basal fertilizer application Sri Lanka",
    queryByLocale: {
      si: "වී වගාවේ මුලික පොහොර භාවිතය ",
    },
  },
  "2_weeks": {
    query: "paddy top dressing fertilizer 2 weeks after transplanting",
    queryByLocale: {
      si: "වී වගාවේ පොහොර යෙදිය යුතු අවස්ථාව ",
    },
  },
  "4_weeks": {
    query: "paddy fertilizer application 4 weeks stage",
    queryByLocale: {
      si: "මාසයක වී ගොයමට පොහොර ",
    },
  },
  "6_weeks": {
    query: "paddy fertilizer application 6 weeks stage",
    queryByLocale: {
      si: "වී පැල සිටුවීමෙන් සති 6කින් පොහොර යෙදීම",
    },
  },
  "7_weeks": {
    query: "paddy fertilizer application 7 weeks stage",
    queryByLocale: {
      si: "බන්ඩි ගොයමට පොහොර",
    },
  },
  "8_weeks": {
    query: "paddy fertilizer application 8 weeks stage",
    queryByLocale: {
      si: "වී පැල සිටුවීමෙන් සති 8කින් පොහොර යෙදීම",
    },
  },
  "9_weeks": {
    query: "paddy fertilizer application 9 weeks stage",
    queryByLocale: {
      si: "වී පැල සිටුවීමෙන් සති 9කින් පොහොර යෙදීම",
    },
  },
  lcc_application: {
    query: "paddy leaf color chart urea recommendation",
    queryByLocale: {
      si: "පත්‍ර වර්ණ දර්ශකය අනුව පොහොර යෙදීම ",
    },
  },
};

const FERTILIZER_NAME_TOKENS = {
  urea: { en: "urea", si: "යූරියා" },
  tsp: { en: "tsp fertilizer", si: "ටිඑස්පී" },
  mop: { en: "mop potash", si: "එම්ඕපී" },
  zincSulphate: { en: "zinc sulphate", si: "සින්ක් සල්ෆේට්" },
};

const getFertilizerTokens = (fertilizers, locale) => {
  if (!fertilizers) return [];
  const normalized = (locale || "en").toLowerCase();
  const base = normalized.split("-")[0];

  return Object.entries(fertilizers)
    .filter(([, value]) => Number(value) > 0)
    .map(([key]) => {
      const token = FERTILIZER_NAME_TOKENS[key];
      if (!token) return key;
      return token[base] || token.en;
    });
};

const pickQueryForLocale = (locale, preference) => {
  if (!preference) return "";
  const normalized = (locale || "").toLowerCase();
  const base = normalized.split("-")[0];

  return (
    preference?.queryByLocale?.[normalized] ||
    preference?.queryByLocale?.[base] ||
    preference?.query ||
    ""
  );
};

const getFertilizerVideoQuery = (application, locale) => {
  if (!application) return "";

  const normalized = (locale || "en").toLowerCase();
  const baseLocale = normalized.split("-")[0];

  const stageSlug = getFertilizerStageSlug(application.stage);
  const generalizedSlug = stageSlug.replace(/_week_\d+$/, "_week");
  const preferenceBase =
    FERTILIZER_STAGE_VIDEO_PREFERENCES[stageSlug] ||
    FERTILIZER_STAGE_VIDEO_PREFERENCES[generalizedSlug];
  const preference =
    preferenceBase ||
    (stageSlug.startsWith("lcc_application")
      ? FERTILIZER_STAGE_VIDEO_PREFERENCES.lcc_application
      : undefined);

  let query = pickQueryForLocale(locale, preference);

  if (!query) {
    query =
      baseLocale === "si"
        ? `වී පොහොර යෙදීම ${String(application.stage || "").trim()}`
        : `paddy fertilizer application ${String(application.stage || "").toLowerCase()}`;
  }

  const fertilizerTokens = getFertilizerTokens(application.fertilizers, locale);
  if (fertilizerTokens.length > 0) {
    query += ` ${fertilizerTokens.join(" ")}`;
  }

  if (typeof application.week === "number") {
    query +=
      baseLocale === "si"
        ? ` සති ${application.week}`
        : ` ${application.week} weeks`;
  }

  return query.trim();
};

const getFertilizerVideoUrl = (application, locale) => {
  const query = getFertilizerVideoQuery(application, locale);
  if (!query) return null;
  return buildYouTubeSearchUrl(query);
};

const FertilizerSchedule = ({
  plan,
  expandedSections,
  handleAccordionChange,
  handleFertilizerImplementation,
  deleteFertilizerApplication,
  onRequestDelete,
  leafColorEnabled,
  setLeafColorEnabled,
  setLeafColorData,
  setLeafColorDialog,
  saving,
  t,
  locale,
}) => {
  // Guard for SSR: avoid reading properties on `plan` when it's undefined during Gatsby's build
  if (!plan) return null;
  const formatShortDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("DD MMM YYYY");
  };

  // Determine which date was used as the anchor for scheduling
  const getAnchorDateUsed = () => {
    try {
      if (plan.plantingMethod === 'transplanting' && plan.transplantingDate) {
        return plan.transplantingDate;
      }
    } catch (e) {
      // ignore
    }
    return plan.cultivationDate;
  };

  const translateFertilizerStage = (stage) => {
    if (!stage) return "";
    // Create a safe key from the stage name
    const slug = String(stage)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const stageKey = `seasonPlans.viewPage.fertilizerStages.${slug}`;
    const translated = t(stageKey);
    if (translated && translated !== stageKey) return translated;
    return stage;
  };

  const translateFertilizerType = (type) => {
    if (!type) return "";
    // Convert spaces to underscores and make lowercase for key matching
    const slug = String(type)
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    const typeKey = `seasonPlans.viewPage.fertilizerTypes.${slug}`;
    const translated = t(typeKey);
    if (translated && translated !== typeKey) return translated;
    return type;
  };

  const translateFertilizerDescription = (stage, isLCCBased = false) => {
    if (!stage) return "";
    
    // Handle LCC-based applications
    if (isLCCBased || stage.toLowerCase().includes('lcc')) {
      const descKey = `seasonPlans.viewPage.fertilizerStageDescriptions.lcc_application`;
      const translated = t(descKey);
      if (translated && translated !== descKey) return translated;
      return "Urea application based on Leaf Color Chart recommendations";
    }
    
    // Create a safe key from the stage name
    const slug = String(stage)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    
    const descKey = `seasonPlans.viewPage.fertilizerStageDescriptions.${slug}`;
    const translated = t(descKey);
    if (translated && translated !== descKey) return translated;
    
    // Fallback to original description if no translation found
    return stage;
  };

  return (
    <Grid item xs={12}>
      <Accordion
        expanded={expandedSections.fertilizerSchedule}
        onChange={handleAccordionChange("fertilizerSchedule")}
        sx={{ boxShadow: 3 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#f8f9fa",
            "&:hover": { backgroundColor: "#e9ecef" },
            "& .MuiAccordionSummary-content": { margin: "16px 0" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              pr: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🌿 {t('seasonPlans.viewPage.fertilizerSchedule')}
              {plan.fertilizerSchedule && (
                <Chip
                  label={t('seasonPlans.viewPage.appliedCount', { 
                    applied: plan.fertilizerSchedule.filter((app) => app.applied).length, 
                    total: plan.fertilizerSchedule.length 
                  })}
                  size="small"
                  color={
                    plan.fertilizerSchedule.filter((app) => app.applied)
                      .length === plan.fertilizerSchedule.length
                      ? "success"
                      : "default"
                  }
                  sx={{ ml: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                />
              )}
            </Typography>
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: "stretch", sm: "center" }, 
              justifyContent: { xs: 'center', sm: 'flex-end' },  
              gap: 1,
              width: { xs: '100%', sm: 'auto' }
            }}>
              {plan.fertilizerSchedule && (
                <Chip
                  label={t('seasonPlans.viewPage.appliedCount', { 
                    applied: plan.fertilizerSchedule.filter((app) => app.applied).length, 
                    total: plan.fertilizerSchedule.length 
                  })}
                  size="small"
                  color={
                    plan.fertilizerSchedule.filter((app) => app.applied)
                      .length === plan.fertilizerSchedule.length
                      ? "success"
                      : "default"
                  }
                  sx={{ display: { xs: 'flex', sm: 'none' }, alignSelf: 'center' }}
                />
              )}

              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: "center", 
                gap: { xs: 1, sm: 2 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                    {t('seasonPlans.viewPage.anchorDate')}:
                  </Typography>
                  <Typography variant="caption">{formatShortDate(getAnchorDateUsed())}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2">{t('seasonPlans.viewPage.leafColorChart')}:</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setLeafColorEnabled(!leafColorEnabled)}
                    sx={{
                      color: leafColorEnabled ? "success.main" : "grey.400",
                    }}
                  >
                    {leafColorEnabled ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </IconButton>
                </Box>
                {leafColorEnabled && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ColorizeIcon />}
                    onClick={() => {
                      setLeafColorData({
                        currentDate: dayjs().format("YYYY-MM-DD"),
                        plantAge: "",
                        leafColorIndex: "",
                        recommendedUrea: 0,
                      });
                      setLeafColorDialog(true);
                    }}
                    sx={{
                      borderColor: "#90EE90",
                      color: "#228B22",
                      "&:hover": {
                        borderColor: "#228B22",
                        backgroundColor: "#F0FFF0",
                      },
                    }}
                  >
                    {t('seasonPlans.viewPage.checkLeafColor')}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {plan.fertilizerSchedule?.map((app, index) => {
              const videoUrl = getFertilizerVideoUrl(app, locale);
              const hasVideo = Boolean(videoUrl);
              const handlePrimaryAction = () => {
                if (hasVideo && typeof window !== "undefined") {
                  window.open(videoUrl, "_blank", "noopener,noreferrer");
                } else {
                  handleFertilizerImplementation(index);
                }
              };

              return (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    background: app.applied
                      ? "linear-gradient(135deg, #98FB98, #90EE90)"
                      : app.isLCCBased
                        ? "linear-gradient(135deg, #E3F2FD, #BBDEFB)"
                        : "linear-gradient(135deg, #F5F5F5, #FFF8E7)",
                    borderLeft: `4px solid ${app.applied ? "#006400" : app.isLCCBased ? "#1976D2" : "#FFD700"}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: app.isLCCBased
                        ? "0 4px 12px rgba(25, 118, 210, 0.4)"
                        : "0 4px 12px rgba(255, 215, 0, 0.4)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        minWidth: 0,
                      }}
                    >
                      {app.isLCCBased ? (
                        <ColorizeIcon
                          sx={{
                            mr: 1,
                            color: app.applied
                              ? "success.main"
                              : "primary.main",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <ScienceIcon
                          sx={{
                            mr: 1,
                            color: app.applied
                              ? "success.main"
                              : "grey.400",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {translateFertilizerStage(app.stage)}
                      </Typography>
                      {app.applied && (
                        <CheckCircleIcon
                          sx={{
                            ml: 1,
                            color: "success.main",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {app.isLCCBased && !app.applied && (
                        <Chip
                          label={t('seasonPlans.viewPage.lccLabel')}
                          size="small"
                          sx={{
                            ml: 1,
                            bgcolor: "primary.main",
                            color: "white",
                            fontSize: "0.6rem",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                      sx={{ wordBreak: "break-word", lineHeight: 1.4 }}
                    >
                      {t('seasonPlans.viewPage.scheduled')}: {formatShortDate(app.date)}
                    </Typography>
                    {app.implementedDate && (
                      <Typography
                        variant="body2"
                        color="success.main"
                        gutterBottom
                      >
                        ✓ {t('seasonPlans.viewPage.implemented')}: {formatShortDate(app.implementedDate)}
                      </Typography>
                    )}
                    <Typography variant="body2" gutterBottom>
                      {translateFertilizerDescription(app.stage, app.isLCCBased)}
                    </Typography>

                    {/* LCC Data Display */}
                    {app.isLCCBased && app.lccData && (
                      <Box
                        sx={{
                          mt: 1,
                          p: { xs: 1, sm: 1.5 },
                          backgroundColor: "#E3F2FD",
                          borderRadius: 1,
                          borderLeft: 3,
                          borderColor: "primary.main",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "primary.dark",
                            fontWeight: "bold",
                            lineHeight: 1.3,
                          }}
                        >
                          📊 {t('seasonPlans.viewPage.lccData', { 
                            age: app.lccData.plantAge, 
                            colorIndex: app.lccData.leafColorIndex 
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{
                            color: "primary.dark",
                            lineHeight: 1.3,
                            mt: 0.5,
                          }}
                        >
                          {t('seasonPlans.viewPage.recommended')}: {app.lccData.recommendedPerAcre}
                          {t('seasonPlans.units.kg')}/{t('seasonPlans.units.acres')} × {app.lccData.totalArea} {t('seasonPlans.units.acres')}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                      }}
                    >
                      {/* Show only the total amount for the field (perFieldKg) */}
                      {app.fertilizers?.perFieldKg ? (
                        Object.entries(app.fertilizers.perFieldKg).map(([key, amount]) => {
                          if (!amount || amount <= 0) return null;
                          return (
                            <Typography
                              key={`field-${key}`}
                              variant="caption"
                              display="block"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {translateFertilizerType(key)}: {amount} {t('seasonPlans.units.kg')}
                            </Typography>
                          );
                        })
                      ) : (
                        // Fallback to old shape - show simple amounts
                        <>
                          {app.fertilizers?.urea > 0 && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {translateFertilizerType("Urea")}: {app.fertilizers.urea} {t('seasonPlans.units.kg')}
                            </Typography>
                          )}
                          {app.fertilizers?.tsp > 0 && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {translateFertilizerType("TSP")}: {app.fertilizers.tsp} {t('seasonPlans.units.kg')}
                            </Typography>
                          )}
                          {app.fertilizers?.mop > 0 && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {translateFertilizerType("MOP")}: {app.fertilizers.mop} {t('seasonPlans.units.kg')}
                            </Typography>
                          )}
                          {app.fertilizers?.zincSulphate > 0 && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {translateFertilizerType("Zinc Sulphate")}: {app.fertilizers.zincSulphate} {t('seasonPlans.units.kg')}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                    {app.notes && (
                      <Box
                        sx={{
                          mt: 1,
                          p: { xs: 1, sm: 1.5 },
                          backgroundColor: "grey.50",
                          borderRadius: 1,
                          borderLeft: 3,
                          borderColor: "info.main",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "info.dark",
                            fontStyle: "italic",
                            lineHeight: 1.3,
                          }}
                        >
                          📝 {t('seasonPlans.viewPage.notes')}: {app.notes}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip
                        title={
                          hasVideo
                            ? t('seasonPlans.viewPage.watchVideo', { defaultValue: 'Watch video' })
                            : app.applied
                              ? t('seasonPlans.viewPage.markNotApplied')
                              : t('seasonPlans.viewPage.markApplied')
                        }
                      >
                        <IconButton
                          size="small"
                          color={
                            hasVideo
                              ? "secondary"
                              : app.applied
                                ? "success"
                                : "primary"
                          }
                          onClick={handlePrimaryAction}
                          aria-label={
                            hasVideo
                              ? "watch-video"
                              : app.applied
                                ? "mark-not-applied"
                                : "mark-applied"
                          }
                        >
                          {hasVideo ? (
                            <OndemandVideoIcon />
                          ) : app.applied ? (
                            <CheckIcon />
                          ) : (
                            <PlayArrowIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={`${t('seasonPlans.viewPage.notes')} — ${t('seasonPlans.viewPage.markAppliedInDialog', { defaultValue: 'mark application in dialog' })}`}
                      >
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            handleFertilizerImplementation(index)
                          }
                          aria-label="open-notes"
                        >
                          <NotesIcon />
                        </IconButton>
                      </Tooltip>
                      {!app.applied && (
                        <Tooltip
                          title={t('seasonPlans.viewPage.deleteFertilizerApp', { 
                            type: app.isLCCBased ? t('seasonPlans.viewPage.lccBased') : t('seasonPlans.viewPage.scheduled') 
                          })}
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              // request confirmation from parent before deleting
                              (onRequestDelete ? onRequestDelete(index) : deleteFertilizerApplication(index))
                            }
                            disabled={saving}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default FertilizerSchedule;