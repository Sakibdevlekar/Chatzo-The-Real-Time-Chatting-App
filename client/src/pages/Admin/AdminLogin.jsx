import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { VisibilityRounded, VisibilityOffRounded } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { userNameValidator } from "../../utils/validator";
import { Navigate } from "react-router-dom";

const isAdmin = true;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const userName = useInputValidation("", userNameValidator);
  const password = useInputValidation("");
  const submitHandler = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   if(isAdmin) return <Navigate to="/admin/dashboard"/>
   return (
    <div
      style={{
        background:
          "-webkit-linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E)",
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
              label="Username"
              margin="normal"
              variant="outlined"
              value={userName.value}
              onChange={userName.changeHandler}
            />
            {userName.error && (
              <Typography color="error" variant="caption">
                {userName.error}
              </Typography>
            )}
            <TextField
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              variant="outlined"
              value={password.value}
              onChange={password.changeHandler}
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
            {password.error && (
              <Typography color="error" variant="caption">
                {password.error}
              </Typography>
            )}
            <Button
              sx={{ marginTop: "1rem" }}
              variant="contained"
              color="primary"
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
