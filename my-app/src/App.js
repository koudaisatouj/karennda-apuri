// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SellReservePage from "./pages/SellReservePage";
import BuyReservePage from "./pages/BuyReservePage";
import CancelPage from "./pages/CancelPage";
import AccountEditPage from "./pages/AccountEditPage";
import AdminPage from "./pages/AdminPage"; 

function App() {
  // ????????????????
  const [currentUserName, setCurrentUserName] = useState("");

  // ???????????????Firestore??????
  const [reservations, setReservations] = useState(() => {
    try {
      const stored = localStorage.getItem("reservations");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to load reservations from storage", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  const handleAddReservation = (newReservation) => {
    setReservations((prev) => [...prev, newReservation]);
  };

  const handleCancelReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateReservation = (updated) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginPage setCurrentUserName={setCurrentUserName} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/menu"
          element={
            <MenuPage
              currentUserName={currentUserName}
              setCurrentUserName={setCurrentUserName}
              reservations={reservations}
            />
          }
        />
        <Route
          path="/reserve/sell"
          element={
            <SellReservePage
              currentUserName={currentUserName}
              reservations={reservations}
              onAddReservation={handleAddReservation}
            />
          }
        />
        <Route
          path="/reserve/buy"
          element={
            <BuyReservePage
              currentUserName={currentUserName}
              onAddReservation={handleAddReservation}
            />
          }
        />
        <Route
          path="/reserve/cancel"
          element={
            <CancelPage
              currentUserName={currentUserName}
              reservations={reservations}
              onCancelReservation={handleCancelReservation}
            />
          }
        />
        <Route
          path="/account/edit"
          element={
            <AccountEditPage
              currentUserName={currentUserName}
              setCurrentUserName={setCurrentUserName}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              reservations={reservations}
              onUpdateReservation={handleUpdateReservation}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
