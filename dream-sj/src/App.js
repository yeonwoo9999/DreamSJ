import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient('https://evahmezvdpxcyfhjpmos.supabase.co', 'sb_publishable_vRz20iAfejG5fLHyjY4mMg_aGnT8aTU');

function App() {
  const [prayers, setPrayers] = useState([]);

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

  const handleAdd = async () => {
    const name = prompt('이름을 입력하세요:');
    if (!name) return;
    const password = prompt('비밀번호를 설정하세요:');
    if (!password) return;

    const count = parseInt(prompt('기도제목을 몇 개 작성하실 건가요? (1~10)', '1'));
    if (isNaN(count) || count < 1 || count > 10) {
      alert('1에서 10 사이의 숫자만 입력해주세요.');
      return;
    }

    let prayerData = { name, password };
    for (let i = 1; i <= count; i++) {
      const t = prompt(`${i}번 기도제목을 입력하세요:`);
      if (t) prayerData[`text${i}`] = t; // text1, text2... 형식으로 저장
    }

    const { error } = await supabase.from('prayers').insert([prayerData]);

    if (!error) {
      fetchPrayers();
      alert('등록되었습니다! 🙏');
    } else {
      alert('등록 실패: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 주간 기도제목</h1>
        <button className="add-main-btn" onClick={handleAdd}>+ 내 기도제목 올리기</button>

        <div className="prayer-list">
          {prayers.length === 0 ? (
            <p className="empty-msg">등록된 기도가 없습니다.</p>
          ) : (
            prayers.map((p) => (
              <div key={p.id} className="prayer-card">
                <div className="card-header">
                  <span className="user-name">👤 {p.name}님의 기도</span>
                </div>
                <div className="card-content">
                  {/* 1번부터 10번까지 데이터가 있는 것만 출력 */}
                  {[...Array(10)].map((_, i) => {
                    const textVal = p[`text${i + 1}`];
                    return textVal ? (
                      <div key={i} className="prayer-item">
                        <span className="item-num">{i + 1}.</span> {textVal}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;