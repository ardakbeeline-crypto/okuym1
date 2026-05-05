import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Results from "./pages/Results";
import AdminPanel from "./pages/AdminPanel";
import Statistics from "./pages/Statistics";
import Theory from "./pages/Theory";
import Layout from "./components/Layout";

// Настройка axios
axios.defaults.baseURL = "https://okuym1-o66x.onrender.com/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register onRegister={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Защищенные маршруты */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/simulation/:simulationId"
            element={
              user ? <Simulation user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/results/:simulationId"
            element={user ? <Results user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/*"
            element={
              user?.role === "admin" ? (
                <AdminPanel user={user} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Route>
        <Route
          path="/statistics"
          element={user ? <Statistics user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/theory"
          element={user ? <Theory /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
