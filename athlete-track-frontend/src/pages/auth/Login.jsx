// description: This code defines a React component for the login page of an athlete or admin, including form validation, submission handling, and redirection based on user role.
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import exercisingManImage2 from "../../assets/images/exercising-man-2.jpg";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Invalid email format"
    ),
  password: Yup.string().required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const MotionPaper = motion(Paper);

const Login = () => {
  const theme = useTheme();
  const { setAuthData, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectPath =
        user?.role === "admin" ? "/admin/dashboard" : "/athlete/dashboard";
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { email, password } = values;
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      setAuthData(res.data.user, res.data.token); // Store in context
      toast.success("Login successful!");
      navigate(
        res.data.user.role === "admin"
          ? "/admin/dashboard"
          : "/athlete/dashboard"
      );
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionPaper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          borderRadius: 4,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side Box - Form */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" component="h1" textAlign="center">
              Athlete/Admin Login
            </Typography>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Box sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing In..." : "Login"}
                  </Button>
                </Box>

                {/* Register Link */}
                <Typography align="center" sx={{ mt: 2 }}>
                  Don't have an account?{" "}
                  <Button onClick={() => navigate("/register")}>
                    Register here
                  </Button>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>

        {/* Right Side Box - Image */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${exercisingManImage2})`,
            backgroundPosition: "center 25%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: 2,
            overflow: "hidden",
            minHeight: 0,
          }}
        ></Box>
      </MotionPaper>
    </Container>
  );
};

export default Login;
