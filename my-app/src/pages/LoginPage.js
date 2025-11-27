import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  padding: "24px",
};

function LoginPage({ setCurrentUserName }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

      const account = accounts.find(
        (acc) => acc.username === username && acc.password === password
      );

      if (account) {
        setCurrentUserName(username);
        navigate("/menu");
      } else {
        alert("ユーザー名またはパスワードが正しくありません。新規登録を行ってください。");
      }
    } else {
      alert("ユーザー名とパスワードを入力してください");
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ ...panelStyle, maxWidth: "420px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Card Shop Sato
        </h1>

        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#111827" }}>
          ログイン
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", color: "#111827", marginBottom: "4px" }}>
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#111827", marginBottom: "4px" }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ログイン
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", color: "#111827" }}>
          アカウントをお持ちでない場合は <Link to="/register">新規登録</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
