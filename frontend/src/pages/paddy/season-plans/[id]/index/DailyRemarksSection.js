import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { seasonPlanAPI } from "../../../../../services/api";

// Daily Remarks Section Component with i18n support
const ThumbnailDisplay = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (imageError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#888",
          fontSize: "0.65rem",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          border: "1px dashed #ddd",
          borderRadius: "4px",
        }}
      >
        <Box sx={{ fontSize: "1.4rem", mb: 0.3 }}>🖼️</Box>
        <Box sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>Image</Box>
        <Box sx={{ fontSize: "0.55rem", opacity: 0.8 }}>Unavailable</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#f5f5f5",
            fontSize: "0.8rem",
            color: "#666",
          }}
        >
          Loading...
        </Box>
      )}

      <img
        src={imageUrl}
        alt=""
        crossOrigin="anonymous"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "cover",
          width: "100%",
          height: "100%",
          display: isLoading ? "none" : "block",
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
          setImageError(true);
        }}
      />
    </Box>
  );
};

const RequiredAsterisk = ({ color = "error", sx = {} }) => (
  <Box
    component="span"
    sx={{ color: (theme) => theme.palette[color]?.main || color, ml: 0.5, ...sx }}
  >
    *
  </Box>
);

const defaultRemarkState = () => ({
  date: dayjs().format("YYYY-MM-DD"),
  category: "general",
  description: "",
  images: [],
});

