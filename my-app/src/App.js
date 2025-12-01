// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import SellReservePage from "./pages/SellReservePage";
import BuyReservePage from "./pages/BuyReservePage";
import CancelPage from "./pages/CancelPage";
import AccountEditPage from "./pages/AccountEditPage";
import AdminPage from "./pages/AdminPage";
import ReservationListPage from "./pages/ReservationListPage";
import UserReservationListPage from "./pages/UserReservationListPage";
import "./App.css";

function App() {
  const [currentUserName, setCurrentUserName] = useState(() => {
    return localStorage.getItem("currentUserName") || "";
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem("reservations");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("予約データの読み込みに失敗しました", err);
      return [];
    }
  });

  const [holidays, setHolidays] = useState(() => {
    try {
      const saved = localStorage.getItem("holidays");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("休日データの読み込みに失敗しました", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("reservations", JSON.stringify(reservations));
    } catch (err) {
      console.error("予約データの保存に失敗しました", err);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem("holidays", JSON.stringify(holidays));
    } catch (err) {
      console.error("休日データの保存に失敗しました", err);
    }
  }, [holidays]);

  useEffect(() => {
    if (currentUserName) {
      localStorage.setItem("currentUserName", currentUserName);
    }
  }, [currentUserName]);

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

  const handleDeleteUserReservations = (userName) => {
    if (!userName) return;
    setReservations((prev) => prev.filter((r) => r.userName !== userName));
  };

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("adminPassword") || "123";
  });
  useEffect(() => {
    localStorage.setItem("adminPassword", adminPassword);
  }, [adminPassword]);

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("products");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("商品データの読み込みに失敗しました", err);
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const AdminGate = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
      if (adminAuthenticated) return;
      const input = window.prompt(
        "管理者ページに入るにはパスワードを入力してください"
      );
      if (input === null) {
        navigate("/");
        return;
      }
      if (input === adminPassword) {
        setAdminAuthenticated(true);
      } else {
        alert("管理者パスワードが違います");
        navigate("/");
      }
    }, [navigate, adminAuthenticated, adminPassword]);

    const handleAdminLogout = () => {
      setAdminAuthenticated(false);
      navigate("/");
    };

    if (!adminAuthenticated) return null;
    return React.cloneElement(children, { onAdminLogout: handleAdminLogout });
  };

  const handleAddHoliday = (date) => {
    if (!holidays.includes(date)) {
      setHolidays((prev) => [...prev, date].sort());
    }
  };

  const handleRemoveHoliday = (date) => {
    setHolidays((prev) => prev.filter((h) => h !== date));
  };

  // 購入予約の追加と在庫更新
  const handleAddBuyReservation = (newReservation, productName, quantity) => {
    setReservations((prev) => [...prev, newReservation]);
    if (!productName || !quantity) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.name === productName
          ? { ...p, stock: Math.max(0, (p.stock || 0) - Number(quantity)) }
          : p
      )
    );
  };

  return (
    
    <div className="App">
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
                onDeleteUserReservations={handleDeleteUserReservations}
                holidays={holidays}
                products={products}
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
                holidays={holidays}
              />
            }
          />
          <Route
            path="/reserve/buy"
            element={
              <BuyReservePage
                currentUserName={currentUserName}
                products={products}
                onAddReservation={handleAddBuyReservation}
                holidays={holidays}
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
              <AdminGate>
                <AdminPage
                  reservations={reservations}
                  onUpdateReservation={handleUpdateReservation}
                  adminPassword={adminPassword}
                  onChangeAdminPassword={setAdminPassword}
                  holidays={holidays}
                  onAddHoliday={handleAddHoliday}
                  onRemoveHoliday={handleRemoveHoliday}
                  products={products}
                  onUpdateProducts={setProducts}
                />
              </AdminGate>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <AdminGate>
                <ReservationListPage
                  reservations={reservations}
                  onUpdateReservation={handleUpdateReservation}
                />
              </AdminGate>
            }
          />
          <Route
            path="/reservations"
            element={
              <UserReservationListPage
                currentUserName={currentUserName}
                reservations={reservations}
                onCancelReservation={handleCancelReservation}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  
  );
}

export default App;
