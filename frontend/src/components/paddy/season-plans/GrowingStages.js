// -----------------------------
// Imports
// -----------------------------
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
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  PlayArrow as PlayArrowIcon,
  Notes as NotesIcon,
  OndemandVideo as OndemandVideoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const getStageSlug = (name) => {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const buildYouTubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const STAGE_VIDEO_PREFERENCES = {
  first_plowing: {
    query: "paddy first plowing field preparation Sri Lanka",
    queryByLocale: {
      si: "වී වගාවේ මුලික බිම් සැකැස්ම ",
    },
  },
  second_plowing_field_leveling: {
    query: "paddy second plowing field leveling Sri Lanka",
    queryByLocale: {
      si: " කුඹුරු පසට නයිට්‍රජන් අඩංගු කරදහයියා, වී වගාවේ මුලික බිම් සැකැස්ම",
    },
  },
  nursery_sowing: {
    query: "paddy nursery raising sowing techniques",
    queryByLocale: {
      si: "වී වගාවේ තවාන් ක්‍රම, වී වැපිරීම, වී වගාව",
    },
  },
  transplanting: {
    query: "paddy transplanting best practices Sri Lanka",
    queryByLocale: {
      si: "වී වගාවේ පැල සිටුවීම ",
    },
  },
  tillering: {
    query: "paddy tillering stage management tips",
    queryByLocale: {
      si: "ගොයම් පඳුරු දැමීම ",
    },
  },
  panicle_initiation: {
    query: "paddy panicle initiation fertilizer recommendations",
    queryByLocale: {
      si: "වී වගාවේ බංඩි ගොයම",
    },
  },
  flowering: {
    query: "paddy flowering stage pest management",
    queryByLocale: {
      si: "පිදුණ ගොයම, පළිබෝධ පාලනය",
    },
  },
  grain_filling: {
    query: "paddy grain filling stage advice",
    queryByLocale: {
      si: "ගොයම් කරල් සම්පුර්ණ වීම , ගොයම් මැස්සා ",
    },
  },
  maturity: {
    query: "paddy maturity stage harvesting preparation",
    queryByLocale: {
      si: "වී කරල් පැසීමේ අදියර හා අස්වනු සූදානම් කිරීම",
    },
  },
  harvesting: {
    query: "paddy harvesting techniques Sri Lanka",
    queryByLocale: {
      si: "වී අස්වනු නෙලීම ",
    },
  },
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

const resolvePreferredVideoUrl = (slug, locale) => {
  if (!slug) return null;
  const preference = STAGE_VIDEO_PREFERENCES[slug];
  if (!preference) return null;

  if (preference.url) {
    return preference.url;
  }

  const query = pickQueryForLocale(locale, preference);

  if (!query) return null;

  return buildYouTubeSearchUrl(query);
};

// -----------------------------
// GrowingStages component
// -----------------------------
const GrowingStages = ({
  plan,
  expandedSections,
  handleAccordionChange,
  handleStageImplementation,
  getCompletedStages,
  t,
  formatDate,
  locale,
}) => {
  // -----------------------------
  // Guard & Helpers
  // -----------------------------
  // Guard for server-side rendering: if plan or growingStages is not available,
  // avoid rendering the component to prevent "reading 'growingStages' of undefined" errors.
  if (!plan || !plan.growingStages) return null;
  const formatShortDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("DD MMM YYYY");
  };

  const formatRangeShortDate = (start, end) => {
    if (!start && !end) return "";
    if (!end) return formatShortDate(start);
    if (!start) return formatShortDate(end);
    try {
      return dayjs(start).isSame(end, "day")
        ? formatShortDate(start)
        : `${formatShortDate(start)} - ${formatShortDate(end)}`;
    } catch (e) {
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }
  };

  const translateStage = (name) => {
    if (!name) return "";
    const slug = getStageSlug(name);
    const nameKey = `seasonPlans.viewPage.growingStageNames.${slug}`;
    const legacyKey = `seasonPlans.viewPage.growingStages.${slug}`;
    const translatedName = t(nameKey);
    if (translatedName && translatedName !== nameKey) return translatedName;
    const translatedLegacy = t(legacyKey);
    if (translatedLegacy && translatedLegacy !== legacyKey)
      return translatedLegacy;
    return name;
  };

  const translateDescription = (stageName, description) => {
    if (!stageName || !description) return description || "";
    const slug = getStageSlug(stageName);
    const descriptionKey = `seasonPlans.viewPage.growingStageDescriptions.${slug}`;
    const translatedDescription = t(descriptionKey);
    if (translatedDescription && translatedDescription !== descriptionKey)
      return translatedDescription;
    return description;
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <Grid item xs={12}>
      <Accordion
        expanded={expandedSections.growingStages}
        onChange={handleAccordionChange("growingStages")}
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
              🌾 {t("seasonPlans.viewPage.growingStages")}
              {plan.growingStages && (
                <Chip
                  label={t("seasonPlans.viewPage.stageProgress", {
                    current: getCompletedStages(),
                    total: plan.growingStages.length,
                  })}
                  size="small"
                  color={
                    getCompletedStages() === plan.growingStages.length
                      ? "success"
                      : "default"
                  }
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {plan.growingStages?.map((stage, index) => {
              const stageSlug = getStageSlug(stage.stage);
              const stageVideoUrl =
                (stage && stage.videoUrl) ||
                resolvePreferredVideoUrl(stageSlug, locale) ||
                null;
              const hasVideo = Boolean(stageVideoUrl);
              const handlePrimaryAction = () => {
                if (hasVideo && typeof window !== "undefined") {
                  window.open(stageVideoUrl, "_blank", "noopener,noreferrer");
                } else {
                  handleStageImplementation(index);
                }
              };

              return (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      background: stage.completed
                        ? "linear-gradient(135deg, #90EE90, #98FB98)"
                        : "linear-gradient(135deg, #F5F5F5, #E8F5E8)",
                      borderLeft: `4px solid ${stage.completed ? "#006400" : "#90EE90"}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(144, 238, 144, 0.4)",
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
                          gap: 1,
                          minWidth: 0,
                        }}
                      >
                        <ScheduleIcon
                          sx={{
                            color: stage.completed
                              ? "success.main"
                              : "grey.400",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {translateStage(stage.stage)}
                        </Typography>
                        {stage.completed && (
                          <CheckCircleIcon
                            sx={{ color: "success.main", flexShrink: 0 }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                        sx={{ wordBreak: "break-word", lineHeight: 1.4 }}
                      >
                        {t("seasonPlans.viewPage.planned")}:{" "}
                        {formatRangeShortDate(stage.startDate, stage.endDate)}
                      </Typography>
                      {stage.actualStartDate && stage.actualEndDate && (
                        <Typography
                          variant="body2"
                          color="success.main"
                          gutterBottom
                          sx={{ wordBreak: "break-word", lineHeight: 1.4 }}
                        >
                          ✓ {t("seasonPlans.viewPage.actual")}:{" "}
                          {formatRangeShortDate(
                            stage.actualStartDate,
                            stage.actualEndDate
                          )}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          lineHeight: 1.4,
                        }}
                      >
                        {translateDescription(stage.stage, stage.description)}
                      </Typography>
                      {stage.notes && (
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
                            📝 {t("seasonPlans.viewPage.notes")}: {stage.notes}
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
                        }}
                      >
                        <Tooltip
                          title={
                            hasVideo
                              ? t("seasonPlans.viewPage.watchVideo", {
                                  defaultValue: "Watch video",
                                })
                              : stage.completed
                                ? t("seasonPlans.viewPage.markIncomplete")
                                : t("seasonPlans.viewPage.markComplete")
                          }
                        >
                          <IconButton
                            size="small"
                            color={
                              hasVideo
                                ? "secondary"
                                : stage.completed
                                  ? "success"
                                  : "primary"
                            }
                            onClick={handlePrimaryAction}
                            sx={{ flexShrink: 0 }}
                            aria-label={
                              hasVideo
                                ? "watch-video"
                                : stage.completed
                                  ? "mark-incomplete"
                                  : "mark-complete"
                            }
                          >
                            {hasVideo ? (
                              <OndemandVideoIcon />
                            ) : stage.completed ? (
                              <CheckIcon />
                            ) : (
                              <PlayArrowIcon />
                            )}
                          </IconButton>
                        </Tooltip>

                        {/* Notes dialog: completion should be confirmable inside the dialog */}
                        <Tooltip
                          title={`${t("seasonPlans.viewPage.notes")} — ${t("seasonPlans.viewPage.markCompleteInDialog", { defaultValue: "mark completion in dialog" })}`}
                        >
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleStageImplementation(index)}
                            sx={{ flexShrink: 0 }}
                            aria-label="open-notes"
                          >
                            <NotesIcon />
                          </IconButton>
                        </Tooltip>
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

export default GrowingStages;
