const { dialog, BrowserWindow } = nodeRequire('electron').remote;
const fs = nodeRequire('fs');
const readline = nodeRequire('readline');
window.onload = function () {
  const btn_select = document.querySelector('#btn-select-file');
  const btn_read = document.querySelector('#btn-read-file');
  const file_path = document.querySelector('#file-path');
  const container = document.querySelector('#container');
  const lngSelect = document.querySelector('#lngSelect');
  const latSelect = document.querySelector('#latSelect');
  const textareaRange = document.querySelector('#textareaRange');
  const progressBar = document.querySelector('#progressBar');
  const progressbarContainer = document.querySelector('#progressbarContainer');
  let filePath = '';

  // 获取文件路径
  btn_select.onclick = () => {
    container.innerHTML = "";
    dialog
      .showOpenDialog({
        filters: [{ name: 'data', extensions: ['csv'] }],
      })
      .then((result) => {
        if (!result.canceled) {
          filePath = result.filePaths[0];
          file_path.value = filePath;
          read_first_line(filePath, lngSelect, latSelect);
          lngSelect.removeAttribute('disabled');
          latSelect.removeAttribute('disabled');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 单击运行按钮
  btn_read.onclick = () => {
    container.innerHTML = '';
    let strPolygon = textareaRange.value;
    if (filePath != '' || strPolygon != '') {
      let lngSelectIndex = lngSelect.selectedIndex;
      let latSelectIndex = latSelect.selectedIndex;
      if (latSelectIndex == lngSelectIndex) {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
          type: 'error',
          message: '经纬度字段选择错误',
        });
        return;
      }
      let polygon;
      try {
        polygon = str2Array(strPolygon)
      } catch(err){
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
          type: 'error',
          message: err,
        });
        return;
      }
      let stats = fs.statSync(filePath);
      // 和主进程通信
      const { ipcRenderer } = nodeRequire('electron');
      ipcRenderer.send('process', [stats.size, filePath, lngSelectIndex, latSelectIndex,polygon]);
      progressbarContainer.setAttribute('style','visibility:visible;')
      ipcRenderer.on('progress', (event, arg) => {
        if(arg == 'ok'){
          progressBar.setAttribute('style','width: 100%')
          progressbarContainer.setAttribute('style','visibility:hidden;')
          progressBar.setAttribute('style','width: 0%')
          // container.innerHTML = '已完成筛选，请查看目录下的result.csv文件';
          dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            type: 'info',
            message: '已完成筛选，请查看目录下的result.csv文件'
          });
        }else{
          progressBar.setAttribute('style','width: ' + arg*100 + '%')
        }
      });
    }
  };
};

// 读取第一行
function read_first_line(path, lngSelect, latSelect) {
  let rs = fs.createReadStream(path);
  rs.once('open', () => {
  });

  rs.on('data', (data) => {
    if (data.indexOf('\r\n')) {
      let firstLine = data.toString().split('\r\n')[0];

      fileds = firstLine.split(',');
      lngSelect.innerHTML = '';
      latSelect.innerHTML = '';
      let i = 0;
      fileds.forEach((element) => {
        let context = document.createTextNode(remove_quotes(element));
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.appendChild(context);
        lngSelect.appendChild(option);
        let context2 = document.createTextNode(remove_quotes(element));
        let option2 = document.createElement('option');
        option2.setAttribute('value', i);
        option2.appendChild(context2);
        latSelect.appendChild(option2);
        i++;
      });

      rs.destroy();
    }
  });

  rs.once('close', () => {
  });
}

function remove_quotes(str) {
  return str.replace(/["]/g, '');
}

function str2Array(str) {
  // {[119.053741,33.594937];[119.05548,33.59505];[119.060804,33.595393];[119.060805,33.595393];[119.060953,33.595376];[119.053741,33.594937]};{...}
  str = str.replace('{[', '').replace(']}', '');
  let strArray = str.split('];[');
  let count = strArray.length;
  // 如果最后一个和第一个不一样，则在最后补一个
  if (strArray[0] != strArray[count - 1]) {
    strArray.push(strArray[0]);
    count++
  }

  let x = 0.0, y = 0.0
  let rs = new Array(count);
  for (let i = 0; i < count; i++) {
    temp = strArray[i].split(',');
    // temp = ["119.05548","33.59505"]
    x = Number(temp[0]);
    if (Number.isNaN(x)) {
      throw temp[0] + '转换错误';
    }
    y = Number(temp[1]);
    if (Number.isNaN(y)) {
      throw temp[1] + '转换错误';
    }
    rs[i] = [x, y]
  }
  return rs
}
