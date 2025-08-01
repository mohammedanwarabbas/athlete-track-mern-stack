// description: This code defines a React component for updating user profile information and changing passwords for both user:admin & user:athlete, including form validation and submission handling.
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import {
  Box,
  Button,
  Container,
  TextField,
  IconButton,
  Paper,
  Grid,
  Avatar,
  ButtonGroup,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
// Profile validation schema
const profileSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  name: Yup.string()
    .required("Name is required")
    .max(25, "Name must be 25 characters or less"),
  height: Yup.number().nullable(),
  weight: Yup.number().nullable(),
});
// Password validation schema
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const MotionPaper = motion(Paper);

const UpdateProfile = () => {
  const theme = useTheme();
  const { user, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const profileInitialValues = {
    email: user?.email || "",
    name: user?.name || "",
    height: user?.height || "",
    weight: user?.weight || "",
  };

  const PasswordInitialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/auth/update-profile`,
        values,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      updateUserData(values);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.errorMessage || "update profile failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { confirmPassword, ...passwordData } = values;
      await axios.put(`${API_BASE_URL}/api/auth/update-profile`, passwordData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Password changed successfully");
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.errorMessage || "Password change failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionPaper
        elevation={3}
        sx={{ p: 2, borderRadius: 4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <IconButton sx={{ p: 0 }}>
            <Avatar
              sx={{ width: "5.5rem", height: "5.5rem" }}
              alt={user.name}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=eee&color=000`}
            />
          </IconButton>
        </Box>

        <Box sx={{ mb: 4 }}>
          <ButtonGroup variant="outlined" fullWidth>
            <Button
              variant={activeTab === "profile" ? "contained" : "outlined"}
              onClick={() => setActiveTab("profile")}
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRight:
                  activeTab === "profile"
                    ? "none"
                    : "1px solid rgba(0, 0, 0, 0.23)",
              }}
            >
              Update Profile Info
            </Button>
            <Button
              variant={activeTab === "password" ? "contained" : "outlined"}
              onClick={() => setActiveTab("password")}
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
                borderLeft:
                  activeTab === "password"
                    ? "none"
                    : "1px solid rgba(0, 0, 0, 0.23)",
              }}
            >
              Change Password
            </Button>
          </ButtonGroup>
        </Box>

        {activeTab === "profile" ? (
          <Formik
            key="profile-form"
            initialValues={profileInitialValues}
            validationSchema={profileSchema}
            onSubmit={handleProfileSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Grid container direction={{ xs: "column" }} spacing={2}>
                  <Grid item>
                    <Grid
                      container
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <Grid sx={{ flex: 1 }} item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="email"
                          label="Email"
                          fullWidth
                          margin="normal"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid sx={{ flex: 1 }} item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="name"
                          label="Full Name"
                          fullWidth
                          margin="normal"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {user?.role === "athlete" && (
                    <Grid item>
                      <Grid
                        container
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <Grid sx={{ flex: 1 }} item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="height"
                            label="Height (cm)"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.height && Boolean(errors.height)}
                            helperText={
                              (touched.height && errors.height) || "Optional"
                            }
                          />
                        </Grid>
                        <Grid sx={{ flex: 1 }} item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="weight"
                            label="Weight (kg)"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.weight && Boolean(errors.weight)}
                            helperText={
                              (touched.weight && errors.weight) || "Optional"
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      color="primary"
                      fullWidth
                    >
                      {isSubmitting ? "Updating..." : "Update Profile"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            key="password-form"
            initialValues={PasswordInitialValues}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Grid container direction={{ xs: "column" }} spacing={2}>
                  <Grid item>
                    <Grid
                      container
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <Grid sx={{ flex: 1 }} item xs={12} md={4}>
                        <Field
                          as={TextField}
                          name="currentPassword"
                          label="Current Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          error={
                            touched.currentPassword &&
                            Boolean(errors.currentPassword)
                          }
                          helperText={
                            touched.currentPassword && errors.currentPassword
                          }
                        />
                      </Grid>
                      <Grid sx={{ flex: 1 }} item xs={12} md={4}>
                        <Field
                          as={TextField}
                          name="newPassword"
                          label="New Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          error={
                            touched.newPassword && Boolean(errors.newPassword)
                          }
                          helperText={touched.newPassword && errors.newPassword}
                        />
                      </Grid>
                      <Grid sx={{ flex: 1 }} item xs={12} md={4}>
                        <Field
                          as={TextField}
                          name="confirmPassword"
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      {isSubmitting ? "Changing..." : "Change Password"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </MotionPaper>
    </Container>
  );
};

export default UpdateProfile;
