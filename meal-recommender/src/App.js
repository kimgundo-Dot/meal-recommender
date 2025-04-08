// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const ingredientTags = ["쌀밥", "잡곡밥", "닭고기", "돼지고기", "해산물", "두부", "채소", "계란"];
const tasteTags = ["매움", "짭짤함", "담백함", "구수함", "단맛"];

function App() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRecommend = async () => {
    try {
      console.log("📤 보낼 태그:", selectedTags);

      const res = await axios.post("http://localhost:5000/recommend", {
        tags: selectedTags,
      });

      console.log("📥 받은 응답:", res.data);

      if (res.data && typeof res.data === "object") {
        const sets = Object.entries(res.data); // [["아침", {...}], ["점심", {...}], ...]
        setRecommendations(sets);
      } else {
        console.error("추천 결과 없음");
        setRecommendations([]);
      }
    } catch (err) {
      console.error("추천 실패:", err);
      setRecommendations([]);
    }
  };

  return (
    <div className="App">
      <h1>🍱 자동 식단 추천</h1>

      {/* 재료 태그 그룹 */}
      <div className="tag-section">
        <h3 className="tag-title">🥬 재료 태그</h3>
        <div className="tag-box">
          {ingredientTags.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${selectedTags.includes(tag) ? "selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 맛 태그 그룹 */}
      <div className="tag-section">
        <h3 className="tag-title">🎨 맛 태그</h3>
        <div className="tag-box">
          {tasteTags.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${selectedTags.includes(tag) ? "selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 추천 버튼 */}
      <button onClick={handleRecommend}>추천받기</button>

      {/* 추천 결과 카드 영역 */}
      <div className="card-container">
        {Array.isArray(recommendations) && recommendations.length > 0 ? (
          <>
          {recommendations.map(([mealTime, item], index) => (
            <div className="card" key={index}>
              <h2>🍽️ {mealTime} 추천 세트</h2>
              <p><strong>🍚 밥:</strong> {item["밥"]}</p>
              <p><strong>🥗 반찬:</strong> {item["반찬"]}</p>
              <p><strong>🍲 국:</strong> {item["국"]}</p>
              <p><strong>🔥 총 칼로리:</strong> {item["칼로리"]} kcal</p>
              <p><strong>⭐ 유사도 점수:</strong> {item["점수"]}</p>
              <p><strong>🏷️ 태그:</strong> {item["세트태그"]?.join(", ") || "없음"}</p>
            </div>
          ))}

          {/* ✅ 하루 총 칼로리 표시 */}
          <div className="total-kcal">
          🔥 하루 총 칼로리:{" "}
          {recommendations
            .map(([_, item]) => item["칼로리"])
            .reduce((a, b) => a + b, 0)} kcal
          </div>
        </>
        ) : (
          <p style={{ textAlign: "center" }}>
            👉 아직 추천 결과가 없습니다. 태그를 선택하고 추천받기를 눌러보세요.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
