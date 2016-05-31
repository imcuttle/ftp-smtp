/**
 * Created by Yc on 2016/5/30.
 */


var net = require('net');
function sendMail(host,user,pwd,to,msg) {
    var socket = net.createConnection(25,host);
    var user64 = new Buffer(user).toString("base64");
    pwd  = new Buffer(pwd ).toString("base64");
    socket.on('connect',function () {
        this.write('HELO '+user+'\r\n');
    });
    var wt = net.Socket.prototype.write;
    socket.write = function () {
        console.log(arguments);
        return wt.apply(this,arguments);
    }

    var op = ['AUTH LOGIN\r\n'];
    socket.pipe(process.stdout);
    socket.on('data',function (data) {
        data = data.toString();
        const code = data.match(/^\d{3}/)[0]
        switch (code){
            case '250':{
                var v = op.shift();
                if(v==='AUTH LOGIN\r\n'){
                    op.push(user64+'\r\n');
                    op.push(pwd+'\r\n');
                }else if(v==='RCPT TO:'+to+'\r\n'){
                    op.push('DATA\r\n');
                    op.push(msg+'\r\n.\r\n');
                }
                socket.write(v);
                break;
            }
            case '334':{
                var v = op.shift();
                socket.write(v);
                if(op.length===0) op.push('MAIL FROM:'+user+'\r\n');
                break;
            }
            case '235': socket.write(op.shift()); op.push('RCPT TO:'+to+'\r\n'); break;
            case '221': socket.end(); break;
            case '354': socket.write(op.shift()); op.push('QUIT'+'\r\n'); break;
            // default : console.log(data);
        }
    })
}

sendMail(
    'smtp.qq.com',
    '492899414@qq.com',
    'jrpzcdbebynzcabf',
    '492899414@qq.com',
    "From: Moyu\r\n"+
    "Subject: Smtp Client implementation\r\n"+
    "To: 492899414@qq.com\r\n"+
    "Content-Type: text/html\r\n\r\n"+
    "是的实打实sss<h1>This is a javascript implemented smtp client</h1>sssssssssssssssssss"
);



