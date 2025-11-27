import React from "react";
import { useNavigate } from "react-router-dom";

function MenuPage({ currentUserName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("authToken"); // 保存していれば削除

    navigate("/login"); // ログインページへ戻す
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>メニュー</h1>
      <p>ようこそ、{currentUserName}さん</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => navigate("/reserve/sell")}
          style={{
            padding: "15px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          買取予約
        </button>
        <button
          onClick={() => navigate("/reserve/buy")}
          style={{
            padding: "15px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          購入予約
        </button>
        <button
          onClick={() => navigate("/reserve/cancel")}
          style={{
            padding: "15px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          予約キャンセル
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}


export default MenuPage;




