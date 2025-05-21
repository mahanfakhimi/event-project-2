// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Box, Grid, CircularProgress } from "@mui/material";
import {
  People as PeopleIcon,
  Poll as PollIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  HowToVote as VoteIcon,
} from "@mui/icons-material";

const StatCard = ({ title, value, icon, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.2, // هر کارت با 0.2 ثانیه تاخیر نسبت به قبلی
      }}
    >
      <div className="text-center flex items-center justify-center flex-col">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <p className="text-5xl">{value}</p>
        <p className="text-gray-500">{title}</p>
      </div>
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
    <motion.div
      className="flex flex-wrap gap-24 justify-center items-center"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {statItems.map((item, index) => (
        <StatCard key={item.title} {...item} index={index} />
      ))}
    </motion.div>
  );
};

export default StatsTab;