const DailyRemarksSection = ({
  plan,
  seasonPlanId,
  expandedSections,
  handleAccordionChange,
  setPlan,
  saving,
  setSaving,
}) => {
  const { t, i18n, ready } = useTranslation();
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkData, setRemarkData] = useState(defaultRemarkState);
  const [remarkImages, setRemarkImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deleteRemarkId, setDeleteRemarkId] = useState(null);
  const [deleteRemarkDialogOpen, setDeleteRemarkDialogOpen] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);

  const remarkCategories = useMemo(
    () => {
      if (!ready) return [];
      
      const categories = [
        { value: 'general', label: t('seasonPlans.viewPage.dailyRemarks.categories.general'), icon: '📝', description: 'General observations and notes' },
        { value: 'weather', label: t('seasonPlans.viewPage.dailyRemarks.categories.weather'), icon: '🌤️', description: 'Weather observations affecting cultivation' },
        { value: 'field_preparation', label: t('seasonPlans.viewPage.dailyRemarks.categories.field_preparation'), icon: '🚜', description: 'Land preparation activities' },
        { value: 'plowing', label: t('seasonPlans.viewPage.dailyRemarks.categories.plowing'), icon: '🚜', description: 'Plowing and tillage operations' },
        { value: 'seeds_preparation', label: t('seasonPlans.viewPage.dailyRemarks.categories.seeds_preparation'), icon: '🌾', description: 'Seed selection, treatment, and preparation' },
        { value: 'seeding_sowing', label: t('seasonPlans.viewPage.dailyRemarks.categories.seeding_sowing'), icon: '🌱', description: 'Direct seeding or sowing activities' },
        { value: 'transplanting', label: t('seasonPlans.viewPage.dailyRemarks.categories.transplanting'), icon: '🌿', description: 'Transplanting of paddy seedlings' },
        { value: 'harvesting', label: t('seasonPlans.viewPage.dailyRemarks.categories.harvesting'), icon: '🎋', description: 'Harvesting operations and yield observations' },
        { value: 'pest', label: t('seasonPlans.viewPage.dailyRemarks.categories.pest'), icon: '🐛', description: 'Pest sightings and control measures' },
        { value: 'disease', label: t('seasonPlans.viewPage.dailyRemarks.categories.disease'), icon: '🦠', description: 'Disease symptoms and treatments' },
        { value: 'fertilizer', label: t('seasonPlans.viewPage.dailyRemarks.categories.fertilizer'), icon: '🧪', description: 'Fertilizer applications and observations' },
        { value: 'irrigation', label: t('seasonPlans.viewPage.dailyRemarks.categories.irrigation'), icon: '💧', description: 'Water management and irrigation activities' },
        { value: 'growth', label: t('seasonPlans.viewPage.dailyRemarks.categories.growth'), icon: '📏', description: 'Growth stages and development observations' },
        { value: 'other', label: t('seasonPlans.viewPage.dailyRemarks.categories.other'), icon: '📋', description: 'Other observations not covered above' }
      ];
      
      return categories;
    },
    [i18n.language, t, ready]
  );

  const formatShortDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("DD MMM YYYY");
  };

  const resetRemarkState = () => {
    setRemarkDialogOpen(false);
    setEditingRemark(null);
    setRemarkData(defaultRemarkState());
    setRemarkImages([]);
  };

  const openRemarkDialog = (remark = null) => {
    if (remark) {
      setEditingRemark(remark);
      setRemarkData({
        date: dayjs(remark.date).format("YYYY-MM-DD"),
        category: remark.category,
        description: remark.description,
        images: remark.images || [],
      });
    } else {
      setRemarkData(defaultRemarkState());
      setEditingRemark(null);
    }

    setRemarkImages([]);
    setRemarkDialogOpen(true);
  };

  const handleRemarkImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(
        `Some files are too large (>10MB): ${oversizedFiles
          .map((file) => file.name)
          .join(", ")}`
      );
      event.target.value = "";
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast.error(
        `Total file size too large (${Math.round(
          totalSize / 1024 / 1024
        )}MB). Please select fewer or smaller images.`
      );
      event.target.value = "";
      return;
    }

    setUploadingImages(true);
    const newImages = [];
    let processedCount = 0;

    files.forEach((file) => {
      const isHeic =
        file.type.toLowerCase().includes("heic") ||
        file.type.toLowerCase().includes("heif") ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");

      if (isHeic) {
        newImages.push({
          file,
          preview: null,
          name: file.name,
          size: file.size,
          isHeic: true,
        });

        processedCount += 1;
        if (processedCount === files.length) {
          setRemarkImages((prev) => [...prev, ...newImages]);
          setUploadingImages(false);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target?.result || null,
            name: file.name,
            size: file.size,
            isHeic: false,
          });

          processedCount += 1;
          if (processedCount === files.length) {
            setRemarkImages((prev) => [...prev, ...newImages]);
            setUploadingImages(false);
          }
        };
        reader.onerror = () => {
          newImages.push({
            file,
            preview: null,
            name: file.name,
            size: file.size,
            isHeic: false,
          });

          processedCount += 1;
          if (processedCount === files.length) {
            setRemarkImages((prev) => [...prev, ...newImages]);
            setUploadingImages(false);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    event.target.value = "";
  };

  const removeSelectedImage = (index) => {
    setRemarkImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (remarkId, imageFilename) => {
    if (!remarkId || !imageFilename || removingImage) {
      return;
    }

    try {
      setRemovingImage(true);
      const response = await seasonPlanAPI.removeRemarkImage(
        seasonPlanId,
        remarkId,
        imageFilename
      );

      const updatedPlan = response?.data?.data;
      if (updatedPlan) {
        setPlan(updatedPlan);

        const updatedRemark = updatedPlan.dailyRemarks?.find(
          (remark) => remark._id === remarkId
        );

        if (updatedRemark) {
          setEditingRemark(updatedRemark);
          setRemarkData({
            date: dayjs(updatedRemark.date).format("YYYY-MM-DD"),
            category: updatedRemark.category,
            title: updatedRemark.title,
            description: updatedRemark.description,
            images: updatedRemark.images || [],
          });
        } else {
          setRemarkData((prev) => ({
            ...prev,
            images: prev.images.filter((image) => image.filename !== imageFilename),
          }));
        }
      }

      toast.success(t("seasonPlans.viewPage.dailyRemarks.toastUpdated"));
    } catch (error) {
      console.error("Error removing remark image:", error);
      toast.error(t("seasonPlans.viewPage.dailyRemarks.toastError"));
    } finally {
      setRemovingImage(false);
    }
  };

  const saveRemark = async () => {
    if (!remarkData.description.trim()) {
      toast.error(t("seasonPlans.viewPage.dailyRemarks.toastError"));
      return;
    }

    if (saving) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("date", remarkData.date);
      formData.append("category", remarkData.category);
      formData.append("title", remarkData.title);
      formData.append("description", remarkData.description);

      remarkImages.forEach((imageObj) => {
        if (imageObj.file) {
          formData.append("images", imageObj.file);
        }
      });

      let response;

      if (editingRemark) {
        response = await seasonPlanAPI.updateDailyRemark(
          seasonPlanId,
          editingRemark._id,
          formData
        );
        toast.success(t("seasonPlans.viewPage.dailyRemarks.toastUpdated"));
      } else {
        response = await seasonPlanAPI.addDailyRemark(seasonPlanId, formData);
        toast.success(t("seasonPlans.viewPage.dailyRemarks.toastAdded"));
      }

      if (response?.data?.data) {
        setPlan(response.data.data);
      }

      resetRemarkState();
    } catch (error) {
      console.error("Error saving daily remark:", error);

      let errorMessage = t("seasonPlans.viewPage.dailyRemarks.toastError");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes("timeout")) {
        errorMessage = t("seasonPlans.viewPage.dailyRemarks.toastTimeout");
      } else if (error.message?.includes("Network Error")) {
        errorMessage = t("seasonPlans.viewPage.dailyRemarks.toastNetwork");
      } else if (error.response?.status === 413) {
        errorMessage = t("seasonPlans.viewPage.dailyRemarks.toastTooLarge");
      } else if (error.response?.status >= 500) {
        errorMessage = t("seasonPlans.viewPage.dailyRemarks.toastServer");
      }

      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const deleteRemark = (remarkId) => {
    setDeleteRemarkId(remarkId);
    setDeleteRemarkDialogOpen(true);
  };

  const confirmDeleteRemark = async () => {
    if (!deleteRemarkId) return;

    try {
      const response = await seasonPlanAPI.deleteDailyRemark(
        seasonPlanId,
        deleteRemarkId
      );

      if (response?.data?.data) {
        setPlan(response.data.data);
      }

      toast.success(t("seasonPlans.viewPage.dailyRemarks.toastDeleted"));
    } catch (error) {
      console.error("Error deleting daily remark:", error);
      toast.error(t("seasonPlans.viewPage.dailyRemarks.toastDeleteError"));
    } finally {
      setDeleteRemarkDialogOpen(false);
      setDeleteRemarkId(null);
      if (editingRemark && editingRemark._id === deleteRemarkId) {
        resetRemarkState();
      }
    }
  };

  const sortedRemarks = useMemo(() => {
    if (!plan?.dailyRemarks?.length) return [];
    return [...plan.dailyRemarks].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [plan?.dailyRemarks]);

  const selectedRemarkImageCount = remarkData.images?.length || 0;
  const backendImageUrl = (filename) =>
    `${process.env.GATSBY_API_URL}/season-plans/remark-image/${filename}`;

  return (
    <>
      <Grid item xs={12}>
        <Accordion
          expanded={expandedSections.dailyRemarks}
          onChange={handleAccordionChange("dailyRemarks")}
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
                <CommentIcon />
                {t("seasonPlans.viewPage.dailyRemarks.title")}
                {plan?.dailyRemarks && (
                  <Chip
                    label={t("seasonPlans.viewPage.dailyRemarks.remarksCount", {
                      count: plan.dailyRemarks.length,
                    })}
                    size="small"
                    color={plan.dailyRemarks.length > 0 ? "success" : "default"}
                    sx={{ ml: 2, display: { xs: "none", sm: "inline-flex" } }}
                  />
                )}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: { xs: 1.5, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                {plan?.dailyRemarks && (
                  <Chip
                    label={t("seasonPlans.viewPage.dailyRemarks.remarksCount", {
                      count: plan.dailyRemarks.length,
                    })}
                    size="small"
                    color={plan.dailyRemarks.length > 0 ? "success" : "default"}
                    sx={{ display: { xs: "flex", sm: "none" }, alignSelf: "center" }}
                  />
                )}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => openRemarkDialog()}
                  sx={{
                    background: "linear-gradient(45deg, #4CAF50, #66BB6A)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #388E3C, #4CAF50)",
                    },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: { xs: "auto", sm: "64px" },
                  }}
                >
                  {t("seasonPlans.viewPage.addRemark")}
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {sortedRemarks.length > 0 ? (
              <Grid container spacing={2}>
                {sortedRemarks.map((remark) => {
                  const categoryInfo = remarkCategories.find(cat => cat.value === remark.category) || remarkCategories[0];
                  return (
                    <Grid item xs={12} key={remark._id}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          background: "linear-gradient(135deg, #F8F9FA, #E9ECEF)",
                          borderLeft: `4px solid #4CAF50`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 1,
                              gap: 1,
                              minWidth: 0,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "transparent",
                                fontSize: "1rem",
                                flexShrink: 0,
                              }}
                            >
                              {categoryInfo.icon}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: "bold",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                }}
                              >
                                {categoryInfo.label}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                              <Tooltip title={t("common.edit") || "Edit"}>
                                <IconButton size="small" onClick={() => openRemarkDialog(remark)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t("common.delete") || "Delete"}>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => deleteRemark(remark._id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                            sx={{ wordBreak: "break-word" }}
                          >
                            📅 {formatShortDate(remark.date)}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              lineHeight: 1.4,
                            }}
                          >
                            {remark.description}
                          </Typography>

                          {remark.images && remark.images.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ display: "flex", alignItems: "center", mb: 1 }}
                              >
                                <PhotoCameraIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {t("seasonPlans.viewPage.dailyRemarks.imageCount", {
                                  count: remark.images.length,
                                })}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {remark.images.slice(0, 3).map((image, index) => {
                                  const imageUrl = backendImageUrl(image.filename);
                                  return (
                                    <Box
                                      key={`${remark._id}-${index}`}
                                      sx={{
                                        width: 60,
                                        height: 60,
                                        border: "2px solid #ddd",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#f5f5f5",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&:hover": {
                                          border: "2px solid #4CAF50",
                                        },
                                      }}
                                      title={t("seasonPlans.viewPage.dailyRemarks.imageTooltip", {
                                        name: image.originalName || image.filename,
                                      })}
                                      onClick={() => window.open(imageUrl, "_blank")}
                                    >
                                      <ThumbnailDisplay imageUrl={imageUrl} />
                                    </Box>
                                  );
                                })}
                                {remark.images.length > 3 && (
                                  <Box
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "#f8f9fa",
                                      borderRadius: 2,
                                      border: "2px solid #e0e0e0",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      fontSize: "0.8rem",
                                      fontWeight: "bold",
                                      color: "#666",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: "#e8f5e8",
                                        border: "2px solid #4CAF50",
                                        transform: "scale(1.05)",
                                      },
                                    }}
                                    onClick={() => {
                                      const extraImage = remark.images[3];
                                      if (extraImage) {
                                        window.open(backendImageUrl(extraImage.filename), "_blank");
                                      }
                                    }}
                                  >
                                    +{remark.images.length - 3}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "2px dashed #dee2e6",
                }}
              >
                <CommentIcon sx={{ fontSize: 48, color: "#6c757d", mb: 1 }} />
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {t("seasonPlans.viewPage.dailyRemarks.emptyTitle")}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {t("seasonPlans.viewPage.dailyRemarks.emptySubtitle")}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => openRemarkDialog()}
                  sx={{ color: "#4CAF50", borderColor: "#4CAF50" }}
                >
                  {t("seasonPlans.viewPage.addFirstRemark")}
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Dialog open={remarkDialogOpen} onClose={resetRemarkState} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRemark
            ? t("seasonPlans.viewPage.dailyRemarks.dialogEditTitle")
            : t("seasonPlans.viewPage.dailyRemarks.dialogAddTitle")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", mb: 2, fontStyle: "italic" }}
            >
              <RequiredAsterisk sx={{ mr: 1, fontSize: "0.8em" }} /> {t("common.indicatesRequired")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t("seasonPlans.viewPage.dailyRemarks.dateLabel")}
                    value={remarkData.date ? dayjs(remarkData.date) : null}
                    onChange={(newValue) =>
                      setRemarkData((prev) => ({
                        ...prev,
                        date: newValue ? newValue.format("YYYY-MM-DD") : "",
                      }))
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        InputLabelProps: {
                          sx: { '& .MuiFormLabel-asterisk': { color: 'error.main' } },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label={t("seasonPlans.viewPage.dailyRemarks.categoryLabel")}
                  value={remarkData.category}
                  onChange={(e) =>
                    setRemarkData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                  InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                >
                  {remarkCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>{category.icon}</span>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("seasonPlans.viewPage.dailyRemarks.descriptionLabel")}
                  value={remarkData.description}
                  onChange={(e) =>
                    setRemarkData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                  InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                  multiline
                  rows={4}
                  placeholder={t(
                    "seasonPlans.viewPage.dailyRemarks.descriptionPlaceholder"
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t("seasonPlans.viewPage.dailyRemarks.attachImages", {
                      optional: t("common.optional"),
                    })}
                  </Typography>
                  <input
                    accept="image/*,.heic,.heif"
                    style={{ display: "none" }}
                    id="remark-image-upload"
                    multiple
                    type="file"
                    onChange={handleRemarkImageUpload}
                  />
                  <label htmlFor="remark-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={
                        uploadingImages ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                      disabled={uploadingImages}
                      sx={{ mr: 1 }}
                    >
                      {uploadingImages
                        ? t("seasonPlans.viewPage.dailyRemarks.uploading")
                        : t("seasonPlans.viewPage.dailyRemarks.uploadImages")}
                    </Button>
                  </label>
                  <Typography variant="caption" color="textSecondary">
                    {t("seasonPlans.viewPage.dailyRemarks.uploadSupport")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="info.main"
                    display="block"
                    sx={{ mt: 0.5, fontSize: "0.7rem" }}
                  >
                    {t("seasonPlans.viewPage.dailyRemarks.uploadHint")}
                  </Typography>
                </Box>

                {remarkImages.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      gutterBottom
                      display="block"
                    >
                      {t("seasonPlans.viewPage.dailyRemarks.selectedImages")}
                    </Typography>
                    <Grid container spacing={1}>
                      {remarkImages.map((imageObj, index) => (
                        <Grid item key={`${imageObj.name}-${index}`}>
                          <Box sx={{ position: "relative", display: "inline-block" }}>
                            {(() => {
                              const sizeMb = (imageObj.size / 1024 / 1024).toFixed(1);
                              const tooltipText = imageObj.isHeic
                                ? t(
                                    "seasonPlans.viewPage.dailyRemarks.heicUploadTooltip",
                                    {
                                      name: imageObj.name,
                                      size: sizeMb,
                                    }
                                  )
                                : t(
                                    "seasonPlans.viewPage.dailyRemarks.noPreviewTooltip",
                                    {
                                      name: imageObj.name,
                                      size: sizeMb,
                                    }
                                  );

                              return imageObj.isHeic || !imageObj.preview ? (
                                <Tooltip title={tooltipText} arrow>
                                  <Box
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: 1,
                                      border: imageObj.isHeic
                                        ? "2px solid #FF9800"
                                        : "1px solid #ddd",
                                      backgroundColor: imageObj.isHeic
                                        ? "#FFF3E0"
                                        : "#f5f5f5",
                                      color: imageObj.isHeic ? "#E65100" : "#666",
                                      fontSize: "0.7rem",
                                      textAlign: "center",
                                      p: 0.5,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Box sx={{ fontSize: "1.2rem", mb: 0.5 }}>
                                      {imageObj.isHeic ? "🍎" : "📷"}
                                    </Box>
                                    <Box
                                      sx={{
                                        fontSize: "0.6rem",
                                        lineHeight: 1,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {imageObj.isHeic ? "HEIC" : "IMG"}
                                    </Box>
                                    <Box sx={{ fontSize: "0.5rem", opacity: 0.7, mt: 0.3 }}>
                                      {sizeMb}MB
                                    </Box>
                                  </Box>
                                </Tooltip>
                              ) : (
                                <Box
                                  component="img"
                                  src={imageObj.preview}
                                  alt={imageObj.name}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: "1px solid #ddd",
                                  }}
                                />
                              );
                            })()}
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                backgroundColor: "error.main",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "error.dark",
                                },
                              }}
                              onClick={() => removeSelectedImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {editingRemark && selectedRemarkImageCount > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      gutterBottom
                      display="block"
                    >
                      {t("seasonPlans.viewPage.dailyRemarks.existingImages", {
                        count: selectedRemarkImageCount,
                      })}
                    </Typography>
                    <Grid container spacing={1}>
                      {remarkData.images
                        .filter((image) => image && image.filename)
                        .map((image) => {
                          const imageUrl = backendImageUrl(image.filename);
                          return (
                            <Grid item key={`existing-${image.filename}`}>
                              <Box sx={{ position: "relative", display: "inline-block" }}>
                                <Box
                                  component="img"
                                  src={imageUrl}
                                  alt={image.originalName || image.filename}
                                  crossOrigin="anonymous"
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: "2px solid #4CAF50",
                                    cursor: "pointer",
                                    backgroundColor: "#f5f5f5",
                                  }}
                                  onClick={() => window.open(imageUrl, "_blank")}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    backgroundColor: "error.main",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "error.dark",
                                    },
                                  }}
                                  onClick={() =>
                                    handleRemoveExistingImage(editingRemark._id, image.filename)
                                  }
                                  disabled={removingImage}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetRemarkState}>{t("common.cancel")}</Button>
          <Button
            variant="contained"
            onClick={saveRemark}
            disabled={
              saving || !remarkData.description.trim()
            }
            sx={{
              background: "linear-gradient(45deg, #4CAF50, #66BB6A)",
              "&:hover": {
                background: "linear-gradient(45deg, #388E3C, #4CAF50)",
              },
            }}
          >
            {saving
              ? t("seasonPlans.viewPage.saving")
              : editingRemark
              ? t("common.update")
              : t("seasonPlans.viewPage.addRemark")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteRemarkDialogOpen}
        onClose={() => setDeleteRemarkDialogOpen(false)}
      >
        <DialogTitle>{t("seasonPlans.viewPage.deleteRemark")}</DialogTitle>
        <DialogContent>
          <Typography>{t("seasonPlans.confirmDeleteMessage")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRemarkDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={confirmDeleteRemark} color="error" variant="contained">
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DailyRemarksSection;
