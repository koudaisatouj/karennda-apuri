import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../background.png"; 

const DAY_RANGE = 40;
const TEXT = {
  title: "買取予約",
  select: "選択してください",
  date: "日付:",
  time: "時間:",
  rangePrefix: "予約できる期間: ",
  required: "すべての項目を入力してください",
  rangeAlert: "予約できる期間は本日から40日先までです",
  submit: "予約する",
  cancel: "キャンセル",
  completed: "買取予約が完了しました",
  titleLabel: "タイトル:",
  quantityLabel: "枚数:",
  priceLabel: "希望金額:",  
  bookedNote:
    "注意: このタイトルは既に予約済みの時間枠があります。1タイトルにつき1枠まで予約可能です。",
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

function SellReservePage({ currentUserName, reservations, onAddReservation }) {
  const [cardName, setCardName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
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

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 10; hour < 19; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  const bookedTimeSlots = useMemo(() => {
    if (!cardName || !date) return [];
    return reservations
      .filter((r) => r.type === "sell" && r.cardName === cardName && r.date === date)
      .map((r) => r.time)
      .filter(Boolean);
  }, [cardName, date, reservations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardName && quantity && date && time) {
      if (!isWithinRange(date, today, endDate)) {
        alert(TEXT.rangeAlert);
        return;
      }

      const existingReservation = reservations.find(
        (r) => r.type === "sell" && r.cardName === cardName && r.date === date && r.userName === currentUserName
      );

      if (existingReservation) {
        alert("このタイトルは既に予約済みです。1タイトルにつき1枠まで予約可能です。");
        return;
      }

      const newReservation = {
        id: Date.now(),
        type: "sell",
        userName: currentUserName,
        cardName,
        price: parseFloat(quantity),
        quantity: parseFloat(quantity),
        date,
        time,
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
              {TEXT.titleLabel}
            </label>
            <select
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "2px", borderRadius: "6px" }}
            >
              <option value="">{TEXT.select}</option>
              <option value="遊戯王">遊戯王</option>
              <option value="ポケモンカード">ポケモンカード</option>
              <option value="デュエルマスターズ">デュエルマスターズ</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.quantityLabel}
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "2px", borderRadius: "6px" }}
            >
              <option value="">{TEXT.select}</option>
              <option value="500">~500枚</option>
              <option value="1000">1000枚</option>
              <option value="1500">1500枚</option>
              <option value="2000">2000枚</option>
              <option value="2500">2500枚</option>
              <option value="3000">3000~</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
          {TEXT.priceLabel}
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          placeholder="例: 5000"
        />
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
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0f1b35", marginBottom: "4px" }}>
              {TEXT.time}
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "2px", borderRadius: "6px" }}
              disabled={!cardName || !date}
            >
              <option value="">
                {!cardName || !date ? "タイトルと日付を選択してください" : TEXT.select}
              </option>
              {timeSlots.map((slot) => {
                const isBooked = bookedTimeSlots.includes(slot);
                return (
                  <option
                    key={slot}
                    value={slot}
                    disabled={isBooked}
                    style={{
                      backgroundColor: isBooked ? "#f0f0f0" : "white",
                      color: isBooked ? "#999" : "black",
                    }}
                  >
                    {slot} {isBooked ? "(予約済み)" : ""}
                  </option>
                );
              })}
            </select>
            {cardName && date && bookedTimeSlots.length > 0 && (
              <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>{TEXT.bookedNote}</p>
            )}
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

export default SellReservePage;
