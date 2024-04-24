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
import { CameraAlt as CameraIcon } from "@mui/icons-material";
import { VisualHiddenInput } from "../components/Styles/StyledComponents";
import { VisibilityRounded, VisibilityOffRounded } from "@mui/icons-material";
import { useInputValidation, useStrongPassword, useFileHandler } from "6pp";
import { useState } from "react";
import { userNameValidator } from "../utils/validator";
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => {
    setIsLogin((perv) => !perv);
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const userName = useInputValidation("", userNameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const handleLogin = async (e) => {
    e.preventDefault();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        background:
          "-webkit-linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E)" /* Chrome 10-25, Safari 5.1-6 */,
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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
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
                <Typography textAlign={"center"} margin={"1rem"}>
                  {/*  eslint-disable-next-line react/no-unescaped-entities */}
                  Don't have an account?
                </Typography>
                <Button
                  variant="text"
                  type="submit"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Register
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Register</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleRegister}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                    component="label"
                  >
                    <CameraIcon />
                    <VisualHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    margin={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
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
                  label="Boi"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
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
                  Register
                </Button>
                <Typography textAlign={"center"} margin={"1rem"}>
                  Already have an account?
                </Typography>
                <Button
                  variant="text"
                  type="submit"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
