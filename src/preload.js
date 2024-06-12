const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld("version", {
    start_server: (name) => {
        return ipcRenderer.invoke("start_server", [name])
    },
    close_win: () => {
        ipcRenderer.invoke("close_win")
    },
    get_router: (router_name) => {
        return ipcRenderer.invoke("get_router", (router_name))
    },
    get_router_dir: () => {
        return ipcRenderer.invoke("get_router_dir")
    },
    get_server_dir: () => {
        return ipcRenderer.invoke("get_server_dir")
    },
    create_server: (name, port, router) => {
        return ipcRenderer.invoke("create_server", [name, port, router])
    },
    kill_server: (name) => {
        return ipcRenderer.invoke("kill_server_" + name)
    },
    del_server: (name) => {
        return ipcRenderer.invoke("del_server", [name])
    },
    save_file: (path, data) => {
        return ipcRenderer.invoke("save_file", [path, data])
    },
    get_public_dir: () => {
        return ipcRenderer.invoke("get_public_dir")
    },
    open_static_folder: (name) => {
        return ipcRenderer.invoke("open_public_folder", [name])
    },
    create_public_dir: (name) => {
        return ipcRenderer.invoke("create_public_dir", [name])
    },
    open_router_file: (name) => {
        return ipcRenderer.invoke("open_router_file", [name])
    },
    post_router_file: (file_name, file) => {
        return ipcRenderer.invoke("post_router_file", [file_name, file])
    },
    del_public_dir: (dir_name) => {
        return ipcRenderer.invoke("del_public_dir", [dir_name])
    },
    get_test() { }
})