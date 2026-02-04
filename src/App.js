import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './screen/Signup';
import Home from "./screen/Home";
import Profile from "./screen/Profile";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/login" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }/>

        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}
