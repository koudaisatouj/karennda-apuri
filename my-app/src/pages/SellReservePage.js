import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DAY_RANGE,
  TEXT,
  backgroundStyle,
  panelStyle,
  toLocalYmd,
  parseYmd,
  isWithinRange,
} from "./sellReserveUtils";

const fieldStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
  backgroundColor: "rgba(255,255,255,0.9)",
};

const fieldBlockStyle = { display: "flex", flexDirection: "column", gap: "6px" };

function SellReservePage({ currentUserName, reservations = [], onAddReservation, holidays = [] }) {
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
    if (!(cardName && quantity && date && time)) {
      alert(TEXT.required);
      return;
    }
    if (!isWithinRange(date, today, endDate)) {
      alert(TEXT.rangeAlert);
      return;
    }
    if (holidays.includes(date)) {
      alert("選択した日は休日のため予約できません");
      return;
    }
    const existingReservation = reservations.find(
      (r) =>
        r.type === "sell" &&
        r.cardName === cardName &&
        r.date === date &&
        r.userName === currentUserName
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
      price: parseFloat(price) || 0,
      quantity: Number(quantity),
      date,
      time,
      status: "予約済み",
    };
    onAddReservation(newReservation);
    alert(TEXT.completed);
    navigate("/menu");
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
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35" }}>{TEXT.titleLabel}</label>
            <select
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{ ...fieldStyle }}
            >
              <option value="">{TEXT.select}</option>
              <option value="遊戯王">遊戯王</option>
              <option value="ポケモンカード">ポケモンカード</option>
              <option value="デュエルマスターズ">デュエルマスターズ</option>
            </select>
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35" }}>{TEXT.quantityLabel}</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ ...fieldStyle }}
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

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35" }}>{TEXT.priceLabel}</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...fieldStyle }}
              placeholder="例: 5000"
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35" }}>{TEXT.date}</label>
            <input
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                const value = e.target.value;
                if (holidays.includes(value)) {
                  alert("選択した日は休日のため予約できません");
                  setDate("");
                  setTime("");
                  return;
                }
                setDate(value);
                setTime("");
              }}
              style={{ ...fieldStyle }}
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35" }}>{TEXT.time}</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ ...fieldStyle }}
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
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
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
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              {TEXT.cancel}
            </button>
          </div>
          <p style={{ marginTop: "10px", fontSize: "12px", color: "#555" }}>{TEXT.bookedNote}</p>
        </form>
      </div>
    </div>
  );
}

export default SellReservePage;
