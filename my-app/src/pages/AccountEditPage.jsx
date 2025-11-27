// src/pages/AccountEditPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AccountEditPage({ currentUserName, setCurrentUserName }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const current = accounts.find((acc) => acc.name === currentUserName);

    if (!current) {
      alert("ユーザー情報が見つかりません。ログインし直してください。");
      navigate("/");
      return;
    }

    setName(current.name || "");
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
      (acc) => acc.email === email && acc.name !== currentUserName
    );
    if (isEmailUsedByOther) {
      alert("このメールアドレスは他のアカウントで使用されています");
      return;
    }

    const newAccounts = accounts.map((acc) => {
      if (acc.name === currentUserName) {
        return {
          ...acc,
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
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>ユーザー情報の変更</h1>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            名前:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            生年月日:
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            メールアドレス:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            電話番号:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          保存
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/menu">メニューに戻る</Link>
      </p>
    </div>
  );
}


export default AccountEditPage;
