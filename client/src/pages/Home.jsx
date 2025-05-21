// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { Link as RouterLink } from "react-router";
import { Typography, Button, Chip } from "@mui/material";
import { usePolls } from "../api/polls";
import { toJalali } from "../utils/date";
import { useRef } from "react";

const Home = () => {
  const { data: polls } = usePolls();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.3,
    initial: true,
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 w-full"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-800 mb-4 text-3xl"
        >
          نظرسنجی‌های فعال
        </motion.p>

        {polls?.map((poll, index) => (
          <motion.div
            key={poll._id}
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="h-full p-4 shadow-sm rounded-md mb-4"
          >
            <div className="flex justify-between items-start mb-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-gray-800 text-2xl"
              >
                {poll.title}
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Chip
                  label={poll.isActive ? "فعال" : "پایان یافته"}
                  color={poll.isActive ? "success" : "default"}
                  size="small"
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="mb-4 text-gray-500"
            >
              {poll.description}
            </motion.p>

            <div className="flex justify-between items-center mt-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  تاریخ پایان: {toJalali(poll.endDate)}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={RouterLink}
                  to={`/polls/${poll._id}`}
                  variant="contained"
                  color="primary"
                  sx={{ px: 5, borderRadius: 50 }}
                >
                  مشاهده و شرکت
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
