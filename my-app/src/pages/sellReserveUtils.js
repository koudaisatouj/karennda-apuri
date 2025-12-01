import bgImage from "../background.png";

export const DAY_RANGE = 40;
export const SLOT_MINUTES = 30;
export const OPEN_MINUTES = 10 * 60;
export const CLOSE_MINUTES = 19 * 60;

export const TEXT = {
  title: "買取予約",
  select: "選択してください",
  date: "日付:",
  time: "時間:",
  rangePrefix: "予約できる期間: ",
  required: "すべての項目を入力してください",
  rangeAlert: "予約できるのは今日から40日までです",
  submit: "予約する",
  cancel: "キャンセル",
  completed: "買取予約が完了しました",
  titleLabel: "タイトル:",
  quantityLabel: "枚数:",
  priceLabel: "査定額（入力は任意）:",
  bookedNote:
    "注意: このタイトルは既存の予約時間帯と重ならないようにしてください。1タイトルにつき1枠まで予約可能です。",
};

export const backgroundStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "24px",
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const panelStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "12px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
  padding: "24px",
  maxWidth: "620px",
  margin: "0 auto",
  overflow: "visible",
};

export const fieldStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "white",
};

export const toLocalYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const parseYmd = (value) => {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    ? dt
    : null;
};

export const calcDurationFromQuantity = (qty) => {
  const num = Number(qty);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.max(SLOT_MINUTES, Math.ceil(num / 500) * SLOT_MINUTES);
};

export const timeStrToMinutes = (value) => {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

export const minutesToTimeStr = (minutes) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const isWithinRange = (ymd, startDate, endDate) => {
  const dt = parseYmd(ymd);
  if (!dt) return false;
  return dt >= startDate && dt <= endDate;
};
