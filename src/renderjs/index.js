// 获取元素
const choiceColor = "rgb(204, 255, 254)"
const rbc = 'rgb(245, 245, 245, 0.858)'
// 顶部栏
const top_bar = document.getElementById("top_bar")
// 右容器
const right_con = document.getElementById("right_con")
const right_page = document.querySelectorAll(".right_page")
// 跳出框
const jump_win = document.querySelectorAll(".jump_win")
const submit_create = document.getElementById("submit_create")
// 左侧栏
const left_bar = document.getElementById("left_bar")
const choice = document.querySelectorAll(".choice")
// 左栏选项
// 关闭窗口事件
const close_win = document.querySelector("#close_btn")
close_win.addEventListener("click", () => {
    window.version.close_win()
})

const input = document.querySelectorAll("input")

// 控制左侧选项
const get_server_block = (serverset) => {
    const { name, port, router, static } = serverset
    const server_block = document.createElement("div")
    server_block.id = name + "server_block"
    server_block.innerHTML = `
    <p>服务器名称：${name}</p>
    <p>端口：${port}</p>
    <p>路由配置：${router}</p>
    <p>静态目录：${static}</p>
    <br><br>
    <div id="isrunning"></div>
    <button onclick="start_server('${name}')">启动</button>
    <button onclick="kill_server('${name}')">关闭</button>
    <button onclick="del_server('${name}')">删除</button>`
    server_block.className = "server_block"
    server_block.children.item(6).className = "stop"
    return server_block
}

// 获取页面信息
const get_router_dir = () => {
    version.get_router_dir().then((result) => {
        for (let i = 0; i < result.length; i++) {
            const re = document.createElement("div")
            const btn = document.createElement('button')
            btn.innerText = "删除"
            btn.className = "del_router_btn"
            re.addEventListener("click", () => {
                version.open_router_file(result[i]).then(
                    (result) => {
                        file_page.style.display = "block"
                        file_page.children[0].value = result
                    }
                )
            })
            re.innerText = result[i].replace(".js", "")
            re.appendChild(btn)
            re.className = "file_choice"
            right_page[1].firstChild.after(re)
        }
    })
}

const get_server_dir = () => {
    version.get_server_dir().then((result) => {
        result.forEach(ele => {
            right_page[0].firstChild.after(get_server_block(ele))
        })
    })
}

const start_server = (name) => {
    window.version.start_server(name).then((result) => {
        if (!result[0]) { return alert("start false") }
        document.getElementById(name + "server_block").children.item(6).className = "run"
    })
}

const kill_server = (name) => {
    window.version.kill_server(name).then((result) => {
        document.getElementById(name + "server_block").children.item(6).className = "stop"
    })
}

const get_router = (router) => {
    window.version.get_router(router)
}

const del_server = (name) => {
    kill_server(name)
    window.version.del_server(name)
    document.getElementById(name + "server_block").remove()
}

const close_jump_win = () => {
    jump_win.forEach(ele => {
        ele.style.display = "none"
    })
}

const get_public_dir = () => {
    version.get_public_dir().then((result) => {
        result.forEach(ele => {
            const dir = document.createElement("div")
            const btn = document.createElement("button")
            dir.className = "file_choice"
            dir.innerText = ele
            btn.innerText = "删除"
            btn.className = "del_public_btn"
            btn.addEventListener("click", (e) => {
                version.del_public_dir(ele)
                e.stopPropagation()
                document.querySelectorAll(".file_choice").forEach(ele => {
                    ele.remove()
                })
                get_public_dir()
            })
            dir.appendChild(btn)
            dir.addEventListener("click", () => {
                version.open_static_folder(ele)
            })
            right_page[3].firstChild.after(dir)
        })
    })
}

const create_public_dir = () => {
    const dirname = public_jwin.children[0].value
    if (!dirname) { return alert("不能为空") }
    version.create_public_dir(dirname).then((result) => {
        public_jwin.style.display = 'none'
        document.querySelectorAll(".file_choice").forEach(ele => {
            ele.remove()
        })
        get_public_dir()
    })
}

const create_server = () => {
    const server_info = document.querySelectorAll(".server_info")
    window.version.create_server(
        server_info[0].value,
        parseInt(server_info[1].value),
        server_info[2].value
    ).then((result) => {
        if (!result[0]) { return alert(result[1]) }
        get_server_dir()
    })
}

const post_router_file = () => {
    const file = router_jwin.children[0].files[0]
    alert(file.text)
    version.post_router_file(file.name)
}

// dom操作
for (let i = 0; i < choice.length; i++) {
    choice[i].addEventListener("click", () => {
        choice.forEach(ele => { ele.style.backgroundColor = "" })
        choice[i].style.backgroundColor = choiceColor
        right_page.forEach(ele => { ele.style.display = "none" })
        right_page[i].style.display = "block"
        close_jump_win()
    })
}

// 顶部和右侧容器控制
window.addEventListener("resize", () => {
    left_bar.style.height = window.innerHeight - 40 + "px"
    right_con.style.height = window.innerHeight - 40 + "px"
    right_con.style.width = window.innerWidth - 60 + "px"
    jump_win.forEach(ele => {
        ele.style.left = (window.innerWidth - 260) / 2 + 60 + "px"
        ele.style.top = (window.innerHeight - 350) / 2 + "px"
    })
})

window.onload = () => {
    get_router_dir()
    get_server_dir()
    get_public_dir()
    choice[0].style.backgroundColor = choiceColor
    right_page[0].style.display = "block"
    right_con.style.backgroundColor = rbc
    left_bar.style.height = window.innerHeight - 40 + "px"
    right_con.style.height = window.innerHeight - 40 + "px"
    right_con.style.width = window.innerWidth - 60 + "px"
    jump_win.forEach(ele => {
        ele.style.left = (window.innerWidth - 260) / 2 + 60 + "px"
        ele.style.top = (window.innerHeight - 350) / 2 + "px"
    })
    input.forEach(ele => {
        ele.setAttribute("spellcheck", "false")
    })
}


