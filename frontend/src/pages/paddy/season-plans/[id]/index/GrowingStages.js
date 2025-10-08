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
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const GrowingStages = ({
  plan,
  expandedSections,
  handleAccordionChange,
  handleStageImplementation,
  getCompletedStages,
  t,
  formatDate,
}) => {
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
    // create a safe key from the stage name: lowercase, replace non-alnum with underscores
    const slug = String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const nameKey = `seasonPlans.viewPage.growingStageNames.${slug}`;
    const legacyKey = `seasonPlans.viewPage.growingStages.${slug}`;
    const translatedName = t(nameKey);
    if (translatedName && translatedName !== nameKey) return translatedName;
    const translatedLegacy = t(legacyKey);
    if (translatedLegacy && translatedLegacy !== legacyKey) return translatedLegacy;
    return name;
  };

  const translateDescription = (stageName, description) => {
    if (!stageName || !description) return description || "";
    // create a safe key from the stage name: lowercase, replace non-alnum with underscores
    const slug = String(stageName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const descriptionKey = `seasonPlans.viewPage.growingStageDescriptions.${slug}`;
    const translatedDescription = t(descriptionKey);
    if (translatedDescription && translatedDescription !== descriptionKey) return translatedDescription;
    return description;
  };

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
              🌾 {t('seasonPlans.viewPage.growingStages')}
              {plan.growingStages && (
                <Chip
                  label={t('seasonPlans.viewPage.stageProgress', { current: getCompletedStages(), total: plan.growingStages.length })}
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
            {plan.growingStages?.map((stage, index) => (
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
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
                          color: stage.completed ? "success.main" : "grey.400",
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
                        <CheckCircleIcon sx={{ color: "success.main", flexShrink: 0 }} />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                      sx={{ wordBreak: "break-word", lineHeight: 1.4 }}
                    >
                      {t('seasonPlans.viewPage.planned')}: {formatRangeShortDate(stage.startDate, stage.endDate)}
                    </Typography>
                    {stage.actualStartDate && stage.actualEndDate && (
                      <Typography
                        variant="body2"
                        color="success.main"
                        gutterBottom
                        sx={{ wordBreak: "break-word", lineHeight: 1.4 }}
                      >
                        ✓ {t('seasonPlans.viewPage.actual')}: {formatRangeShortDate(stage.actualStartDate, stage.actualEndDate)}
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
                          📝 {t('seasonPlans.viewPage.notes')}: {stage.notes}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "flex-start" }}>
                      <Tooltip
                        title={
                          stage.completed
                            ? t('seasonPlans.viewPage.markIncomplete')
                            : t('seasonPlans.viewPage.markComplete')
                        }
                      >
                        <IconButton
                          size="small"
                          color={stage.completed ? "success" : "primary"}
                          onClick={() => handleStageImplementation(index)}
                          sx={{ flexShrink: 0 }}
                        >
                          {stage.completed ? <CheckIcon /> : <PlayArrowIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('seasonPlans.viewPage.notes')}>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleStageImplementation(index)}
                          sx={{ flexShrink: 0 }}
                        >
                          <NotesIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default GrowingStages;