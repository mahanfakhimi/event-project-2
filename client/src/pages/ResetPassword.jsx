import { useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Box,
} from "@mui/material";
import { useResetPassword } from "../api/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }
    resetPassword(
      { token, password: formData.password },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-6">
            <Alert severity="error">لینک بازیابی رمز عبور نامعتبر است.</Alert>
            <Box className="text-center">
              <Link
                component={RouterLink}
                to="/login"
                className="text-blue-600 hover:text-blue-800"
              >
                بازگشت به صفحه ورود
              </Link>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          <Typography variant="h5" component="h1" className="text-center">
            تنظیم رمز عبور جدید
          </Typography>

          {error && (
            <Alert severity="error" className="mt-4">
              {error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="رمز عبور جدید"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="تکرار رمز عبور جدید"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending}
              className="mt-6"
            >
              {isPending ? "در حال تنظیم رمز عبور..." : "تنظیم رمز عبور"}
            </Button>

            <Box className="text-center mt-4">
              <Link
                component={RouterLink}
                to="/login"
                className="text-blue-600 hover:text-blue-800"
              >
                بازگشت به صفحه ورود
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
