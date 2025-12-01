import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../background.png";
const DAY_RANGE = 40;
const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
const TEXT = {
  title: "予約メニュー",
  welcome: "いらっしゃいませ、",
  sell: "買取予約",
  buy: "購入予約",
  logout: "ログアウト",
  displayRange: "表示範囲: ",
  dayRangeSuffix: "（40日間）",
  noteRange: "予約できるのは今日から40日までです。",
  noPlan: "予約なし",
  sellText: "買取",
  buyText: "購入",
};
const toLocalYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const parseYmd = (value) => {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    ? dt
    : null;
};

const isWithinRange = (ymd, startDate, endDate) => {
  const dt = parseYmd(ymd);
  if (!dt) return false;
  return dt >= startDate && dt <= endDate;
};

const backgroundStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "32px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const panelStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
};

function MenuPage({
  currentUserName,
  setCurrentUserName,
  reservations = [],
  onDeleteUserReservations,
  holidays = [],
  products = [],
}) {
  const navigate = useNavigate();
  const [viewDate] = useState(() => new Date());

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const endDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + DAY_RANGE - 1);
    return d;
  }, [today]);

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < DAY_RANGE; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today]);

  const startDay = useMemo(() => today.getDay(), [today]);

  const cells = useMemo(() => {
    const list = [];
    for (let i = 0; i < startDay; i++) list.push(null);
    days.forEach((d) => list.push(d));
    return list;
  }, [days, startDay]);

  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < cells.length; i += 7) {
      w.push(cells.slice(i, i + 7));
    }
    return w;
  }, [cells]);

  const userReservations = useMemo(
    () =>
      reservations.filter(
        (r) =>
          r.userName === currentUserName && isWithinRange(r.date, today, endDate)
      ),
    [reservations, currentUserName, today, endDate]
  );

  const reservationsByDate = useMemo(() => {
    const map = {};
    userReservations.forEach((r) => {
      if (!r.date) return;
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return map;
  }, [userReservations]);

  const handleLogout = () => {
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("authToken");
    if (setCurrentUserName) {
      setCurrentUserName("");
    }
    navigate("/");
  };

  const handleDeleteAccount = () => {
    const currentName = localStorage.getItem("currentUserName");
    const currentPassword = localStorage.getItem("currentUserPassword");

    const inputPassword = window.prompt(
      `アカウントを削除するにはパスワードを入力してください。\nユーザー名: ${currentName}`
    );
    if (inputPassword === null) return;
    if (inputPassword !== currentPassword) {
      alert("パスワードが違います。アカウントを削除できません。");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const newAccounts = accounts.filter(
      (acc) => !(acc.username === currentName && acc.password === currentPassword)
    );
    localStorage.setItem("accounts", JSON.stringify(newAccounts));

    if (onDeleteUserReservations) {
      onDeleteUserReservations(currentName);
    }

    localStorage.removeItem("currentUserName");
    localStorage.removeItem("currentUserPassword");
    localStorage.removeItem("authToken");

    if (setCurrentUserName) {
      setCurrentUserName("");
    }

    alert("アカウントを削除しました");
    navigate("/");
  };

  const handleDayClick = (dateStr, hasItems) => {
    if (hasItems) {
      navigate(`/reservations?date=${encodeURIComponent(dateStr)}`);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ ...panelStyle, padding: "22px" }}>
          <h1 style={{ margin: "0 0 8px", color: "#0f1b35" }}>{TEXT.title}</h1>
          <p style={{ margin: 0, color: "#0f1b35" }}>
            {TEXT.welcome}
            {currentUserName}さん
          </p>
        </div>

        <div
          style={{
            ...panelStyle,
            padding: "20px",
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <button
            onClick={() => navigate("/reserve/sell")}
            style={{
              padding: "15px",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
            }}
          >
            {TEXT.sell}
          </button>
          <button
            onClick={() => navigate("/reserve/buy")}
            style={{
              padding: "15px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
            }}
          >
            {TEXT.buy}
          </button>
        </div>

        <div style={{ ...panelStyle, padding: "18px" }}>
          <div style={{ marginBottom: "12px", fontWeight: "bold", color: "#0f1b35" }}>
            {TEXT.displayRange}
            {toLocalYmd(today)} 〜 {toLocalYmd(endDate)}
            {TEXT.dayRangeSuffix}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                {WEEK_LABELS.map((w) => (
                  <th
                    key={w}
                    style={{ borderBottom: "1px solid #ddd", padding: "6px", textAlign: "center" }}
                  >
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wIdx) => (
                <tr key={wIdx}>
                  {week.map((day, idx) => {
                    if (!day) {
                      return (
                        <td
                          key={`empty-${idx}`}
                          style={{ border: "1px solid #f5f5f5", height: "110px" }}
                        />
                      );
                    }
                    const dateStr = toLocalYmd(day);
                    const items = reservationsByDate[dateStr] || [];
                    const isHoliday = holidays.includes(dateStr);
                    const dayOfWeek = day.getDay();
                    const baseBgColor = isHoliday
                      ? "#e6e6e6"
                      : dayOfWeek === 0
                      ? "#ffeaea"
                      : dayOfWeek === 6
                      ? "#e3f2fd"
                      : items.length
                      ? "#fffdf5"
                      : "white";
                    const dayColor = isHoliday
                      ? "#555"
                      : dayOfWeek === 0
                      ? "#c62828"
                      : dayOfWeek === 6
                      ? "#1565c0"
                      : "#0f1b35";
                    return (
                      <td
                        key={dateStr}
                        onClick={() => handleDayClick(dateStr, items.length > 0)}
                        style={{
                          border: "1px solid #f0f0f0",
                          verticalAlign: "top",
                          padding: "6px",
                          backgroundColor: baseBgColor,
                          height: "110px",
                          cursor: items.length ? "pointer" : "default",
                        }}
                      >
                        <div style={{ fontWeight: "bold", marginBottom: "4px", color: dayColor }}>
                          {day.getDate()}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {items.length ? (
                            <div
                              style={{
                                fontSize: "12px",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                backgroundColor: "#e8f5e9",
                                border: "1px solid #bcd5c2",
                                color: "#0f5132",
                              }}
                            >
                              予約あり（{items.length}件）
                            </div>
                          ) : (
                            <div style={{ fontSize: "12px", color: "#aaa" }}>{TEXT.noPlan}</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}>{TEXT.noteRange}</p>
        </div>
        <div style={{ ...panelStyle, padding: "16px", marginTop: "4px" }}>
          <h2 style={{ margin: "0 0 12px", color: "#0f1b35", fontSize: "18px" }}>
            アカウント設定
          </h2>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-start",
              maxWidth: "520px",
            }}
          >
            <button
              onClick={() => navigate("/account/edit")}
              style={{
                padding: "12px 18px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ユーザー情報変更
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 18px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ログアウト
            </button>
            <button
              onClick={handleDeleteAccount}
              style={{
                padding: "12px 18px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              アカウント削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MenuPage;