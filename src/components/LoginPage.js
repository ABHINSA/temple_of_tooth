import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, authenticateWithPassword } from "../actions/authActions";
import { Box, Card, Container, Typography, Tabs, Tab, TextField, Divider, Link } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/1131-2332.jpg";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceNo, setServiceNo] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState(0);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    const storedUserData = localStorage.getItem("userData");

    if (isAuthenticated && storedUserData) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
  };

  const handlePhoneSubmit = () => {
    const trimmedPhoneNumber = phoneNumber.trim();

    let phoneWithoutPlus;
    if (trimmedPhoneNumber.startsWith('+')) {
      phoneWithoutPlus = trimmedPhoneNumber.slice(1);
    } else {
      phoneWithoutPlus = trimmedPhoneNumber;
    }

    if (!phoneWithoutPlus.startsWith('94')) {
      alert("Please enter a valid phone number starting with +94 or 94.");
      return;
    }

    dispatch(authenticate(trimmedPhoneNumber))
      .then((response) => {
        if (response.success) {
          navigate("/verify", {
            state: {
              phoneNumber: trimmedPhoneNumber,
              sentOtp: response.data
            }
          });
        } else {
          const alternateFormat = trimmedPhoneNumber.startsWith('+')
            ? trimmedPhoneNumber.slice(1)
            : '+' + trimmedPhoneNumber;

          dispatch(authenticate(alternateFormat))
            .then((altResponse) => {
              if (altResponse.success) {
                navigate("/verify", {
                  state: {
                    phoneNumber: trimmedPhoneNumber,
                    sentOtp: altResponse.data
                  }
                });
              } else {
                alert("Invalid phone number. Please try again.");
              }
            });
        }
      })
      .catch((err) => console.error("Unexpected error:", err));
  };

  const handlePasswordSubmit = () => {
    if (!serviceNo.trim()) {
      alert("Please enter your User ID / Service Number.");
      return;
    }
    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    dispatch(authenticateWithPassword(serviceNo.trim(), password))
      .then((response) => {
        if (response.success) {
          localStorage.setItem("userData", JSON.stringify(response.data));
          localStorage.setItem("serviceNo", serviceNo.trim());
          navigate("/home");
        } else {
          alert(response.error?.message || "Invalid credentials. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Unexpected error:", err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
            padding: "48px 40px",
            maxWidth: 420,
            width: "100%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "24px",
                color: "#001a4d",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Sign in to your account
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={loginMethod}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              "& .MuiTabs-indicator": {
                height: "3px",
                backgroundColor: "#0049AF",
              },
              "& .MuiTab-root": {
                fontSize: "13px",
                fontWeight: 600,
                color: "#999",
                textTransform: "uppercase",
                "&.Mui-selected": {
                  color: "#0049AF",
                },
              },
            }}
          >
            <Tab label="Phone OTP" />
            <Tab label="User ID" />
          </Tabs>

          {/* Phone OTP Login */}
          {loginMethod === 0 && (
            <>
              <Box mb={3}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 1.5,
                    color: "#555",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                >
                  Mobile Number
                </Typography>
                <PhoneInput
                  country={"lk"}
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "60px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    border: "2px solid #e0e0e0",
                    transition: "border-color 0.3s",
                  }}
                  buttonStyle={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                  }}
                />
              </Box>

              <LoadingButton
                onClick={handlePhoneSubmit}
                loading={loading}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#0049AF",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#003580",
                  },
                }}
              >
                Send OTP
              </LoadingButton>

              <Divider sx={{ my: 2, opacity: 0.5 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                  Didn't receive OTP?{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "#0049AF",
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Request Again
                  </Link>
                </Typography>
                <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    sx={{
                      color: "#0049AF",
                      fontWeight: 700,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Register Here
                  </Link>
                </Typography>
              </Box>
            </>
          )}

          {/* User ID/Password Login */}
          {loginMethod === 1 && (
            <>
              <Box mb={2.5}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "#555",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                >
                  User ID / Service Number
                </Typography>
                <TextField
                  value={serviceNo}
                  onChange={(e) => setServiceNo(e.target.value)}
                  fullWidth
                  placeholder="Enter your user ID"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#0049AF",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0049AF",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Box>

              <Box mb={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#555",
                      fontWeight: 600,
                      fontSize: "12px",
                    }}
                  >
                    Password
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#0049AF",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder="Enter your password"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#0049AF",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0049AF",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Box>

              <LoadingButton
                onClick={handlePasswordSubmit}
                loading={loading}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#0049AF",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#003580",
                  },
                }}
              >
                Login
              </LoadingButton>

              <Divider sx={{ my: 2, opacity: 0.5 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                  Didn't receive OTP?{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "#0049AF",
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Request Again
                  </Link>
                </Typography>
                <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    sx={{
                      color: "#0049AF",
                      fontWeight: 700,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Register Here
                  </Link>
                </Typography>
              </Box>
            </>
          )}

          {/* Error Message */}
          {error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
              }}
            >
              <Typography
                sx={{
                  color: "#c33",
                  fontSize: "12px",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {error.message || "An error occurred. Please try again."}
              </Typography>
            </Box>
          )}

          {/* Footer Info */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontSize: "11px",
                display: "block",
              }}
            >
              Secure Login • Protected by SSL Encryption
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
