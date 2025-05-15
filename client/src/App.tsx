import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import Profile from "./pages/Profile";

import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<AuthPage />} />
        </Route>

        {/* Protected routes with sidebar */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="edit-task" element={<EditTask />} />
          <Route path="profile" element={<Profile />} />
    
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
