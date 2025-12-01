import { useState } from "react";

function App() {
  // タスクの配列（例: ["買い物に行く", "勉強する"]）
  const [tasks, setTasks] = useState([]);
  // 入力中の文字（テキストボックスの中身）
  const [inputText, setInputText] = useState("");

  // テキストボックスの入力が変わったときに呼ばれる
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  // 「追加」ボタンを押したときに呼ばれる
  const handleAddTask = () => {
    // 何も入力されていなかったら追加しない
    if (inputText.trim() === "") return;

    // 新しいタスク用のオブジェクト（id付き）
    const newTask = {
      id: Date.now(),      // 一意なID（簡易的に現在時刻）
      title: inputText,    // 入力した文字
    };

    // 既存の配列 + 新しいタスク で新しい配列を作る
    setTasks([...tasks, newTask]);

    // テキストボックスを空にする
    setInputText("");
  };

  // 削除ボタンを押したタスクを消す
  const handleDeleteTask = (id) => {
    // id が一致しないものだけ残す = そのタスクだけ消える
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1>TODOアプリ</h1>

      {/* 入力フォーム */}
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="タスクを入力してください"
      />
      <button onClick={handleAddTask}>追加</button>

      {/* タスク一覧 */}
      <h2>タスク一覧</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button
              onClick={() => handleDeleteTask(task.id)}
              style={{ marginLeft: "8px" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
