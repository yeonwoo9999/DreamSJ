import React, { useState } from 'react';
import './App.css';

function App() {
// 기도제목 데이터 (나중에 DB와 연동 가능)
  const [prayers, setPrayers] = useState([
    { id: 1, name: '방송미', text: '입력해주세요', password: '123' },
    { id: 2, name: '남경리', text: '입력해주세요', password: '123' },
    { id: 3, name: '강준희', text: '입력해주세요', password: '123' },
    { id: 4, name: '김예진', text: '입력해주세요', password: '123' },
    { id: 5, name: '김혜진', text: '입력해주세요', password: '123' },
    { id: 6, name: '박은진', text: '입력해주세요', password: '123' },
    { id: 7, name: '박하영', text: '입력해주세요', password: '123' },
    { id: 8, name: '이슬', text: '입력해주세요', password: '123' },
    { id: 9, name: '정연우', text: '입력해주세요', password: '123' },
    { id: 10, name: '정지윤', text: '입력해주세요', password: '123' },
  ]);

  const handleEdit = (id) => {
    const person = prayers.find(p => p.id === id);
    const inputPw = prompt(`${person.name}님, 비밀번호를 입력하세요:`);

    if (inputPw === person.password) {
      const newText = prompt('새로운 기도제목을 입력하세요:', person.text);
      if (newText) {
        setPrayers(prayers.map(p => p.id === id ? { ...p, text: newText } : p));
      }
    } else {
      alert('비밀번호가 틀렸습니다!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 주간 기도제목</h1>
        <div className="prayer-grid">
          {prayers.map(p => (
            <div key={p.id} className="prayer-card" onClick={() => handleEdit(p.id)}>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              <small>(클릭하여 수정)</small>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
