const readline = require('readline');
// const { isPointInPolygon } = require('bryce-geometry');
const Polygon = require('./Polygon');
const fs = require('fs');
exports.process = function (event, arg, outputFile) {
  /**
   * arg = stats.size, filePath, lngSelectIndex, latSelectIndex,polygon
   */
  let p = new Polygon(arg[4]);
  let reader = readline.createInterface({
    input: fs.createReadStream(arg[1], { encoding: 'utf8' }),
  });
  let ws = fs.createWriteStream(outputFile);
  let i = 0;
  let size = 0;
  // 一行一行地读取文件
  reader.on('line', function (line) {
    i++;
    if (i == 1) {
      ws.write(line + '\r\n');
    } else {
      aline = line.split(',');
      if (p.containPoint(aline[arg[2]], aline[arg[3]])) {
        ws.write(line + '\r\n');
      }
      // if (isPointInPolygon(aline[arg[2]], aline[arg[3]], arg[4])) {
      //   ws.write(line + '\r\n');
      // }
      size += Buffer.byteLength(line);
      if (i % 100000 == 0) {
        event.reply('progress', size / arg[0]);
      }
    }
  });
  // 读取完成后,将arr作为参数传给回调函数
  reader.on('close', function () {
    event.reply('progress', 'ok');
    ws.end();
  });
};
