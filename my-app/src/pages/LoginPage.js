import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        alert("ユーザー名またはパスワードが正しくありません。\nアカウントが登録されていない場合は、新規登録を行ってください。");
      }
    } else {
      alert("ユーザー名とパスワードを入力してください");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      
      {/* ⭐ ここが追加したロゴ部分 ⭐ */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Card Shop Sato
      </h1>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>ログイン</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            ユーザー名:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            パスワード:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
}

export default LoginPage;
