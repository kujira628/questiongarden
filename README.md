# Question Garden（問いの庭）

日々持ち歩く問いと、ふと浮かぶ考えを記録し、問いを育てるための個人用PWA。
A personal PWA for recording and growing your "living questions".

- データはすべてこの端末（IndexedDB）に保存。サーバーもアカウントもなし。
- AIコーチ機能は任意。自分のClaude APIキーを使い、送信前に内容を確認できる。
- 日本語／English 切り替え対応。

## ファイル構成
| ファイル | 役割 |
|---|---|
| index.html | 画面の骨組み |
| styles.css | デザイン（ライト／ダーク） |
| app.js | アプリ本体 |
| i18n.js | 画面の文言（日英）— 文言を直すときはここだけ |
| content.js | 方法論・ヒント（論文）・誘いのテンプレート |
| ai.js | Claude API呼び出しとコーチの指示文 |
| db.js | 端末内データベース |
| sw.js / manifest.webmanifest / icons/ | オフライン動作・ホーム画面アイコン |

## 公開方法（どちらか）
**A. GitHub Pages**：リポジトリに全ファイルを置き、Settings → Pages → Branch: `main` / `(root)` → Save。数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で開ける。
**B. Netlify Drop**：https://app.netlify.com/drop にこのフォルダをドラッグ。

## iPhoneへのインストール
1. SafariでURLを開く（Chromeなどでは不可）
2. 共有ボタン →「ホーム画面に追加」
3. ホーム画面のアイコンから起動

## iPhoneでの制約
- リアルタイム文字起こしは、ホーム画面から起動したアプリでは動かないことが多い。→ キーボードの🎤音声入力を使うのが確実。ボイスメモは音声として保存される。
- アプリを削除するとデータも消える。設定 →「バックアップを書き出す」を定期的に。

## 更新するとき
ファイルを差し替えたら、`sw.js` の `CACHE` の版（例：`qg-v1.0.1`）を上げると確実に新版が反映される。
