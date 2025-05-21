// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import {
  People as PeopleIcon,
  Poll as PollIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  HowToVote as VoteIcon,
} from "@mui/icons-material";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 3,
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const StatsTab = ({ stats, loading }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const statItems = [
    {
      title: "کل کاربران",
      value: stats?.totalUsers || 0,
      icon: <PeopleIcon sx={{ fontSize: 30 }} />,
      color: "primary",
    },
    {
      title: "کل نظرسنجی‌ها",
      value: stats?.totalPolls || 0,
      icon: <PollIcon sx={{ fontSize: 30 }} />,
      color: "secondary",
    },
    {
      title: "نظرسنجی‌های فعال",
      value: stats?.activePolls || 0,
      icon: <VoteIcon sx={{ fontSize: 30 }} />,
      color: "success",
    },
    {
      title: "کاربران تایید شده",
      value: stats?.verifiedUsers || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
      color: "info",
    },
    {
      title: "کاربران ادمین",
      value: stats?.adminUsers || 0,
      icon: <AdminIcon sx={{ fontSize: 30 }} />,
      color: "warning",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsTab;
