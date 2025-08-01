// description: This code defines a React component for user:athlete registration in an athlete tracking application, including form validation and submission handling.
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
import exercisingManImage from "../../assets/images/exercising-man.jpg";

// Validation Schema
const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Invalid email format"
    ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  name: Yup.string()
    .required("Name is required")
    .max(25, "Name must be 25 characters or less"),
  height: Yup.number().nullable(),
  weight: Yup.number().nullable(),
});

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  height: "",
  weight: "",
};

const MotionPaper = motion(Paper);
const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...athleteData } = values;
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        athleteData
      );
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "Registration failed");
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
              Athlete Registration
            </Typography>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {/* Email - Full width */}
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                {/* Password Fields - Side by side on desktop */}
                <Box
                  sx={{ display: { xs: "block", md: "flex" }, gap: 2, mt: 2 }}
                >
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
                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    fullWidth
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                </Box>

                {/* Name - Full width */}
                <Field
                  as={TextField}
                  name="name"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                {/* Height/Weight - Side by side on desktop */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Field
                    as={TextField}
                    name="height"
                    label="Height (cm)"
                    type="number"
                    fullWidth
                    error={touched.height && Boolean(errors.height)}
                    helperText={(touched.height && errors.height) || "Optional"}
                  />
                  <Field
                    as={TextField}
                    name="weight"
                    label="Weight (kg)"
                    type="number"
                    fullWidth
                    error={touched.weight && Boolean(errors.weight)}
                    helperText={(touched.weight && errors.weight) || "Optional"}
                  />
                </Box>

                {/* Register Button - Always at bottom */}
                <Box sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </Box>

                {/* Login Link */}
                <Typography align="center" sx={{ mt: 2 }}>
                  Already have an account?{" "}
                  <Button variant="outlined" onClick={() => navigate("/login")}>
                    Login here
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
            backgroundImage: `url(${exercisingManImage})`,
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

export default Register;
