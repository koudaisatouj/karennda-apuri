import React from "react";

const AdminSettings = ({
  adminPassword,
  newPassword,
  setNewPassword,
  onChangeAdminPassword,
  onAdminLogout,
}) => {
  return (
    <div
      style={{
        marginTop: "16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "12px",
      }}
    >
      <h2 style={{ fontSize: "16px", margin: "0 0 8px" }}>管理者設定</h2>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: "12px", marginRight: "4px" }}>現在のパスワード</label>
          <input
            type="password"
            value={adminPassword || ""}
            readOnly
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "12px", marginRight: "4px" }}>新しいパスワード</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="新しいパスワード"
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          onClick={() => {
            if (!newPassword) {
              alert("新しいパスワードを入力してください");
              return;
            }
            if (onChangeAdminPassword) {
              onChangeAdminPassword(newPassword);
              setNewPassword("");
              alert("管理者パスワードを更新しました");
            }
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
          }}
        >
          保存
        </button>
        <button
          onClick={() => {
            if (onAdminLogout) onAdminLogout();
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#ffecec",
          }}
        >
          管理者ログアウト
        </button>
      </div>
      <p style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
        パスワードを変更すると以後のログインに新しい値が使われます。
      </p>
    </div>
  );
};

export default AdminSettings;
