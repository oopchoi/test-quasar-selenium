import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const run = async () => {

  let spawn = require("child_process").spawn;
  let appRootDir = require('app-root-dir').get();
  let chromeServer = appRootDir + '\\node_modules\\.bin\\chromedriver.cmd';
  console.log(chromeServer);

  let bat = spawn(chromeServer, [

  ]);
  // let bat = spawn("C:\\Users\\boneis\\workspace\\test-quasar-selenium\\node_modules\\.bin\\chromedriver.cmd", []);

  // let bat = spawn("cmd.exe", [
  //   "/c",          // Argument for cmd.exe to carry out the specified script
  //   "D:\test.bat", // Path to your file
  //   "argument1",   // First argument
  //   "argumentN"    // n-th argument
  // ]);

  bat.stdout.on("data", (data) => {
    console.log('data: ' + data)
  });

  bat.stderr.on("data", (err) => {
    console.log('error: ' + err)
  });

  bat.on("exit", (code) => {
    console.log('exit: ' + code)
  });

  const webdriver = require('selenium-webdriver')
  const {By, Capabilities} = require('selenium-webdriver')

  console.log('app path')
  console.log(require('electron').app.getAppPath())

  let chromeCapabilities = webdriver.Capabilities.chrome();
  let chromeOptions = { 'args': ['--headless'] };
  chromeCapabilities.set('chromeOptions', chromeOptions);
  chromeCapabilities.setPageLoadStrategy('normal')

  const driver = await new webdriver.Builder()
    // 작동하고 있는 크롬 드라이버의 포트 "9515"를 사용합니다.
    .usingServer('http://localhost:9515')
    .withCapabilities(chromeCapabilities)
    .forBrowser('chrome')
    .build()

  console.log('naver start')
  await driver.get('http://www.naver.com');
  const btn = await driver.findElement(By.id('NM_set_home_btn'));
  console.log(btn.driver_)
  console.log('naver end')

}
run();

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
