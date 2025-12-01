import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../background.png";

const UserReservationListPage = ({
  currentUserName,
  reservations = [],
  onCancelReservation,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || "";

  const myReservationsForDate = useMemo(() => {
    const filtered = reservations.filter(
      (r) => r.userName === currentUserName && r.date === selectedDate
    );
    const sorted = filtered.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    return {
      sell: sorted.filter((r) => r.type === "sell"),
      buy: sorted.filter((r) => r.type === "buy"),
    };
  }, [reservations, currentUserName, selectedDate]);

  const handleCancel = (id) => {
    if (!onCancelReservation) return;
    if (window.confirm("この予約をキャンセルしますか？")) {
      onCancelReservation(id);
    }
  };

  const renderList = (items, label, background) => {
    if (items.length === 0) {
      return <p style={{ fontSize: "13px", color: "#666", marginTop: "0" }}>{label}はありません。</p>;
    }
    return items.map((r) => (
      <div
        key={r.id}
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          padding: "10px",
          marginBottom: "10px",
          background,
        }}
      >
        <div>
          <strong>種別:</strong> {r.type === "sell" ? "買取" : "購入"}
        </div>
        <div>
          <strong>タイトル/商品:</strong> {r.cardName}
        </div>
        <div>
          <strong>数量:</strong> {r.quantity ?? "-"}
        </div>
        <div>
          <strong>金額:</strong>{" "}
          {typeof r.price === "number" ? `¥${Number(r.price).toLocaleString()}` : "-"}
        </div>
        <div>
          <strong>日時:</strong> {r.date} {r.time || ""}
        </div>
        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleCancel(r.id)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #dc3545",
              backgroundColor: "#dc3545",
              color: "white",
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 20px",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "rgba(255, 255, 255, 0.78)", // 半透明にして背景を透かす
          borderRadius: "8px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          padding: "20px",
          backdropFilter: "blur(4px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <img
            src="https://via.placeholder.com/160x70?text=Reservations"
            alt="Reservations"
            style={{ maxWidth: "180px", width: "100%", height: "auto" }}
          />
        </div>

        <h1 style={{ margin: "0 0 12px" }}>予約一覧</h1>
        <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#333" }}>
          日付: <strong>{selectedDate || "未選択"}</strong>
        </p>

        {selectedDate && myReservationsForDate.sell.length === 0 && myReservationsForDate.buy.length === 0 ? (
          <p style={{ fontSize: "13px" }}>この日の予約はありません。</p>
        ) : (
          <>
            <h2 style={{ fontSize: "16px", margin: "0 0 8px" }}>買取予約</h2>
            {renderList(myReservationsForDate.sell, "買取予約", "#fafafa")}

            <h2 style={{ fontSize: "16px", margin: "12px 0 8px" }}>購入予約</h2>
            {renderList(myReservationsForDate.buy, "購入予約", "#f5fbff")}
          </>
        )}

        <div style={{ marginTop: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f4f4f4",
              cursor: "pointer",
            }}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReservationListPage;
