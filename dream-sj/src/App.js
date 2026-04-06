import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient('https://evahmezvdpxcyfhjpmos.supabase.co', 'sb_publishable_vRz20iAfejG5fLHyjY4mMg_aGnT8aTU');

function App() {
  const [prayers, setPrayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // 상태 관리 (수정 시에도 사용)
  const [editingId, setEditingId] = useState(null); // 수정 중인 row의 ID (null이면 새 글)
  const [inputs, setInputs] = useState(['']); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchPrayers();
  }, []);

  async function fetchPrayers() {
    const { data } = await supabase.from('prayers').select('*').order('created_at', { ascending: true });
    if (data) setPrayers(data);
  }

  // 모달 닫기 및 초기화
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setName('');
    setPassword('');
    setInputs(['']);
  };

  // 수정하기 클릭 시 (기존 카드 클릭)
  const handleEditClick = (p) => {
    const inputPw = prompt(`${p.name}님, 설정하신 비밀번호를 입력하세요:`);
    if (inputPw === p.password) {
      setEditingId(p.id); // 수정 모드 활성화
      setName(p.name);
      setPassword(p.password);
      
      // 기존 텍스트들(text1~text10) 중 데이터가 있는 것만 inputs에 담기
      let existingTexts = [];
      for (let i = 1; i <= 10; i++) {
        if (p[`text${i}`]) existingTexts.push(p[`text${i}`]);
      }
      setInputs(existingTexts.length > 0 ? existingTexts : ['']);
      setShowModal(true);
    } else if (inputPw !== null) {
      alert('비밀번호가 틀렸습니다!');
    }
  };

  const addInputLine = () => {
    if (inputs.length < 10) setInputs([...inputs, '']);
    else alert('최대 10개까지만 등록 가능합니다.');
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  // 저장 로직 (새 글 등록 & 수정 통합)
  const handleSave = async () => {
    if (!name || !password || inputs.filter(t => t.trim() !== '').length === 0) {
      alert('이름, 비밀번호, 그리고 최소 하나의 기도제목은 입력해야 합니다.');
      return;
    }

    // 10개 컬럼 초기화 데이터 생성 (수정 시 기존 데이터를 덮어쓰기 위함)
    let prayerData = { name, password };
    for (let i = 1; i <= 10; i++) {
      prayerData[`text${i}`] = inputs[i - 1] || null; 
    }

    let error;
    if (editingId) {
      // 수정 모드 (Update)
      const result = await supabase.from('prayers').update(prayerData).eq('id', editingId);
      error = result.error;
    } else {
      // 새 글 모드 (Insert)
      const result = await supabase.from('prayers').insert([prayerData]);
      error = result.error;
    }

    if (!error) {
      closeModal();
      fetchPrayers();
      alert(editingId ? '수정되었습니다! ✨' : '등록되었습니다! 🙏');
    } else {
      alert('실패: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 주간 기도제목</h1>
        <button className="add-main-btn" onClick={() => setShowModal(true)}>+ 기도제목 작성하기</button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingId ? '기도제목 수정하기' : '기도제목 올리기'}</h2>
              <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
              
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
                <button className="cancel-btn" onClick={closeModal}>취소</button>
              </div>
            </div>
          </div>
        )}

        <div className="prayer-list">
          {prayers.map((p) => (
            <div key={p.id} className="prayer-card" onClick={() => handleEditClick(p)} style={{cursor: 'pointer'}}>
              <div className="card-header">
                👤 {p.name}님의 기도 
                <span style={{fontSize: '0.8rem', color: '#ccc', float: 'right'}}>✏️ 수정</span>
              </div>
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