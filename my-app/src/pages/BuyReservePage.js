//ログイン～予約選択
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyReservePage({ currentUserName, onAddReservation }) {
  const [cardName, setCardName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardName && price && date) {
      const newReservation = {
        id: Date.now(),
        type: "buy",
        userName: currentUserName,
        cardName,
        price: parseFloat(price),
        date,
      };
      onAddReservation(newReservation);
      alert("購入予約が完了しました");
      navigate("/menu");
    } else {
      alert("すべての項目を入力してください");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>購入予約</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            カード名:
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            価格:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            日付:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
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

export default BuyReservePage;

