// import { app, BrowserWindow, ipcMain } from "electron";
// import { createRequire } from "node:module";
// import { fileURLToPath } from "node:url";
// import path from "node:path";
// import * as os from "os";
// const require2 = createRequire(import.meta.url);
// const pty = require2("node-pty-prebuilt-multiarch");
// createRequire(import.meta.url);
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// process.env.APP_ROOT = path.join(__dirname, "..");
// const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
// const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
// const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
// process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
//   ? path.join(process.env.APP_ROOT, "public")
//   : RENDERER_DIST;
// let win;
// function createWindow() {
//   win = new BrowserWindow({
//     width: 1280,
//     height: 720,
//     icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
//     webPreferences: {
//       preload: path.join(__dirname, "preload.mjs"),
//       nodeIntegration: true,
//     },
//   });
//   win.setMenuBarVisibility(false);
//   win.webContents.on("did-finish-load", () => {
//     win == null
//       ? void 0
//       : win.webContents.send(
//           "main-process-message",
//           /* @__PURE__ */ new Date().toLocaleString(),
//         );
//   });
//   if (VITE_DEV_SERVER_URL) {
//     win.loadURL(VITE_DEV_SERVER_URL);
//   } else {
//     win.loadFile(path.join(RENDERER_DIST, "index.html"));
//   }
//   const ptyProcess = pty.spawn("bash", [], {
//     name: "xterm-color",
//     cols: 80,
//     rows: 30,
//     // cwd: process.cwd(),
//     cwd: os.homedir(),
//     env: process.env,
//   });
//   ptyProcess.on("data", function (data) {
//     win.webContents.send("terminal.incomingData", data);
//     console.log(data);
//   });
//   ipcMain.on("terminal.keystroke", (event, key) => {
//     ptyProcess.write(key);
//   });
// }
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//     win = null;
//   }
// });
// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
// app.whenReady().then(createWindow);
// export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };


import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as os from "os";
const require2 = createRequire(import.meta.url);
const pty = require2("node-pty-prebuilt-multiarch");
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;
let win;
let ptyProcess;

function createWindow() {
  win = new BrowserWindow({
    // width: 1280,
    // height: 720,
    width: 1920,
    height: 1080,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
    },
  });
  win.setMenuBarVisibility(false);
  win.webContents.on("did-finish-load", () => {
    win == null
      ? void 0
      : win.webContents.send(
          "main-process-message",
          /* @__PURE__ */ new Date().toLocaleString(),
        );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function spawnShell() {
  ptyProcess = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 60,
    // cwd: process.cwd(),
    cwd: os.homedir(),
    env: process.env,
  });

  ptyProcess.on("data", function (data) {
    if (win) {
      win.webContents.send("terminal.incomingData", data);
    }
    console.log(data);
  });

  ptyProcess.on("exit", (code) => {
    console.log("Terminal shell exited with code:", code, ". Respawning shell...");
    // Respawn a new shell upon exit
    spawnShell();
  });
}

// Initially spawn the terminal shell
spawnShell();

// Update the ipcMain listener to use the current ptyProcess
ipcMain.on("terminal.keystroke", (event, key) => {
  if (ptyProcess) {
    ptyProcess.write(key);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };