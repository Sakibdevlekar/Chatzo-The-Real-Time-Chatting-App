import { useInputValidation } from "6pp";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import { userNameValidator } from "../../utils/validator";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const secretKey = useInputValidation("", userNameValidator);
  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Add your login logic here
    dispatch(adminLogin(secretKey.value));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right top, #ea7070, #e97393, #de7db3, #c98acd, #ad98de, #ad98de, #ad98de, #ad98de, #c98acd, #de7db3, #e97393, #ea7070)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Admin Login</Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="Secret Key"
              type={showPassword ? "text" : "password"}
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <VisibilityRounded />
                    ) : (
                      <VisibilityOffRounded />
                    )}
                  </IconButton>
                ),
              }}
            />
            <Button
              sx={{
                marginTop: "1rem",
                backgroundColor: "#ea7070",
                ":hover": { bgcolor: "#FF6D6D" },
              }}
              variant="contained"
              type="submit"
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
