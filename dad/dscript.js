// パスワードを確認してフォームを表示する
function checkPassword() {
    const password = document.getElementById('password-input').value;

    if (password === 'minto') {  // パスワードは例として'1234'にしています。
        document.getElementById('password-section').style.display = 'none';
        document.getElementById('form-section').style.display = 'block';
        loadHistory();  // 過去の履歴を表示
    } else {
        alert('パスワードが違います');
    }
}

// フォームを送信して成功メッセージを表示する
function submitForm() {
    const count = document.getElementById('count-input').value;
    const today = new Date().toLocaleDateString();

    if (count !== '') {
        // 成功メッセージを表示
        document.body.style.backgroundColor = '#4CAF50';  // 画面を緑色にする
        document.getElementById('success-message').style.display = 'block';
        
        // デバイスに保存
        saveData(count, today);

        // フォームを隠して履歴セクションを表示
        document.getElementById('form-section').style.display = 'none';
        document.getElementById('history-section').style.display = 'block';

        // 履歴を更新
        loadHistory();
    } else {
        alert('回数を入力してください');
    }
}

// 入力したデータをデバイスに保存する
function saveData(count, date) {
    let history = JSON.parse(localStorage.getItem('dhistory')) || [];
    history.push({ count: parseInt(count), date: date });
    localStorage.setItem('dhistory', JSON.stringify(history));
}

// 保存された履歴を表示し、合計回数や経過日数を計算
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('dhistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    let totalCount = 0;
    let firstDate = null;

    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.date} - 回数: ${entry.count}`;
        historyList.appendChild(li);

        totalCount += entry.count;
        if (!firstDate) {
            firstDate = new Date(entry.date);
        }
    });

    // 合計回数を表示
    document.getElementById('total-count').textContent = `合計回数: ${totalCount}`;

    // 最初の入力日からの日数を表示
    if (firstDate) {
        const today = new Date();
        const timeDiff = Math.abs(today - firstDate);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));  // ミリ秒を日数に変換
        document.getElementById('days-since').textContent = `最初の入力日から経過日数: ${daysDiff}日`;
    }

    if (history.length > 0) {
        document.getElementById('dhistory-section').style.display = 'block';
    }
}

// 履歴を消去する機能
function clearHistory() {
    if (confirm('履歴を本当に消去しますか？')) {
        localStorage.removeItem('dhistory');
        document.getElementById('history-list').innerHTML = '';
        document.getElementById('total-count').textContent = '合計回数: 0';
        document.getElementById('days-since').textContent = '最初の入力日から経過日数: 0日';
        alert('履歴が消去されました');
    }
}