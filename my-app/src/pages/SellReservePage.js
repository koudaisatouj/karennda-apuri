import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function SellReservePage({ currentUserName, reservations, onAddReservation }) {
  const [cardName, setCardName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  // 10:00~19:00の30分間隔の時間枠を生成
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 10; hour < 19; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  // 選択されたタイトルで既に予約されている時間枠を取得
  const bookedTimeSlots = useMemo(() => {
    if (!cardName || !date) return [];
    return reservations
      .filter(
        (r) =>
          r.type === "sell" &&
          r.cardName === cardName &&
          r.date === date
      )
      .map((r) => r.time)
      .filter(Boolean);
  }, [cardName, date, reservations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardName && quantity && date && time) {
      // 同じタイトルで既に予約があるかチェック
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
        price: parseFloat(quantity), // 互換性のためpriceキーを維持
        quantity: parseFloat(quantity),
        date,
        time,
      };
      onAddReservation(newReservation);
      alert("買取予約が完了しました");
      navigate("/menu");
    } else {
      alert("すべての項目を入力してください");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>買取予約</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            タイトル:
            <select
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">選択してください</option>
              <option value="遊戯王">遊戯王</option>
              <option value="ポケモンカード">ポケモンカード</option>
              <option value="デュエルマスターズ">デュエルマスターズ</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            枚数:
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">選択してください</option>
              <option value="500">500枚</option>
              <option value="1000">1000枚</option>
              <option value="1500">1500枚</option>
              <option value="2000">2000枚</option>
              <option value="2500">2500枚</option>
              <option value="3000">3000~</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            日付:
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime(""); // 日付が変わったら時間をリセット
              }}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            時間:
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              disabled={!cardName || !date}
            >
              <option value="">
                {!cardName || !date
                  ? "タイトルと日付を選択してください"
                  : "選択してください"}
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
          </label>
          {cardName && date && bookedTimeSlots.length > 0 && (
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              注意: このタイトルは既に予約済みの時間枠があります。1タイトルにつき1枠まで予約可能です。
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            予約する
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default SellReservePage;

