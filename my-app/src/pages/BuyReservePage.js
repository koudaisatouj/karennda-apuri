import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../background.png";

const DAY_RANGE = 40;
const TEXT = {
  title: "購入予約",
  product: "商品",
  price: "単価",
  quantity: "数量",
  total: "合計金額",
  date: "受取日",
  rangePrefix: "予約できる期間: ",
  required: "すべての項目を入力してください",
  rangeAlert: "予約できるのは今日から40日までです",
  submit: "予約する",
  cancel: "キャンセル",
  completed: "購入予約が完了しました",
  noStock: "在庫が足りません",
  maxPerOrder: "1回の購入上限",
};

const backgroundStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "24px",
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const panelStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
  padding: "24px",
  maxWidth: "860px",
  margin: "0 auto",
};

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

function BuyReservePage({
  currentUserName,
  products = [],
  onAddReservation,
  holidays = [],
}) {
  const navigate = useNavigate();
  const [selectedProductName, setSelectedProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");

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

  const selectedProduct = useMemo(
    () => products.find((p) => p.name === selectedProductName),
    [products, selectedProductName]
  );

  const price = selectedProduct ? Number(selectedProduct.price) || 0 : 0;
  const stock = selectedProduct ? Number(selectedProduct.stock) || 0 : 0;
  const maxPerOrderRaw = selectedProduct ? Number(selectedProduct.maxPerOrder) || 0 : 0;
  const maxPerOrder = maxPerOrderRaw > 0 ? maxPerOrderRaw : 2; // 未設定ならデフォルト2
  const purchasableLimit = Math.max(0, Math.min(stock, maxPerOrder));
  const total = price * (Number(quantity) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !date) {
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
    if (stock < Number(quantity)) {
      alert(TEXT.noStock);
      return;
    }
    if (Number(quantity) > purchasableLimit) {
      alert(`1回の購入上限は${purchasableLimit}個までです`);
      return;
    }

    const newReservation = {
      id: Date.now(),
      type: "buy",
      userName: currentUserName,
      cardName: selectedProduct.name,
      price,
      quantity: Number(quantity),
      date,
      time: "",
      status: "予約済み",
    };

    onAddReservation(newReservation, selectedProduct.name, Number(quantity));
    alert(TEXT.completed);
    navigate("/menu");
  };

  const minDate = toLocalYmd(today);
  const maxDate = toLocalYmd(endDate);
  const isSelectedDateHoliday = holidays.includes(date);

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
            <label style={{ color: "#0f1b35", fontSize: "14px" }}>{TEXT.product}</label>
            <select
              value={selectedProductName}
              onChange={(e) => {
                setSelectedProductName(e.target.value);
                setQuantity(1);
              }}
              style={{
                ...fieldStyle,
              }}
            >
              <option value="">選択してください</option>
              {products.map((p) => (
                <option key={p.id || p.name} value={p.name}>
                  {p.name} | ¥{Number(p.price || 0).toLocaleString()} | 在庫: {p.stock ?? 0} | 上限:
                  {p.maxPerOrder && Number(p.maxPerOrder) > 0 ? p.maxPerOrder : "2(既定)"}
                </option>
              ))}
            </select>
            {selectedProduct && selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{ marginTop: "8px", maxWidth: "100%", borderRadius: "6px" }}
              />
            )}
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35", fontSize: "14px" }}>{TEXT.price}</label>
            <input //短歌
              type="number"
              value={price}
              readOnly
              style={{
                ...fieldStyle,
                background: "#f8f9fa",
              }}
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35", fontSize: "14px" }}>
              {TEXT.quantity}（在庫: {stock} / 上限: {purchasableLimit}）
            </label>
            <input
              type="number"
              min={1}
              max={purchasableLimit || 1}
              value={quantity}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (purchasableLimit > 0 && val > purchasableLimit) {
                  setQuantity(purchasableLimit);
                } else {
                  setQuantity(e.target.value);
                }
              }}
              style={{ ...fieldStyle }}
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35", fontSize: "14px" }}>{TEXT.total}</label>
            <input
              type="text"
              value={`¥${Number(total || 0).toLocaleString()}`}
              readOnly
              style={{
                ...fieldStyle,
                background: "#f8f9fa",
              }}
            />
          </div>

          <div style={fieldBlockStyle}>
            <label style={{ color: "#0f1b35", fontSize: "14px" }}>{TEXT.date}</label>
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
                  return;
                }
                setDate(value);
              }}
              style={{
                ...fieldStyle,
                background: "rgba(255,255,255,0.9)",
                appearance: "none",
              }}
            />
            {isSelectedDateHoliday && (
              <p style={{ fontSize: "12px", color: "#d32f2f", marginTop: "5px" }}>
                選択した日は休日のため予約できません
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={
                isSelectedDateHoliday ||
                !selectedProduct ||
                !quantity ||
                !date ||
                Number(quantity) <= 0
              }
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: isSelectedDateHoliday ? "#cccccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isSelectedDateHoliday ? "not-allowed" : "pointer",
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
        </form>
      </div>
    </div>
  );
}

export default BuyReservePage;
