// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { usePoll, usePollResults, useSubmitVote } from "../api/polls";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toJalali } from "../utils/date";

const PollDetails = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.3,
    initial: true,
  });

  const { data: poll, isLoading: pollLoading } = usePoll(id);
  const { data: results, isLoading: resultsLoading } = usePollResults(id);
  const { mutate: submitVote, isPending: isSubmitting } = useSubmitVote();

  useEffect(() => {
    if (poll?.hasVoted) {
      setShowResults(true);
      setSelectedOption(poll.userVote);
    }
  }, [poll]);

  const handleVote = () => {
    if (selectedOption === null) return;

    submitVote(
      { pollId: id, optionIndex: selectedOption },
      {
        onSuccess: () => {
          setShowResults(true);
        },
      }
    );
  };

  if (pollLoading || resultsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <CircularProgress />
      </motion.div>
    );
  }

  if (!poll) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert severity="error" className="mt-4">
          نظرسنجی مورد نظر یافت نشد
        </Alert>
      </motion.div>
    );
  }

  const isActive = poll.isActive && new Date() <= new Date(poll.endDate);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="shadow-sm p-4 rounded-md"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-3xl"
        >
          {poll.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-gray-500"
        >
          {poll.description}
        </motion.p>

        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <Alert severity="error" className="mb-4">
              این نظرسنجی به پایان رسیده است
            </Alert>
          </motion.div>
        )}

        {poll.hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <Alert severity="info" className="mb-4">
              شما در این نظرسنجی شرکت کرده‌اید
            </Alert>
          </motion.div>
        )}

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-2"
            >
              گزینه مورد نظر خود را انتخاب کنید:
            </motion.p>

            <RadioGroup
              value={selectedOption}
              onChange={(e) => setSelectedOption(Number(e.target.value))}
            >
              {poll.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                  }
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <FormControlLabel
                    value={index}
                    control={<Radio />}
                    label={option.text}
                    disabled={!isActive || poll.hasVoted}
                  />
                </motion.div>
              ))}
            </RadioGroup>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1 }}
              className="flex justify-center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleVote}
                disabled={
                  selectedOption === null ||
                  !isActive ||
                  isSubmitting ||
                  poll.hasVoted
                }
                className="mt-4"
                sx={{ px: 16, borderRadius: 50 }}
              >
                {isSubmitting ? "در حال ثبت رأی..." : "ثبت رأی"}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4 text-2xl"
            >
              نتایج نظرسنجی
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ delay: 0.8 }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.options}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="text" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              {results.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <p>
                    {option.text}
                    {poll.hasVoted && poll.userVote === index && " (رأی شما)"}
                  </p>

                  <p>
                    {option.votes} رأی ({option.percentage}%)
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-between mt-2"
        >
          <p className="mt-4 text-gray-500">
            تعداد کل آراء: {results.totalVotes}
          </p>

          <p className="block mt-6 text-gray-500">
            تاریخ پایان: {toJalali(poll.endDate)}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PollDetails;
