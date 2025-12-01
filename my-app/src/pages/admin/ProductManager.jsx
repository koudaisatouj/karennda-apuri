import React from "react";

const labelStyle = { fontSize: "12px", color: "#0f1b35", marginBottom: "4px" };
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "rgba(255,255,255,0.9)",
};

const ProductManager = ({
  showProducts,
  setShowProducts,
  editedProducts,
  onChangeProduct,
  onSaveProducts,
  newProduct,
  setNewProduct,
  onAddProduct,
}) => {
  const renderInputGrid = (product, onChange) => (
    <div
      key={product.id || "new"}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "8px",
        display: "grid",
        gap: "6px",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        alignItems: "center",
      }}
    >
      <div>
        <div style={labelStyle}>商品名</div>
        <input
          value={product.name}
          onChange={(e) => onChange("name", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <div style={labelStyle}>価格</div>
        <input
          type="number"
          value={product.price}
          onChange={(e) => onChange("price", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <div style={labelStyle}>在庫</div>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => onChange("stock", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <div style={labelStyle}>画像URL</div>
        <input
          value={product.image || ""}
          onChange={(e) => onChange("image", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <div style={labelStyle}>1回の購入上限</div>
        <input
          type="number"
          value={product.maxPerOrder ?? ""}
          onChange={(e) => onChange("maxPerOrder", e.target.value)}
          style={inputStyle}
          placeholder="0 で制限なし"
        />
      </div>
    </div>
  );

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
        <h2 style={{ fontSize: "16px", margin: 0 }}>購入予約用 商品の管理</h2>
        <button
          onClick={() => setShowProducts((v) => !v)}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#f4f4f4",
          }}
        >
          {showProducts ? "折り畳む" : "展開する"}
        </button>
      </div>

      {showProducts && (
        <>
          {editedProducts.length === 0 ? (
            <p style={{ fontSize: "13px" }}>商品が登録されていません</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {editedProducts.map((p) =>
                renderInputGrid(p, (key, value) => onChangeProduct(p.id, key, value))
              )}
              <button
                onClick={onSaveProducts}
                style={{
                  alignSelf: "flex-start",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                }}
              >
                商品の変更を保存
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: "12px",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {renderInputGrid(
              {
                id: "new",
                name: newProduct.name || "",
                price: newProduct.price || "",
                stock: newProduct.stock || "",
                image: newProduct.image || "",
                maxPerOrder: newProduct.maxPerOrder || "",
              },
              (key, value) => setNewProduct((v) => ({ ...v, [key]: value }))
            )}
            <button
              onClick={onAddProduct}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "#e8f5e9",
                height: "38px",
                alignSelf: "flex-end",
              }}
            >
              商品を追加
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
