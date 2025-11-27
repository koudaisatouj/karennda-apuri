import React from "react";
import { useNavigate } from "react-router-dom";

function CancelPage({
  currentUserName,
  reservations,
  onCancelReservation,
}) {
  const navigate = useNavigate();

  // 現在のユーザーの予約のみをフィルタリング
  const userReservations = reservations.filter(
    (r) => r.userName === currentUserName
  );

  const handleCancel = (id) => {
    if (window.confirm("この予約をキャンセルしますか？")) {
      onCancelReservation(id);
      alert("予約をキャンセルしました");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>予約キャンセル</h1>
      {userReservations.length === 0 ? (
        <p>予約がありません</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {userReservations.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>種類:</strong>{" "}
                {reservation.type === "sell" ? "売却" : "購入"}
              </div>
              {reservation.type === "sell" ? (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>タイトル:</strong> {reservation.cardName}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>枚数:</strong>{" "}
                    {reservation.quantity
                      ? reservation.quantity >= 3000
                        ? "3000~"
                        : `${reservation.quantity}枚`
                      : reservation.price
                      ? reservation.price >= 3000
                        ? "3000~"
                        : `${reservation.price}枚`
                      : "不明"}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>カード名:</strong> {reservation.cardName}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>価格:</strong> ¥{reservation.price.toLocaleString()}
                  </div>
                </>
              )}
              <div style={{ marginBottom: "10px" }}>
                <strong>日付:</strong> {reservation.date}
              </div>
              <button
                onClick={() => handleCancel(reservation.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
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
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        メニューに戻る
      </button>
    </div>
  );
}

export default CancelPage;

