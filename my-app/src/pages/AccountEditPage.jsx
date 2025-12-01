import React, { useEffect, useState } from "react";
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
  padding: "24px",
  width: "100%",
  maxWidth: "460px",
};

const labelStyle = { color: "#111827", fontSize: "14px" };
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
  backgroundColor: "rgba(255,255,255,0.9)",
};

function AccountEditPage({ currentUserName, setCurrentUserName }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const current = accounts.find(
      (acc) => acc.username === currentUserName || acc.name === currentUserName
    );

    if (!current) {
      alert("ユーザー情報が見つかりません。ログインし直してください。");
      navigate("/");
      return;
    }

    setName(current.username || current.name || "");
    setBirthDate(current.birthDate || "");
    setEmail(current.email || "");
    setPhone(current.phone || "");
    setPassword(current.password || "");
  }, [currentUserName, navigate]);

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !birthDate || !email || !phone || !password) {
      alert("すべての項目を入力してください");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    const isEmailUsedByOther = accounts.some(
      (acc) => acc.email === email && (acc.username || acc.name) !== currentUserName
    );
    if (isEmailUsedByOther) {
      alert("このメールアドレスは他のアカウントで使用されています");
      return;
    }

    const newAccounts = accounts.map((acc) => {
      if ((acc.username || acc.name) === currentUserName) {
        return {
          ...acc,
          username: name,
          name,
          birthDate,
          email,
          phone,
          password,
        };
      }
      return acc;
    });

    localStorage.setItem("accounts", JSON.stringify(newAccounts));

    if (setCurrentUserName) {
      setCurrentUserName(name);
      localStorage.setItem("currentUserName", name);
      localStorage.setItem("currentUserPassword", password);
    }

    alert("ユーザー情報を更新しました");
    navigate("/menu");
  };

  return (
    <div style={backgroundStyle}>
      <div style={panelStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "16px", color: "#111827" }}>
          ユーザー情報の変更
        </h1>
        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>名前 / ユーザー名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>生年月日</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>電話番号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={labelStyle}>パスワード</label>
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
              padding: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            保存
          </button>
        </form>

        <p style={{ marginTop: "18px", textAlign: "center" }}>
          <Link to="/menu">メニューに戻る</Link>
        </p>
      </div>
    </div>
  );
}

export default AccountEditPage;
