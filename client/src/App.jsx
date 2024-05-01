import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth.reducer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import ProtectRoute from "./auth/ProtectRoute";
import { Loaders } from "./components/Layout/Loaders";
import Dashboard from "./pages/Admin/Dashboard";
import { server } from "./constant/config";
import { Toaster } from "react-hot-toast";
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/Admin/GroupManagement"));
const MessageManagement = lazy(() => import("./pages/Admin/MessageManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/user/me`,{withCredentials: true,})
      .then(({ data }) => dispatch(userExists(data)))
      .catch((err) => dispatch(userNotExists()));
  }, []);

  return loader ? (
    <Loaders />
  ) : (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loaders />}>
          <Routes>
            <Route element={<ProtectRoute user={user} />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/users-management"
              element={<UserManagement />}
            />
            <Route
              path="/admin/chats-management"
              element={<ChatManagement />}
            />
            <Route
              path="/admin/messages-management"
              element={<MessageManagement />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center"/>
      </BrowserRouter>
    </>
  );
}

export default App;
