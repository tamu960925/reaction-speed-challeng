class ReactionGame {
    constructor() {
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.startButton = document.getElementById('start-button');
        this.retryButton = document.getElementById('retry-button');
        this.message = document.getElementById('message');
        this.reactionTimeDisplay = document.getElementById('reaction-time');
        this.bestTimeDisplay = document.getElementById('best-time');
        this.newRecordDisplay = document.getElementById('new-record');

        this.startTime = 0;
        this.timeoutId = null;
        this.isWaiting = false;
        this.bestTime = this.loadBestTime();

        this.initializeEventListeners();
        this.updateBestTimeDisplay();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.retryButton.addEventListener('click', () => this.showStartScreen());
        this.gameScreen.addEventListener('click', (e) => this.handleGameClick(e));
    }

    loadBestTime() {
        const bestTime = localStorage.getItem('bestReactionTime');
        return bestTime ? parseInt(bestTime) : null;
    }

    saveBestTime(time) {
        localStorage.setItem('bestReactionTime', time.toString());
        this.bestTime = time;
    }

    updateBestTimeDisplay() {
        this.bestTimeDisplay.textContent = this.bestTime ? this.bestTime : '---';
    }

    showScreen(screen) {
        [this.startScreen, this.gameScreen, this.resultScreen].forEach(s => 
            s.classList.add('hidden')
        );
        screen.classList.remove('hidden');
    }

    showStartScreen() {
        this.showScreen(this.startScreen);
        this.gameScreen.classList.remove('waiting', 'ready');
    }

    startGame() {
        this.showScreen(this.gameScreen);
        this.gameScreen.classList.add('waiting');
        this.message.textContent = '準備中...';
        this.isWaiting = true;

        // ランダムな待機時間（1-3秒）を設定
        const waitTime = Math.random() * 2000 + 1000;
        this.timeoutId = setTimeout(() => {
            this.startReactionPhase();
        }, waitTime);
    }

    startReactionPhase() {
        this.gameScreen.classList.remove('waiting');
        this.gameScreen.classList.add('ready');
        this.message.textContent = 'タップ！';
        this.startTime = Date.now();
        this.isWaiting = false;
    }

    handleGameClick(e) {
        if (this.isWaiting) {
            // 待機中のクリック
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            this.showResult('早すぎます！');
            return;
        }

        if (this.startTime) {
            const reactionTime = Date.now() - this.startTime;
            this.showResult(reactionTime);
            this.startTime = 0; // リセット
        }
    }

    showResult(result) {
        this.showScreen(this.resultScreen);
        this.gameScreen.classList.remove('waiting', 'ready');
        this.timeoutId = null;
        this.startTime = 0;
        this.isWaiting = false;

        if (typeof result === 'number') {
            this.reactionTimeDisplay.textContent = result;
            
            // 自己ベストの更新チェック
            if (!this.bestTime || result < this.bestTime) {
                this.saveBestTime(result);
                this.updateBestTimeDisplay();
                this.newRecordDisplay.classList.remove('hidden');
            } else {
                this.newRecordDisplay.classList.add('hidden');
            }
        } else {
            this.reactionTimeDisplay.textContent = result;
            this.newRecordDisplay.classList.add('hidden');
        }
    }
}

// ゲームのインスタンスを作成
document.addEventListener('DOMContentLoaded', () => {
    new ReactionGame();
});