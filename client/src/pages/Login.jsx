// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { useLogin } from "../api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";

const loginSchema = z.object({
  email: z.string().nonempty("ایمیل الزامی است").email("ایمیل نامعتبر است"),
  password: z
    .string()
    .nonempty("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
});

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "wmkdgywkh@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center p-8 h-screen">
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
              ورود به سیستم
            </Typography>
          </motion.div>

          {loginMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <Alert severity="error">
                {loginMutation.error?.response?.data?.error ||
                  "خطا در ورود به سیستم"}
              </Alert>
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {[
              { name: "email", label: "ایمیل", type: "email" },
              { name: "password", label: "رمز عبور", type: "password" },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  margin="normal"
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  {...register(field.name)}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7 }}
            >
              <Box
                sx={{
                  mt: 2,
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  color="primary"
                >
                  فراموشی رمز عبور
                </Link>

                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  color="primary"
                >
                  حساب کاربری ندارید - ثبت نام کنید
                </Link>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "ورود"
                )}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
