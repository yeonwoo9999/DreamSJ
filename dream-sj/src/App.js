import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// ⚠️ 여기에 본인의 Supabase URL과 Anon Key를 넣으세요!
const supabase = createClient('https://your-project.supabase.co', 'your-anon-key-here');

function App() {
  const [prayers, setPrayers] = useState([]);

  // 사이트 접속 시 데이터를 자동으로 불러옵니다.
  useEffect(() => {
    fetchPrayers();
  }, []);

  async function fetchPrayers() {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) console.error("데이터 로드 에러:", error);
    else if (data) setPrayers(data);
  }

  // 1. 새로운 기도제목 등록하기
  const handleAdd = async () => {
    const name = prompt('이름을 입력하세요:');
    if (!name) return;
    const text = prompt('기도제목을 입력하세요:');
    if (!text) return;
    const password = prompt('수정 시 사용할 비밀번호를 설정하세요:');
    if (!password) return;

    const { error } = await supabase
      .from('prayers')
      .insert([{ name, text, password }]);

    if (!error) {
      fetchPrayers(); // 등록 후 리스트 새로고침
      alert('기도제목이 등록되었습니다! 🙏');
    } else {
      alert('등록 실패: ' + error.message);
    }
  };

  // 2. 기존 기도제목 수정하기
  const handleEdit = async (id) => {
    const person = prayers.find(p => p.id === id);
    const inputPw = prompt(`${person.name}님, 비밀번호를 입력하세요:`);

    if (inputPw === person.password) {
      const newText = prompt('새로운 기도제목을 입력하세요:', person.text);
      if (newText) {
        const { error } = await supabase
          .from('prayers')
          .update({ text: newText })
          .eq('id', id);

        if (!error) {
          fetchPrayers(); // 수정 후 리스트 새로고침
          alert('수정 완료!');
        }
      }
    } else {
      alert('비밀번호가 틀렸습니다!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 실시간 기도제목 판</h1>
        
        <button className="add-main-btn" onClick={handleAdd}>
          + 내 기도제목 올리기
        </button>

        <div className="prayer-list">
          {prayers.length === 0 ? (
            <p className="empty-msg">아직 등록된 기도가 없습니다. 첫 기도를 올려보세요!</p>
          ) : (
            prayers.map((p, index) => (
              <div key={p.id} className="prayer-row" onClick={() => handleEdit(p.id)}>
                <div className="row-number">{index + 1}</div>
                <div className="row-content">
                  <span className="row-name">{p.name}</span>
                  <span className="row-text">{p.text}</span>
                </div>
                <div className="row-edit-icon">✏️</div>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;