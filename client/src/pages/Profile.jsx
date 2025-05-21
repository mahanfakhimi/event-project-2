// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { useNavigate, Link as RouterLink } from "react-router";
import { Button, Chip } from "@mui/material";
import { useLogout, useUser } from "../api/auth";
import { useUserVotedPolls } from "../api/polls";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { useRef } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data: votedPolls } = useUserVotedPolls();
  const { data: user } = useUser();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (error) {
      console.error("خطا در خروج از سیستم:", error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[800px] mx-auto w-full pt-16 px-4 pb-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-4 py-4">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg leading-6 font-medium text-gray-900"
          >
            اطلاعات حساب کاربری
          </motion.h3>

          <div className="mt-4 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              {[
                { label: "نام و نام خانوادگی", value: user.name },
                { label: "ایمیل", value: user.email },
                { label: "نام کاربری", value: user.username },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: 50, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                  }
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="py-4 flex items-center justify-between"
                >
                  <dt className="text-sm font-medium text-gray-500">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-gray-900">{item.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bg-gray-50 px-4 pb-4">
          <div className="flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                sx={{ px: 5, borderRadius: 50 }}
                color="error"
              >
                خروج از حساب کاربری
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9 }}
          className="text-2xl mb-4"
        >
          نظرسنجی های شرکت شده
        </motion.p>

        {votedPolls?.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 }}
          >
            شما هنوز در هیچ نظرسنجی شرکت نکرده‌ اید
          </motion.p>
        ) : (
          <div className="space-y-4">
            {votedPolls?.map((poll, index) => (
              <motion.div
                key={poll._id}
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{
                  delay: 1 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <div className="h-full p-4 shadow-sm rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 text-2xl">{poll.title}</p>

                    <Chip
                      label={poll.isActive ? "فعال" : "پایان یافته"}
                      color={poll.isActive ? "success" : "default"}
                      size="small"
                    />
                  </div>

                  <p className="mb-4 text-gray-500">{poll.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <p>گزینه انتخاب شده: {poll.options[poll.userVote].text}</p>

                    <p>
                      تاریخ شرکت:{" "}
                      {format(new Date(poll.votedAt), "PPP", { locale: faIR })}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-gray-500">
                      تاریخ پایان:{" "}
                      {format(new Date(poll.endDate), "PPP", { locale: faIR })}
                    </p>

                    <Button
                      component={RouterLink}
                      to={`/polls/${poll._id}`}
                      variant="contained"
                      color="primary"
                      sx={{ px: 5, borderRadius: 50 }}
                    >
                      مشاهده
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
