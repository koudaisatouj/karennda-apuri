import React from "react";

const AccountList = ({ accounts, showAccounts, setShowAccounts }) => {
  return (
    <div
      style={{
        marginTop: "16px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h2 style={{ fontSize: "16px", margin: 0 }}>ユーザーアカウント一覧</h2>
        <button
          onClick={() => setShowAccounts((v) => !v)}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#f4f4f4",
          }}
        >
          {showAccounts ? "折り畳む" : "展開する"}
        </button>
      </div>
      {showAccounts &&
        (accounts.length === 0 ? (
          <p style={{ fontSize: "13px" }}>登録されたアカウントがありません</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: "6px",
                  }}
                >
                  ユーザー名
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: "6px",
                  }}
                >
                  メール
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    padding: "6px",
                  }}
                >
                  電話番号
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, idx) => (
                <tr key={`${acc.username || "user"}-${idx}`}>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "6px" }}>
                    {acc.username || "-"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "6px" }}>
                    {acc.email || "-"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "6px" }}>
                    {acc.phone || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
};

export default AccountList;
