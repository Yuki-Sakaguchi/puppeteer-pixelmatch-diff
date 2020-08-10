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

## 参考
- https://qiita.com/parada/items/fda297075204ae274a9a
- https://qiita.com/taminif/items/1ba7f68aedd68bae5e09
- https://qiita.com/teradonburi/items/72dcb3816e3e2a6ee1e6
- https://www.gesource.jp/weblog/?p=7672
- https://solutionware.jp/blog/2019/01/01/puppeteer%E3%81%AB%E3%82%88%E3%82%8Bweb%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0-%E5%9F%BA%E7%A4%8E%E7%B7%A8/
