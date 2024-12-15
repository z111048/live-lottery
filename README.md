# 即時抽獎系統前端

本專案為即時抽獎系統的前端，提供管理員與用戶互動的介面，結合 WebSocket 技術進行即時數據更新。

## 功能特點

- **管理員登入**：通過密碼認證登入管理員模式。
- **上傳獎項清單**：支援 CSV 格式的獎項清單。
- **即時抽獎**：顯示動態轉盤和中獎結果。
- **在線用戶數**：實時顯示當前連接的用戶數。

---

## 環境需求

- Node.js (版本 >= 16)
- 瀏覽器支援 WebSocket 技術

---

## 安裝與啟動

### 1. 克隆專案

```bash
git clone https://github.com/你的帳號/你的專案名.git
cd 你的專案名
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 本地開發啟動

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:5173](http://localhost:5173)。

---

## 部署

### 使用 GitHub Pages 部署

1. 編輯專案中的 `vite.config.js`：

   ```javascript
   export default defineConfig({
     base: '/你的倉庫名/', // 替換為你的 GitHub Repository 名稱
   });
   ```

2. 推送代碼到 GitHub。

   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

3. 確保 `.github/workflows/deploy.yml` 已設置 GitHub Actions 進行自動部署。

4. 訪問部署後的 GitHub Pages 網址：
   ```
   https://你的帳號.github.io/你的倉庫名/
   ```

---

## 環境變數設置

專案使用 `.env` 文件來管理環境變數，例如 WebSocket 伺服器的 URL：

### 本地 `.env` 文件

在專案根目錄創建 `.env` 文件：

```env
VITE_WS_URL=你的WebSocket伺服器地址
```

### 注意

確保 `.env` 文件已加入 `.gitignore`，避免敏感信息洩露。

---

## 技術棧

- **框架**：React.js
- **工具**：Vite
- **數據傳輸**：WebSocket
- **樣式**：CSS

---

## 參與貢獻

1. Fork 此專案。
2. 創建新分支進行開發。
3. 提交 PR（Pull Request）。

---

## 授權

本專案採用 MIT 授權許可。

---
