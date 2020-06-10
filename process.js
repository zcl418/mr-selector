const readline = require('readline')
const fs = require('fs')
exports.process = function(arg){
    let reader = readline.createInterface({
        input: fs.createReadStream(arg[1],{encoding:'utf8'})
      })
    
      let i = 0
      let size = 0
      // 一行一行地读取文件
      reader.on('line', function (line) {
        i++;
        size += Buffer.byteLength(line)
        if(i % 100000 == 0){
          console.log(line.split(','))
          
          console.log(i," - ",size,"/",arg[0])
          event.reply('progress',size / arg[0])
        }
      });
      // 读取完成后,将arr作为参数传给回调函数
      reader.on('close', function () {
        // container.innerHTML = "完成！"
        console.log(i,"完成！")
      });
}