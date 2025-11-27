import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    if (username && password) {
      // ローカルストレージから既存のアカウント情報を取得
      const existingAccounts = JSON.parse(
        localStorage.getItem("accounts") || "[]"
      );

      // ユーザー名の重複チェック
      const isDuplicate = existingAccounts.some(
        (account) => account.username === username
      );

      if (isDuplicate) {
        alert("このユーザー名は既に使用されています");
        return;
      }

      // 新しいアカウントを追加
      const newAccount = {
        username: username,
        password: password, // 実際のアプリではハッシュ化すべき
      };

      existingAccounts.push(newAccount);
      localStorage.setItem("accounts", JSON.stringify(existingAccounts));

      alert("登録が完了しました。ログインしてください。");
      navigate("/");
    } else {
      alert("すべての項目を入力してください");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>新規登録</h1>
      <form onSubmit={handleRegister}>
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
        <div style={{ marginBottom: "10px" }}>
          <label>
            パスワード（確認）:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          登録
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/">ログインページに戻る</Link>
      </p>
    </div>
  );
}

export default RegisterPage;

