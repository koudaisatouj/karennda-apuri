import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = ["予約中", "査定中", "査定済み", "買取完了", "購入完了"];

const decodeMaybeEscaped = (value) => {
  if (typeof value !== "string") return value;
  if (!value.includes("\\u")) return value;
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value;
  }
};

const timeToNumber = (timeStr) => {
  if (!timeStr) return Number.MAX_SAFE_INTEGER;
  const [h, m] = timeStr.split(":").map((n) => Number(n));
  if (Number.isNaN(h) || Number.isNaN(m)) return Number.MAX_SAFE_INTEGER;
  return h * 60 + m;
};

function ReservationListPage({ reservations = [], onUpdateReservation }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get("date") || "";

  const reservationsForDate = useMemo(
    () =>
      reservations
        .filter((r) => r.date === selectedDate)
        .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time)),
    [reservations, selectedDate]
  );

  const sellReservations = reservationsForDate.filter((r) => r.type === "sell");
  const buyReservations = reservationsForDate.filter((r) => r.type !== "sell");

  const handleStatusChange = (res, newStatus) => {
    if (!onUpdateReservation) return;
    const updated = { ...res, status: newStatus };
    onUpdateReservation(updated);
  };

  const renderCard = (r) => {
    const isSell = r.type === "sell";
    return (
      <div
        key={r.id}
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          padding: "14px",
          background: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 12px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "14px" }}>
          種別: <span style={{ fontWeight: 600 }}>{isSell ? "買取" : "購入"}</span>
        </div>
        <div style={{ textAlign: "right", fontSize: "13px", color: "#555" }}>
          ユーザー: {decodeMaybeEscaped(r.userName)}
        </div>
        <div style={{ gridColumn: "1 / span 2" }}>
          <div style={{ fontSize: "13px", color: "#444" }}>
            <strong>{isSell ? "タイトル" : "商品"}:</strong> {decodeMaybeEscaped(r.cardName)}
          </div>
        </div>
        <div style={{ fontSize: "13px", color: "#444" }}>
          <strong>{isSell ? "枚数" : "数量"}:</strong> {r.quantity != null ? r.quantity : "-"}
        </div>
        <div style={{ fontSize: "13px", color: "#444" }}>
          <strong>金額:</strong>{" "}
          {typeof r.price === "number" ? `¥${Number(r.price).toLocaleString()}` : "-"}
        </div>
        <div style={{ gridColumn: "1 / span 2", fontSize: "13px", color: "#444" }}>
          <strong>日時:</strong> {decodeMaybeEscaped(r.date)} {decodeMaybeEscaped(r.time) || ""}
        </div>
        <div style={{ gridColumn: "1 / span 2", display: "flex", alignItems: "center", gap: "8px" }}>
          <strong style={{ fontSize: "13px" }}>ステータス:</strong>
          {(() => {
            const isSell = r.type === "sell";
            const allowed = isSell
              ? STATUS_OPTIONS.filter((s) => s !== "購入完了")
              : STATUS_OPTIONS.filter((s) => !["査定中", "査定済み", "買取完了"].includes(s));
            return (
              <select
                value={r.status || "予約済み"}
                onChange={(e) => handleStatusChange(r, e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "13px",
                  minWidth: "140px",
                }}
              >
                {allowed.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "24px",
        backgroundColor: "#f7f9fc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: "22px" }}>予約一覧</h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#444" }}>
              日付: <strong>{selectedDate || "未選択"}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: "#f4f4f4",
            }}
          >
            戻る
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "14px",
            marginTop: "16px",
          }}
        >
          <section
            style={{
              background: "#fdfbf5",
              border: "1px solid #f0e6d2",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <h2 style={{ margin: "0 0 10px", fontSize: "16px" }}>買取予約</h2>
            {sellReservations.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#666" }}>買取予約はありません</p>
            ) : (
              sellReservations.map((r) => renderCard(r))
            )}
          </section>

          <section
            style={{
              background: "#f5f9ff",
              border: "1px solid #d9e6ff",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <h2 style={{ margin: "0 0 10px", fontSize: "16px" }}>購入予約</h2>
            {buyReservations.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#666" }}>購入予約はありません</p>
            ) : (
              buyReservations.map((r) => renderCard(r))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ReservationListPage;
