import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import AddTask from "./pages/task/AddTask";
import EditTask from "./pages/task/EditTask";
import Profile from "./pages/profile/Profile";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/Store";
import { useEffect } from "react";
import { fetchUserData } from "./redux/features/authSlice";
import ProtectedRoute from "./protectedRoute/protectedRoute";

// Create a hook that uses AppDispatch type
const useAppDispatch = () => useDispatch<AppDispatch>();

function App() {
  const { user } = useSelector((state: RootState) => state?.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
    
          
        <Route element={<ProtectedRoute user={!user} redirect="/dashboard"/>}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes with sidebar */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="edit-task/:id" element={<EditTask />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
