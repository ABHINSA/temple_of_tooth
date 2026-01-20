import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Box, Typography, TextField, Snackbar, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resendOtp } from "../actions/authActions";

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [resendLoading, setResendLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState(location.state?.sentOtp || "");
  const inputRefs = useRef([]);
  const { phoneNumber, userData } = location.state || {};
  const [showResendTimer, setShowResendTimer] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);

  // Redirect if accessed without phone number
  useEffect(() => {
    if (!phoneNumber || !sentOtp) {
      toast.error("Invalid access. Redirecting to login.");
      navigate("/login", { replace: true });
    }
  }, [phoneNumber, sentOtp, navigate]);

  // OTP expiry timer
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsBlocked(true);
            setSnackbar({
              open: true,
              message: "OTP time expired. Please request a new OTP.",
              severity: "error",
            });
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isTimerActive]);

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Submit OTP for verification
  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp || enteredOtp !== sentOtp) {
      setSnackbar({
        open: true,
        message: "Invalid OTP. Please try again.",
        severity: "error",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "OTP Verified Successfully!",
        severity: "success",
      });
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("sentOtp", sentOtp);
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/home", { state: { phoneNumber, userData: userData?.ResultSet || null } });
    }, 2000);
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true);
    setShowResendTimer(false);
    setResendTimer(30);
    try {
      const response = await dispatch(resendOtp(phoneNumber));
      if (response.success) {
        setTimer(90);
        setIsBlocked(false);
        setOtp(["", "", "", "", ""]);
        setSnackbar({
          open: true,
          message: "OTP has been resent successfully.",
          severity: "success",
        });
        setSentOtp(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.error?.message || "Failed to resend OTP.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error during resend OTP:", err);
      setSnackbar({
        open: true,
        message: "Unexpected error. Please try again.",
        severity: "error",
      });
    } finally {
      setResendLoading(false);
      const resendCountdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(resendCountdown);
            setShowResendTimer(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        zIndex: 1,
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, #FFD700, #FFA500)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, rgb(1, 28, 78), rgb(37, 85, 168))",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: "320px", sm: "400px" },
          padding: { xs: "8px", sm: "16px" },
        }}
      >
        <Card
          sx={{
            borderRadius: { xs: 2, sm: 4 },
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            padding: { xs: 2, sm: 4 },
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              Verify OTP
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" mt={1}>
              Enter the OTP sent to {phoneNumber}
            </Typography>
          </Box>

          {/* OTP Input Fields */}
          <Box display="flex" justifyContent="space-between" mb={3}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  disabled: isBlocked,
                }}
                sx={{
                  width: "50px",
                  textAlign: "center",
                  '& input': { textAlign: 'center' },
                }}
                inputRef={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </Box>

          {/* Timer Display */}
          <Box textAlign="center" mb={2}>
            {isTimerActive && timer > 0 ? (
              <Typography variant="body2" color="textSecondary">
                Time left: {formatTime(timer)}
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                OTP expired. Please request a new one.
              </Typography>
            )}
          </Box>

          {/* Verify Button */}
          <Box>
            <LoadingButton
              onClick={handleOtpSubmit}
              loading={loading}
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "#0049AF",
                textTransform: "capitalize",
                borderRadius: 3,
                mb: 2,
              }}
              disabled={isBlocked}
            >
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 400 }}>
                Verify OTP
              </span>
            </LoadingButton>

            {/* Resend OTP Button */}
            {isBlocked && showResendTimer && (
              <LoadingButton
                onClick={handleResendOtp}
                loading={resendLoading}
                variant="outlined"
                sx={{
                  width: "100%",
                  textTransform: "capitalize",
                  borderRadius: 3,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 400 }}>Resend OTP</span>
              </LoadingButton>
            )}
            {!showResendTimer && (
              <Typography variant="body2" color="textSecondary" textAlign="center">
                You can resend OTP in {resendTimer} seconds.
              </Typography>
            )}
          </Box>
        </Card>

        {/* Snackbar for displaying alerts */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Verification;
