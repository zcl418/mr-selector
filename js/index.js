const { dialog,BrowserWindow } = nodeRequire('electron').remote;
const fs = nodeRequire('fs');
const readline = nodeRequire('readline');
window.onload = function () {
  const btn_select = document.querySelector('#btn-select-file');
  const btn_read = document.querySelector('#btn-read-file');
  const file_path = document.querySelector('#file-path');
  const container = document.querySelector('#container');
  const lngSelect = document.querySelector('#lngSelect');
  const latSelect = document.querySelector('#latSelect');
  let filePath = '';

  // 获取文件路径
  btn_select.onclick = () => {
    dialog
      .showOpenDialog({
        filters: [{ name: 'data', extensions: ['csv'] }],
      })
      .then((result) => {
        if (!result.canceled) {
          filePath = result.filePaths[0];
          file_path.value = filePath;
          read_first_line(filePath,lngSelect,latSelect);
          lngSelect.removeAttribute("disabled")
          latSelect.removeAttribute("disabled")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 单击运行按钮
  btn_read.onclick = () => {
    if (filePath != '') {
      let lngSelectIndex = lngSelect.selectedIndex;
      let latSelectIndex = latSelect.selectedIndex;
      
      if(latSelectIndex == lngSelectIndex){
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(),{
          type:"error",
          message:'经纬度字段选择错误',
        })
        return;
      }

      let stats = fs.statSync(filePath);
      // 和主进程通信
      const { ipcRenderer } = nodeRequire('electron');
      ipcRenderer.send('process', [stats.size, filePath,lngSelectIndex,latSelectIndex]);
      ipcRenderer.on('progress', (event, arg) => {
        container.innerHTML = arg;
      });
    }
  };
};

// 读取第一行
function read_first_line(path,lngSelect,latSelect) {
  let rs = fs.createReadStream(path);
  rs.once('open',()=>{
    console.log("open file....")
  })

  rs.on('data',(data)=>{
    if(data.indexOf('\r\n')){
      let firstLine = data.toString().split('\r\n')[0];

      fileds = firstLine.split(',');
      lngSelect.innerHTML="";
      latSelect.innerHTML="";
      let i =0;
      fileds.forEach(element => {
        let context = document.createTextNode(remove_quotes(element))
        let option = document.createElement('option')
        option.setAttribute('value',i)
        option.appendChild(context);
        lngSelect.appendChild(option)
        let context2 = document.createTextNode(remove_quotes(element))
        let option2 = document.createElement('option')
        option2.setAttribute('value',i)
        option2.appendChild(context2);
        latSelect.appendChild(option2)
        i++
      });

      rs.destroy()
    }
  })

  rs.once('close',()=>{
    console.log("close.....")
  })
  

  // let reader = readline.createInterface({
  //   input: fs.createReadStream(path, { encoding: 'utf8' }),
  // });
  // let rs = null;
  // let rs2 = [];
  // let i = 0;
  // reader.on('line', function (line) {
  //   i++;
  //   console.log(i)
  //   rs = line.split(',');
  //   rs.forEach((el) => {
  //     // console.log(remove_quotes(el) + '--');
  //     // console.log(el)
  //   });
  //   reader.close();
  // });
  // // reader.on('close', () => {
  // //   console.log(rs);
  // // });
}

function remove_quotes(str) {
  return str.replace(/["]/g, '');
}
