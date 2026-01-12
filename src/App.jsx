import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EntryReview from './pages/EntryReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entry/:id" element={<EntryReview />} />
          {/* Redirect generic entry to a specific one for demo */}
          <Route path="/entry/current" element={<Navigate to="/entry/w-2026-01" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
