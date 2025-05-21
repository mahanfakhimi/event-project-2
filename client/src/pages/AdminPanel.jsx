// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useState } from "react";
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
import UsersTab from "../components/admin/UsersTab";
import PollsTab from "../components/admin/PollsTab";
import StatsTab from "../components/admin/StatsTab";

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentTab, setCurrentTab] = useState(0);
  const { data: stats, isLoading: statsLoading } = useAdminStats();

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textAlign: "center",
              mb: 4,
            }}
          >
            پنل مدیریت
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
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
              <Tab label="نظرسنجی‌ها" />
              <Tab label="آمار" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {currentTab === 0 && <UsersTab />}
              {currentTab === 1 && <PollsTab />}
              {currentTab === 2 && (
                <StatsTab stats={stats} loading={statsLoading} />
              )}
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AdminPanel;
