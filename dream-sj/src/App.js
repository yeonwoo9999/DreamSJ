import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient('https://evahmezvdpxcyfhjpmos.supabase.co', 'sb_publishable_vRz20iAfejG5fLHyjY4mMg_aGnT8aTU');

function App() {
  const [prayers, setPrayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState(['']); // 기본 입력창 1개
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchPrayers();
  }, []);

  async function fetchPrayers() {
    const { data } = await supabase.from('prayers').select('*').order('created_at', { ascending: true });
    if (data) setPrayers(data);
  }

  // 입력창 추가 함수
  const addInputLine = () => {
    if (inputs.length < 10) {
      setInputs([...inputs, '']);
    } else {
      alert('최대 10개까지만 등록 가능합니다.');
    }
  };

  // 특정 입력창의 텍스트 변경
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  // DB에 저장
  const handleSave = async () => {
    if (!name || !password || inputs[0] === '') {
      alert('이름, 비밀번호, 그리고 최소 하나의 기도제목은 입력해야 합니다.');
      return;
    }

    let prayerData = { name, password };
    inputs.forEach((text, i) => {
      if (text) prayerData[`text${i + 1}`] = text;
    });

    const { error } = await supabase.from('prayers').insert([prayerData]);

    if (!error) {
      setShowModal(false);
      setName(''); setPassword(''); setInputs(['']);
      fetchPrayers();
      alert('등록되었습니다! 🙏');
    } else {
      alert('실패: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 주간 기도제목</h1>
        <button className="add-main-btn" onClick={() => setShowModal(true)}>+ 기도제목 작성하기</button>

        {/* 작성 모달창 */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>기도제목 올리기</h2>
              <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="password" placeholder="비밀번호(수정용)" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              <div className="input-list">
                {inputs.map((text, i) => (
                  <div key={i} className="input-row">
                    <span>{i + 1}.</span>
                    <input 
                      type="text" 
                      placeholder="기도제목을 입력하세요" 
                      value={text} 
                      onChange={(e) => handleInputChange(i, e.target.value)} 
                    />
                  </div>
                ))}
              </div>

              <button className="add-line-btn" onClick={addInputLine}>+ 항목 추가</button>
              
              <div className="modal-btns">
                <button className="save-btn" onClick={handleSave}>저장</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 리스트 출력 */}
        <div className="prayer-list">
          {prayers.map((p) => (
            <div key={p.id} className="prayer-card">
              <div className="card-header">👤 {p.name}님의 기도</div>
              <div className="card-content">
                {[...Array(10)].map((_, i) => {
                  const val = p[`text${i + 1}`];
                  return val ? <div key={i} className="item">{i + 1}. {val}</div> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;