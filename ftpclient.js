/**
 * Created by Yc on 2016/5/30.
 */
var net = require('net');

var socket = net.createConnection(21,'172.21.59.162');//new net.Stream();

socket.on('connection',function () {
    console.log('connected');
});
socket.on('end',function () {
    console.log('disconnected');
});

process.stdin.pipe(socket).pipe(process.stdout);
socket.write('USER anonymous\r\n');
socket.write('PASS guest\r\n');
socket.write('PWD\r\n');
socket.write('PORT 172,21,59,162,34,184\r\n');
// socket.write('LIST movie\r\n');
//socket.write('TYPE I\r\n');
socket.write('RETR bootstrap.zip\r\n');
// socket.write('LIST /FTP\r\n');
const client = net.createServer(function (s) {
    console.log('client new connect');
    s.on('connect',()=>{
        console.info('client new connect');
    });

    s.pipe(require('fs').createWriteStream('ftpfile.zip'));
    s.on('error',console.error)
}).listen(8888);


// socket.pipe(process.stdout,{});
/*
socket.write(
     "GET /students/ HTTP/1.1\r\n"
    +"Host: moyuyc.xyz\r\n"
    +"Connection: keep-alive\r\n"
    +"User-Agent: MOYU\r\n\r\n"
)
*/