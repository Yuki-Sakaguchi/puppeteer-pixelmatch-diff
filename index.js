/**
 * puppeteer + mixelmatchで２つのサイトのスクショを取って差分を比較する
 */
const puppeteer = require('puppeteer')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
const fs = require('fs')
const del = require('del')

const DIST_PATH = './screenshot/'
const DIFF_PATH = `${DIST_PATH}diff/`
const config = JSON.parse(fs.readFileSync('./settings/config.json', 'utf8'))
const paths = JSON.parse(fs.readFileSync('./settings/targets.json', 'utf8'))

/**
 * 設定通りのスクリーンショットを撮影する
 * @param options 
 */
async function takeScreenshot (options) {
  const page = options.page
  if (options.auth) await page.authenticate(options.auth)
  await page.goto(options.url)
  if (options.waitTime) await page.waitFor(options.waitTime)
  await page.screenshot({
    path: options.dist,
    fullPage: true
  })
}

/**
 * 画像の差分を確認してスクリーンショットを撮影
 * @param {string} name 
 */
function compareScreenshots (diffPath, path1, path2) {
  const defaultCompare = doneReading({
    img1: fs.createReadStream(path1).pipe(new PNG()).on('parsed', () => defaultCompare.next()),
    img2: fs.createReadStream(path2).pipe(new PNG()).on('parsed', () => defaultCompare.next()),
    diffPath
  })
}

/**
 * 差分のチェック
 * @param options 
 */
function* doneReading (options) {
  const img1 = options.img1
  const img2 = options.img2

  let readed = 0
  yield readed++

  const diff = new PNG({
    width: img1.width,
    height: img1.height
  })

  pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    img1.width,
    img2.height,
    {
      threshold: 0.01
    }
  )

  return diff.pack().pipe(fs.createWriteStream(options.diffPath))
}


/**
 * ディレクトリがなければ作る
 */
async function initDir () {
  await del(DIST_PATH) 
  fs.mkdirSync(DIST_PATH)
  
  // configで設定したサイトとdiff用のディレクトリを作成
  for (let path of [...Object.keys(config.sites), 'diff']) {
    if (!fs.existsSync(`${DIST_PATH}${path}`)) {
      fs.mkdirSync(`${DIST_PATH}${path}`)
    }
    for (let dir in config.viewport) {
      if (!fs.existsSync(`${DIST_PATH}${path}/${dir}`)) {
        fs.mkdirSync(`${DIST_PATH}${path}/${dir}`)
      } 
    }
  }
}

/**
 * メイン処理
 */
async function main () {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  for (let [viewportName, viewport] of Object.entries(config.viewport)) {
    // viewport設定
    page.setViewport(viewport)

    // ページごとに開発と本番を撮影
    for (let path of paths) {
      const distFilePath = []
      for (let [key, val] of Object.entries(config.sites)) {
        const dist = `${DIST_PATH}${key}/${viewportName}/${path.name}.png`
        await takeScreenshot({
          page,
          dist,
          url: val.url + path.path,
          waitTime: config.waitTime,
          auth: val.auth,
        })
        distFilePath.push(dist)
      }
      // 差分をチェック
      compareScreenshots(`${DIFF_PATH}${viewportName}/${path.name}.png`, ...distFilePath)
      console.log(`[差分確認完了] ${DIFF_PATH}${viewportName}/${path.name}.png`)
    }
  }

  await browser.close()
}


/**
 * メイン処理
 */
!(async () => {
  console.log('ディレクトリを初期化します')
  await initDir()
  console.log('ディレクトリを初期化しました')

  console.log('メイン処理を実行します')
  await main()
  console.log('メイン処理が完了しました')
})()