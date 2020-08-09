# サイトの差分確認の自動化
jsonで設定したサイトのスクショを撮影し、差分だけ赤く目立たせる差分画像を作成する。

## 実行
以下を実行すると`screenshot`ディレクトリが作成され、スクリーンショットを作成する。  
`screenshot/diff`に差分画像が書き出される。
```
npm run start
```

## 設定
### settings/config.json
主な設定はこのjsonで設定する。  
- サイトドメイン
- basic認証
- 撮影するviewport
- 撮影するまでのwaitTime

### settings/targets.json
サイトのパスはこのjsonで設定する。  

## 主なライブラリ
- puppeteer
- pixelmatch
