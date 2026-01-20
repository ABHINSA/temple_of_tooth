import React, { useState } from "react";
import { Box, Card, Container, Typography, TextField, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";

const RegisterPage = () => {
  const [form, setForm] = useState({
    ServiceNo: "",
    Name: "",
    MobileNo: "",
    company: "",
    role: "A",
    status: "A",
    Location: "DM",
    SLocation: "",
    password: "",
    qr: "N"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "https://daladamaligawa.dockyardsoftware.com/UserRegister/PostUserDetails",
        [form]
      );
      if (response.data && response.data.success) {
        setSuccess("Registration successful!");
        setForm({
          ServiceNo: "",
          Name: "",
          MobileNo: "",
          company: "",
          role: "A",
          status: "A",
          Location: "DM",
          SLocation: "",
          password: "",
          qr: "N"
        });
      } else {
        setError("Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
        padding: 2,
      }}
    >
      <Card sx={{ borderRadius: 5, boxShadow: 8, padding: 4, maxWidth: 500 }}>
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" fontWeight={600}>
            User Registration
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1}>
            Fill in your details to register
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Service Number"
            name="ServiceNo"
            value={form.ServiceNo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Full Name"
            name="Name"
            value={form.Name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mobile Number"
            name="MobileNo"
            value={form.MobileNo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Location"
            name="Location"
            value={form.Location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box mt={2}>
            <LoadingButton
              type="submit"
              loading={loading}
              variant="contained"
              sx={{ width: "100%", backgroundColor: "#0049AF", borderRadius: 3 }}
            >
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 400 }}>
                Register
              </span>
            </LoadingButton>
          </Box>
          {error && (
            <Typography color="error" mt={2} textAlign="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" mt={2} textAlign="center">
              {success}
            </Typography>
          )}
        </form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
