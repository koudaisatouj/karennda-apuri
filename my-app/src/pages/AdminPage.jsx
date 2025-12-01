// src/pages/AdminPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarPanel from "./admin/CalendarPanel";
import ProductManager from "./admin/ProductManager";
import AccountList from "./admin/AccountList";
import AdminSettings from "./admin/AdminSettings";
import { toLocalYmd } from "./admin/utils";

function AdminPage({
  reservations = [],
  onUpdateReservation,
  adminPassword,
  onChangeAdminPassword,
  onAdminLogout,
  holidays = [],
  onAddHoliday,
  onRemoveHoliday,
  products = [],
  onUpdateProducts,
}) {
  const navigate = useNavigate();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // 常に今日を起点に表示
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toLocalYmd(today));

  const [accounts, setAccounts] = useState([]);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [editedProducts, setEditedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    maxPerOrder: "",
  });

  // アカウント一覧の読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem("accounts");
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        const active = parsed.filter((acc) => !acc.deleted && acc.username);
        const seen = new Set();
        const unique = [];
        active.forEach((acc) => {
          const key =
            (acc.username || "").trim().toLowerCase() ||
            (acc.email || "").trim().toLowerCase();
          if (!key || seen.has(key)) return;
          seen.add(key);
          unique.push(acc);
        });
        setAccounts(unique);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error("アカウント一覧の読み込みに失敗しました", err);
      setAccounts([]);
    }
  }, []);

  useEffect(() => {
    setEditedProducts(products || []);
  }, [products]);

  // 月と日付の計算
  const firstDayOfMonth = useMemo(
    () => new Date(viewYear, viewMonth, 1),
    [viewYear, viewMonth]
  );
  const lastDayOfMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0),
    [viewYear, viewMonth]
  );
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const cells = useMemo(() => {
    const list = [];
    for (let i = 0; i < startWeekday; i++) list.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      list.push(new Date(viewYear, viewMonth, day));
    }
    return list;
  }, [startWeekday, daysInMonth, viewYear, viewMonth]);

  const weeks = useMemo(() => {
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [cells]);

  const reservationsByDate = useMemo(() => {
    const map = {};
    reservations.forEach((r) => {
      if (!r.date) return;
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return map;
  }, [reservations]);

  // ハンドラー
  const handleToggleHoliday = (ymd) => {
    if (!onAddHoliday || !onRemoveHoliday) return;
    if (holidays.includes(ymd)) {
      onRemoveHoliday(ymd);
    } else {
      onAddHoliday(ymd);
    }
  };

  const handlePrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(toLocalYmd(today));
  };

  const handleDayClick = (dateStr, hasItems) => {
    setSelectedDate(dateStr);
    if (hasItems) {
      navigate(`/admin/reservations?date=${encodeURIComponent(dateStr)}`);
    }
  };

  const handleProductChange = (id, key, value) => {
    setEditedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const handleSaveProducts = () => {
    if (!onUpdateProducts) return;
    const normalized = editedProducts.map((p) => ({
      ...p,
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      maxPerOrder: Number(p.maxPerOrder) || 0,
    }));
    onUpdateProducts(normalized);
    alert("商品の変更を保存しました");
  };

  const handleAddProduct = () => {
    if (!newProduct.name) {
      alert("商品名を入力してください");
      return;
    }
    const newItem = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
      image: newProduct.image || "",
      maxPerOrder: Number(newProduct.maxPerOrder) || 0,
    };
    const updated = [...editedProducts, newItem];
    setEditedProducts(updated);
    setNewProduct({ name: "", price: "", stock: "", image: "", maxPerOrder: "" });
    if (onUpdateProducts) onUpdateProducts(updated);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1150px" }}>
        <h1 style={{ marginBottom: "16px" }}>管理者画面</h1>

        <CalendarPanel
          today={today}
          viewYear={viewYear}
          viewMonth={viewMonth}
          selectedDate={selectedDate}
          weeks={weeks}
          holidays={holidays}
          reservationsByDate={reservationsByDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onDayClick={handleDayClick}
          onToggleHoliday={handleToggleHoliday}
        />

        <ProductManager
          showProducts={showProducts}
          setShowProducts={setShowProducts}
          editedProducts={editedProducts}
          onChangeProduct={handleProductChange}
          onSaveProducts={handleSaveProducts}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onAddProduct={handleAddProduct}
        />

        <AccountList
          accounts={accounts}
          showAccounts={showAccounts}
          setShowAccounts={setShowAccounts}
        />

        <AdminSettings
          adminPassword={adminPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onChangeAdminPassword={onChangeAdminPassword}
          onAdminLogout={onAdminLogout}
        />
      </div>
    </div>
  );
}

export default AdminPage;
