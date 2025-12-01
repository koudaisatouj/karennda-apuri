import React from "react";
import { WEEK_LABELS, toLocalYmd } from "./utils";

const CalendarPanel = ({
  today,
  viewYear,
  viewMonth,
  selectedDate,
  weeks,
  holidays,
  reservationsByDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  onToggleHoliday,
}) => {
  const monthLabel = `${viewYear}年 ${viewMonth + 1}月`;
  const todayStr = toLocalYmd(today);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div>
          <button
            onClick={onPrevMonth}
            style={{
              padding: "4px 8px",
              marginRight: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            前の月
          </button>
          <button
            onClick={onNextMonth}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            次の月
          </button>
          <button
            onClick={onToday}
            style={{
              padding: "4px 8px",
              marginLeft: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            今日
          </button>
        </div>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{monthLabel}</div>
      </div>

      <div
        style={{
          borderRadius: "8px",
          border: "1px solid #ddd",
          padding: "12px",
        }}
      >
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
              {WEEK_LABELS.map((w) => (
                <th
                  key={w}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIdx) => (
              <tr key={wIdx}>
                {week.map((day, idx) => {
                  if (!day) {
                    return (
                      <td
                        key={`empty-${idx}`}
                        style={{
                          border: "1px solid #f5f5f5",
                          height: "90px",
                        }}
                      />
                    );
                  }
                  const dateStr = toLocalYmd(day);
                  const items = reservationsByDate[dateStr] || [];
                  const isHoliday = holidays.includes(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === todayStr;
                  const dayOfWeek = day.getDay();
                  const baseBgColor = isHoliday
                    ? "#e6e6e6"
                    : dayOfWeek === 0
                    ? "#ffeaea"
                    : dayOfWeek === 6
                    ? "#e3f2fd"
                    : items.length
                    ? "#fffdf5"
                    : "white";
                  const dayColor =
                    items.length > 0
                      ? "#1b5e20"
                      : isHoliday
                      ? "#555"
                      : dayOfWeek === 0
                      ? "#c62828"
                      : dayOfWeek === 6
                      ? "#1565c0"
                      : "#0f1b35";

                  return (
                    <td
                      key={dateStr}
                      onClick={() => onDayClick(dateStr, items.length > 0)}
                      style={{
                        border: "1px solid #f0f0f0",
                        verticalAlign: "top",
                        padding: "4px",
                        height: "90px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#fff7d1" : baseBgColor,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          marginBottom: "4px",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: dayColor,
                        }}
                      >
                        {day.getDate()}
                        {isToday && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#1976d2",
                              border: "1px solid #1976d2",
                              borderRadius: "8px",
                              padding: "0 4px",
                            }}
                          >
                            今日
                          </span>
                        )}
                        {isHoliday && <span style={{ color: "#d32f2f" }}>休</span>}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: items.length ? "#1b5e20" : "#aaa",
                            backgroundColor: items.length ? "#e8f5e9" : "transparent",
                            border: items.length ? "1px solid #bcd5c2" : "none",
                            borderRadius: "4px",
                            padding: items.length ? "4px 6px" : "0",
                            display: "inline-block",
                            whiteSpace: "normal",
                            lineHeight: "1.2",
                            maxWidth: "100%",
                          }}
                        >
                          {items.length ? `予約あり(${items.length})` : "予約なし"}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", fontSize: "12px" }}>
          <strong>休日設定:</strong>{" "}
          {selectedDate ? (
            <>
              <span>{selectedDate}</span>
              <button
                onClick={() => onToggleHoliday(selectedDate)}
                style={{
                  marginLeft: "8px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                {holidays.includes(selectedDate) ? "休日を解除" : "この日を休日にする"}
              </button>
            </>
          ) : (
            <span>日付をクリックすると選択できます</span>
          )}
        </div>
      </div>
    </>
  );
};

export default CalendarPanel;
