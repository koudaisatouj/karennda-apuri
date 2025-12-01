import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../background.png";

const backgroundStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "24px",
  backgroundImage: "url('/cards-hero.jpg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const panelStyle = {
  background: "rgba(255,255,255,0.82)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
  padding: "24px",
  backdropFilter: "blur(6px)",
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
        // ログイン成功時に現在のユーザー名を保存
        localStorage.setItem("currentUserName", username);
        localStorage.setItem("currentUserPassword", password);
        localStorage.setItem("authToken", "local-auth");
        setCurrentUserName(username);
        navigate("/menu");
      } else {
        alert("ユーザー名またはパスワードが間違っています。新規登録を行ってください。");
      }
    } else {
      alert("ユーザー名とパスワードを入力してください");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    boxSizing: "border-box",
    backgroundColor: "rgba(255,255,255,0.6)",
  };

  return (
    <div style={backgroundStyle}>
      <div
        style={{
          ...panelStyle,
          maxWidth: "460px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Card Shop Sato
        </h1>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "8px",
            color: "#111827",
            fontSize: "20px",
          }}
        >
          ログイン
        </h2>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            <label style={{ color: "#111827", fontSize: "14px" }}>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            <label style={{ color: "#111827", fontSize: "14px" }}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
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
