const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require('fs');
const child_process = require("child_process");

app.whenReady().then(() => {
    const win = create_main_win();
    win.loadFile(path.join(__dirname, "./index.html"))
})

// 创建服务器方法
const create_server = (name, port, router, static) => {
    if (!static) { static = "default" }
    if (!port) { port = 80 }
    const server_info = {
        "name": name,
        "port": port,
        "router": router,
        "static": static
    }
    if (!Number.isInteger(port)) { return [false, "please set a portNum as an integer"] }
    const data = `const express = require("express");
    const cors=require("cors")
    const path=require("path")
    const app = express();
    const fs=require("fs")
    const {name,port,router:routername,static}=JSON.parse(fs.readFileSync(path.join(__dirname, "./serverset/" + "${name}set.json")))
    const router = require(path.join(__dirname, "../router",routername+".js"))
    app.listen(port,() => console.log("start"))
    app.use(cors())
    app.use("/", express.static(path.join(__dirname, "../public/" + static)))
    app.use(router);`
    const server_dir = fs.readdirSync(path.join(__dirname, "../server"))
    const router_dir = fs.readdirSync(path.join(__dirname, "../router"))
    let isExistServer = true
    let isExistRouter = false
    for (i = 0; i < server_dir.length; i++) {
        if (server_dir[i] == name + ".js") { isExistServer = false; break }
    }
    for (i = 0; i < router_dir.length; i++) {
        if (router_dir[i] == router + ".js") { isExistRouter = true; break }
    }
    if (!isExistServer) { return [false, "Create false course :" + name + " is exist"] }
    if (!isExistRouter) { return [false, "Router '" + router + "' doesn`t exist"] }
    fs.writeFileSync(path.join(__dirname, `../server/${name}.js`), data)
    fs.writeFileSync(path.join(__dirname, `../server/serverset/${name}set.json`), JSON.stringify(server_info))
    return [true, "successfully"]
}
// 启动服务器
const start_server = (name) => {
    const cp = child_process.fork(path.join(__dirname, `../server/${name}.js`))
    ipcMain.handleOnce(`kill_server_${name}`, () => { cp.kill(); console.log("kill"); })
    return [true, "isrunning"]
}
// 删除服务器方法
const delete_server = (name) => {
    fs.unlinkSync(path.join(__dirname, `../server/${name}.js`))
    fs.unlinkSync(path.join(__dirname, "../server/serverset/" + name + "set.json"))
}
// 
const get_server_dir = () => {
    const serverArr = []
    const serverdir = fs.readdirSync(path.join(__dirname, "../server/serverset"))
    serverdir.forEach(ele => {
        serverArr.push(JSON.parse(fs.readFileSync(path.join(__dirname, "../server/serverset/" + ele))))
    })
    return serverArr
}

// 创建窗口
const create_main_win = () => {
    return new BrowserWindow({
        height: 600,
        width: 600,
        minHeight: 600,
        minWidth: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            devTools: false
        },
        titleBarStyle: "hidden",
    });
}

// handle
ipcMain.handle("get_server_dir", () => {
    return get_server_dir()
})

ipcMain.handle("create_server", (event, s_prop) => {
    return create_server(s_prop[0], s_prop[1], s_prop[2], s_prop[3])
})

ipcMain.handle("start_server", (event, s_prop) => {
    return start_server(s_prop[0])
})

ipcMain.handle("close_win", () => {
    return app.exit();
})

ipcMain.handle("get_router_dir", () => {
    return fs.readdirSync(path.join(__dirname, "../router"))
})

ipcMain.handle("get_router", (event, args) => {
    return fs.readFileSync(path.join(__dirname, "../router", args[0] + ".js"))
})

ipcMain.handle("save_file", (event, args) => {
    return fs.writeFileSync(args[0], args[1])
})

ipcMain.handle("del_server", (event, args) => {
    return delete_server(args[0])
})

ipcMain.handle("get_public_dir", () => {
    return fs.readdirSync(path.join(__dirname, "../public"))
})

ipcMain.handle("open_public_folder", (event, args) => {
    child_process.spawn("explorer.exe", [path.join(__dirname, "../public/" + args[0])])
})

ipcMain.handle("create_public_dir", (event, args) => {
    return fs.mkdirSync(path.join(__dirname, "../public/" + args[0]))
})

ipcMain.handle("open_router_file", (event, args) => {
    return fs.readFileSync(path.join(__dirname, "../router/" + args[0]), "utf-8")
})

ipcMain.handle("post_router_file", (event, args) => {
    return fs.writeFileSync(path.join(__dirname, "../router/" + args[0]), args[1])
})

ipcMain.handle("del_public_dir", (event, args) => {
    return fs.rmdirSync(path.join(__dirname, "../public", args[0]))
})