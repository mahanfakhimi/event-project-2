// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router";
import {
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useSendRegistrationOTP, useVerifyRegistrationOTP } from "../api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";

const registerSchema = z
  .object({
    username: z
      .string()
      .nonempty("نام کاربری الزامی است")
      .min(3, "نام کاربری باید حداقل 3 کاراکتر باشد"),
    name: z
      .string()
      .nonempty("نام الزامی است")
      .min(2, "نام باید حداقل 2 کاراکتر باشد"),
    email: z.string().nonempty("ایمیل الزامی است").email("ایمیل نامعتبر است"),
    password: z
      .string()
      .nonempty("رمز عبور الزامی است")
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
    confirmPassword: z.string().nonempty("تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  otp: z
    .string()
    .nonempty("کد تایید الزامی است")
    .length(6, "کد تایید باید 6 رقم باشد"),
});

const Register = () => {
  const navigate = useNavigate();
  const sendOTPMutation = useSendRegistrationOTP();
  const verifyOTPMutation = useVerifyRegistrationOTP();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmitStep1 = async (data) => {
    try {
      await sendOTPMutation.mutateAsync(data.email);
      setStep1Data(data);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitStep2 = async (data) => {
    if (!step1Data) return;

    try {
      await verifyOTPMutation.mutateAsync({
        email: step1Data.email,
        otp: data.otp,
        password: step1Data.password,
        name: step1Data.name,
        username: step1Data.username,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const steps = ["اطلاعات کاربری", "تایید کد"];

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-[500px] w-full">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              ثبت نام
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </motion.div>

          {(sendOTPMutation.isError || verifyOTPMutation.isError) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
            >
              <Alert severity="error">
                {sendOTPMutation.error?.response?.data?.error ||
                  verifyOTPMutation.error?.response?.data?.error ||
                  "خطا در ثبت نام"}
              </Alert>
            </motion.div>
          )}

          {step === 1 ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmitStep1(onSubmitStep1)}
            >
              {[
                { name: "username", label: "نام کاربری", type: "text" },
                { name: "name", label: "نام و نام خانوادگی", type: "text" },
                { name: "email", label: "ایمیل", type: "email" },
                { name: "password", label: "رمز عبور", type: "password" },
                {
                  name: "confirmPassword",
                  label: "تکرار رمز عبور",
                  type: "password",
                },
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ x: 50, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                  }
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type}
                    margin="normal"
                    error={!!errorsStep1[field.name]}
                    helperText={errorsStep1[field.name]?.message}
                    {...registerStep1(field.name)}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 1.1 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={sendOTPMutation.isLoading}
                  sx={{ mt: 2 }}
                >
                  {sendOTPMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "ارسال کد تایید"
                  )}
                </Button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmitStep2(onSubmitStep2)}
            >
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ delay: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="کد تایید"
                  margin="normal"
                  error={!!errorsStep2.otp}
                  helperText={errorsStep2.otp?.message}
                  {...registerStep2("otp")}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={verifyOTPMutation.isLoading}
                  sx={{ mt: 2 }}
                >
                  {verifyOTPMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "تایید کد"
                  )}
                </Button>
              </motion.div>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
              >
                قبلا ثبت نام کرده‌اید - وارد شوید
              </Link>
            </Box>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
