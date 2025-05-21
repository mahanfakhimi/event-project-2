// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAdminStats } from "../api/admin";
import { useUser } from "../api/auth";
import UsersTab from "../components/admin/UsersTab";
import PollsTab from "../components/admin/PollsTab";
import StatsTab from "../components/admin/StatsTab";

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentTab, setCurrentTab] = useState(0);
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useAdminStats();
  const { data: user } = useUser();

  useEffect(() => {
    if (currentTab === 2) {
      refetchStats();
    }
  }, [currentTab, refetchStats]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div className="max-w-[1200px] w-full mx-auto mt-8 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <p className="text-center mb-4 text-xl md:text-2xl">
              پنل مدیریت - خوش اومدی {user?.name}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                centered={!isMobile}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 3,
                  "& .MuiTab-root": {
                    fontSize: "1rem",
                    fontWeight: "medium",
                  },
                }}
              >
                <Tab label="کاربران" />
                <Tab label="نظرسنجی‌ ها" />
                <Tab label="آمار" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {currentTab === 0 && <UsersTab />}
                {currentTab === 1 && <PollsTab />}
                {currentTab === 2 && (
                  <StatsTab stats={stats} loading={statsLoading} />
                )}
              </Box>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
