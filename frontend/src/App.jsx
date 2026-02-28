import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import AddProblem from "./page/AddProblem";
import ProblemPage from "./page/ProblemPage";
import LandingPage from "./page/LandingPage";
import PlaylistPage from "./page/PlaylistPage";
import PlaylistDetailPage from "./page/PlaylistDetailPage";
import Layout from "./layout/Layout";
import AdminRoute from "./Components/AdminRoute";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes Wrapped in Layout */}
        <Route element={<Layout />}>
          <Route
            path="/home"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/problems"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/playlists"
            element={authUser ? <PlaylistPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/problem/:id"
            element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/playlists/:id"
            element={authUser ? <PlaylistDetailPage /> : <Navigate to="/login" />}
          />

          {/* Admin Only */}
          <Route element={<AdminRoute />}>
            <Route path="/add-problem" element={<AddProblem />} />
          </Route>
        </Route>

        {/* Auth Pages */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/home" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;