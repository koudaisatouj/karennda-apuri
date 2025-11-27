// ログイン後の購入予約画面
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../background.png";

const DAY_RANGE = 40;
const TEXT = {
  title: "購入予約",
  card: "商品名:",
  price: "価格:",
  quantity: "個数:",
  date: "日付:",
  rangePrefix: "予約できる期間: ",
  required: "すべての項目を入力してください",
  rangeAlert: "予約できる期間は本日から40日先までです",
  submit: "予約する",
  cancel: "キャンセル",
  completed: "購入予約が完了しました",
};

const backgroundStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "24px",
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const panelStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
  padding: "20px",
  maxWidth: "520px",
  margin: "0 auto",
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

function BuyReservePage({ currentUserName, onAddReservation }) {
  const [cardName, setCardName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardName && price && date && quantity !== "") {
      if (!isWithinRange(date, today, endDate)) {
        alert(TEXT.rangeAlert);
        return;
      }

      const newReservation = {
        id: Date.now(),
        type: "buy",
        userName: currentUserName,
        cardName,
        price: parseFloat(price),
        quantity: Number(quantity),
        date,
      };
      onAddReservation(newReservation);
      alert(TEXT.completed);
      navigate("/menu");
    } else {
      alert(TEXT.required);
    }
  };

  const minDate = toLocalYmd(today);
  const maxDate = toLocalYmd(endDate);

  return (
    <div style={backgroundStyle}>
      <div style={panelStyle}>
        <h1 style={{ margin: "0 0 8px", color: "#0f1b35" }}>{TEXT.title}</h1>
        <p style={{ fontSize: "12px", color: "#0f1b35", marginBottom: "12px" }}>
          {TEXT.rangePrefix}
          {minDate} 〜 {maxDate}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.card}
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.price}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.quantity}
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="">選択してください</option>
              <option value="0">0個</option>
              <option value="1">1個</option>
              <option value="2">2個</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.date}
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {TEXT.submit}
            </button>
            <button
              type="button"
              onClick={() => navigate("/menu")}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {TEXT.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyReservePage;
