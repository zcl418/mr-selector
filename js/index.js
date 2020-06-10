const { dialog } = nodeRequire('electron').remote;
const fs = nodeRequire('fs');
const readline = nodeRequire('readline');
window.onload = function () {
  const btn_select = document.querySelector('#btn-select-file');
  const btn_read = document.querySelector('#btn-read-file');
  const file_path = document.querySelector('#file-path');
  const container = document.querySelector('#container');
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
          read_first_line(filePath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 单击运行按钮
  btn_read.onclick = () => {
    if (filePath != '') {
      let stats = fs.statSync(filePath);
      // 和主进程通信
      const { ipcRenderer } = nodeRequire('electron');
      ipcRenderer.send('process', [stats.size, filePath]);
      ipcRenderer.on('progress', (event, arg) => {
        container.innerHTML = arg;
      });
    }
  };
};

// 读取第一行
function read_first_line(path) {
  let reader = readline.createInterface({
    input: fs.createReadStream(path, { encoding: 'utf8' }),
  });
  let rs = null;
  let rs2 = [];
  reader.on('line', function (line) {
    rs = line.split(',');
    rs.forEach((el) => {
      console.log(remove_quotes(el) + '--');
    });
    reader.close();
  });
  // reader.on('close', () => {
  //   console.log(rs);
  // });
}

function remove_quotes(str) {
  str.replace(/["]/g, '');
}
