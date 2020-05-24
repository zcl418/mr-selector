const { dialog } = nodeRequire('electron').remote
const fs = nodeRequire('fs')
window.onload = function () {
    const btn_select = document.querySelector("#btn-select-file");
    const btn_read = document.querySelector("#btn-read-file");
    const file_path = document.querySelector("#file-path");
    const container = document.querySelector("#container");
    let filePath = "";

    // get file path
    btn_select.onclick = () => {
        dialog.showOpenDialog({
            filters: [
                { name: 'data', extensions: ['csv'] },
            ]
        }).then((result) => {
            if (!result.canceled) {
                filePath = result.filePaths[0];
                file_path.value = filePath;
            }
        }).catch(err => {
            console.log(err)
        })
    }

    btn_read.onclick = () => {
        if (filePath != "") {
            let stats = fs.statSync(filePath)
             // 和主进程通信
            const { ipcRenderer } = require('electron');
            ipcRenderer.send("process",[stats.size,filePath]);
            ipcRenderer.on('progress',(event,arg)=>{
                container.innerHTML = arg; 
            })
        }
    }
}