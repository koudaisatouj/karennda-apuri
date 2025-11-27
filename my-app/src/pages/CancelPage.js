import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../background.png";

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
  maxWidth: "900px",
  margin: "0 auto",
};

function CancelPage({ currentUserName, reservations, onCancelReservation }) {
  const navigate = useNavigate();

  const userReservations = reservations.filter((r) => r.userName === currentUserName);

  const handleCancel = (id) => {
    if (window.confirm("この予約をキャンセルしますか？")) {
      onCancelReservation(id);
      alert("予約をキャンセルしました");
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={panelStyle}>
        <h1 style={{ margin: "0 0 16px", color: "#0f1b35" }}>予約キャンセル</h1>
        {userReservations.length === 0 ? (
          <p style={{ color: "#0f1b35" }}>予約はありません</p>
        ) : (
          <div style={{ marginTop: "12px" }}>
            {userReservations.map((reservation) => (
              <div
                key={reservation.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <strong>種別:</strong> {reservation.type === "sell" ? "売却" : "購入"}
                </div>
                {reservation.type === "sell" ? (
  <>
    <div style={{ marginBottom: "8px" }}>
      <strong>タイトル:</strong> {reservation.cardName}
    </div>
    <div style={{ marginBottom: "8px" }}>
      <strong>枚数:</strong>{" "}
      {reservation.quantity ? `${reservation.quantity}枚` : "不明"}
    </div>
    <div style={{ marginBottom: "8px" }}>
      <strong>希望金額:</strong>{" "}
      {typeof reservation.price === "number"
        ? `¥${reservation.price.toLocaleString()}`
        : "未入力"}
    </div>
  </>
) : (
  <>
    <div style={{ marginBottom: "8px" }}>
      <strong>カード名:</strong> {reservation.cardName}
    </div>
    <div style={{ marginBottom: "8px" }}>
      <strong>価格:</strong> ¥{reservation.price.toLocaleString()}
    </div>
  </>
)}

                <div style={{ marginBottom: "10px" }}>
                  <strong>日付:</strong> {reservation.date}
                  {reservation.time && ` ${reservation.time}`}
                </div>
                <button
                  onClick={() => handleCancel(reservation.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  キャンセル
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/menu")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          メニューに戻る
        </button>
      </div>
    </div>
  );
}

export default CancelPage;
