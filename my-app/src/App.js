// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SellReservePage from "./pages/SellReservePage";
import BuyReservePage from "./pages/BuyReservePage";
import CancelPage from "./pages/CancelPage";

function App() {
  // 簡易的な「ログイン中ユーザー名」
  const [currentUserName, setCurrentUserName] = useState("");

  // 全予約データ（本当はサーバーやFirestoreに保存する）
  const [reservations, setReservations] = useState([]);

  const handleAddReservation = (newReservation) => {
    setReservations((prev) => [...prev, newReservation]);
  };

  const handleCancelReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
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
          element={<MenuPage currentUserName={currentUserName} />}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
