// URLのクエリパラメータから数字を取得
let urlParams = new URLSearchParams(window.location.search);
let preloadedCount = urlParams.get('count'); // 例: ?count=5 で5が取得される

// ページロード時に数字があればフォームに表示しておく
window.onload = function() {
    if (preloadedCount) {
        document.getElementById('count-input').value = preloadedCount;
    }
};

// パスワードを確認してフォームを表示する
function checkPassword() {
    const password = document.getElementById('password-input').value;

    if (password === '1234') {  // パスワードは例として'1234'にしています。
        document.getElementById('password-section').style.display = 'none';
        document.getElementById('form-section').style.display = 'block';

        // URLから取得した数字があれば自動で記録
        if (preloadedCount) {
            submitForm(preloadedCount);  // パスワード認証後に自動で記録
        } else {
            loadHistory();  // 履歴を表示
        }
    } else {
        alert('パスワードが違います');
    }
}

// フォームを送信して成功メッセージを表示する
function submitForm(preloadedValue = null) {
    const count = preloadedValue || document.getElementById('count-input').value;
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
    let history = JSON.parse(localStorage.getItem('mhistory')) || [];
    history.push({ count: parseInt(count), date: date });
    localStorage.setItem('mhistory', JSON.stringify(history));
}

// 保存された履歴を表示し、合計回数や経過日数を計算
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('mhistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    let total = 0;
    let firstDate = null;

    history.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `記録 ${index + 1}: ${entry.count} 回 - 日付: ${entry.date}`;
        historyList.appendChild(listItem);

        // 合計回数を計算
        total += entry.count;

        // 最初の入力日の記録
        if (index === 0) {
            firstDate = new Date(entry.date);
        }
    });

    // 合計回数を表示
    document.getElementById('total-count').textContent = `合計回数: ${total}`;

    // 最初の入力日からの経過日数を表示
    if (firstDate) {
        const today = new Date();
        const daysPassed = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
        document.getElementById('days-passed').textContent = `最初の入力から経過した日数: ${daysPassed}日`;
    }
}

// 履歴を削除する機能
function clearHistory() {
    if (confirm('履歴を本当に削除しますか？')) {
        localStorage.removeItem('mhistory');
        document.getElementById('history-list').innerHTML = '';
        document.getElementById('total-count').textContent = '合計回数: 0';
        document.getElementById('days-passed').textContent = '最初の入力から経過した日数: 0日';
    }
}
