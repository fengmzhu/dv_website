# 專案部署與架構說明

本文件說明本專案的架構、目錄結構、開發與部署流程。

## 一、專案簡介

本專案為一個以 Docker 容器化的專案工作量追蹤系統，包含：
- **首頁（index.html）**：用於提交新專案資料的表單。
- **儀表板（dashboard.html）**：以圖表方式呈現已提交的資料。
- **檔案上傳頁（upload.html）**：支援批次上傳功能。

## 二、專案目錄結構

```
lamp_website/
├── docker/           # Docker 相關設定
│   ├── db/           # 資料庫初始化 SQL
│   └── web/          # Web 服務 Dockerfile
├── guide/            # 說明文件
├── logs/             # 應用程式運行日誌
├── reference/        # 參考資料與範例
├── src/              # 前後端原始碼
│   ├── api/          # PHP API 檔案
│   ├── css/          # 樣式表
│   ├── js/           # 前端 JS
│   ├── logs/         # PHP 錯誤日誌
│   ├── dashboard.html
│   ├── index.html
│   ├── upload.html
├── docker-compose.yml# Docker Compose 設定
├── website.plan      # 專案規劃文件
```

## 三、技術棧

- **後端**：PHP 8.2
- **Web 伺服器**：Apache（容器內）
- **資料庫**：MySQL 8.0
- **前端**：HTML、CSS、JavaScript
- **容器化**：Docker & Docker Compose

## 四、主要檔案與資料夾說明

- `src/api/`：
  - `db_connect.php`：資料庫連線
  - `get_data.php`：查詢資料API
  - `submit_entry.php`：提交新資料API
  - `preview_upload.php`：上傳預覽API
  - `batch_insert.php`：批次匯入API
- `src/js/`：
  - `main.js`：首頁互動邏輯
  - `dashboard.js`：儀表板互動邏輯
  - `upload.js`：上傳頁互動邏輯
- `src/css/`：
  - `main.css`：主要樣式表
- `logs/`、`src/logs/`：應用程式與PHP錯誤日誌
- `reference/`：參考資料、範例程式、資料集
- `guide/`：說明文件
- `website.plan`：專案規劃與需求文件

## 五、開發環境建置

1. **安裝 Docker Desktop**
2. **建立環境變數檔 `.env.local`**（於專案根目錄）：
   ```
   MYSQL_ROOT_PASSWORD=lamp_root_password
   MYSQL_DATABASE=lamp_db
   MYSQL_USER=lamp_user
   MYSQL_PASSWORD=lamp_password
   ```
3. **啟動服務**：
   ```bash
   docker compose --env-file .env.local up -d --build
   ```
4. **服務存取**：
   - 網頁前端：http://localhost:8080
   - PhpMyAdmin：http://localhost:8081（帳號 root，密碼 lamp_root_password）

## 六、生產環境部署建議

- 建議於雲端主機（如 AWS EC2 Ubuntu 22.04）安裝 Docker 與 Docker Compose。
- 需自行建立 `.env.prod`（內容同上，請使用強密碼）。
- 若需反向代理與 HTTPS，建議額外建立 Caddy 或 Nginx 設定檔。
- 目前專案未內建 `docker-compose.prod.yml` 與 `Caddyfile`，請依需求自行新增。

## 七、開發流程建議

- **新增 API**：於 `src/api/` 新增 PHP 檔案，並於前端 JS 呼叫。
- **新增前端頁面**：於 `src/` 新增 HTML，JS 於 `src/js/`，CSS 於 `src/css/`。
- **日誌查詢**：應用程式日誌於 `logs/`，PHP 錯誤日誌於 `src/logs/php_errors.log`。

## 八、其他

- 參考資料與範例程式請見 `reference/`。
- 詳細需求與規劃請見 `website.plan`。

如有問題，請參考 guide/ 內其他說明文件或聯絡專案負責人。 