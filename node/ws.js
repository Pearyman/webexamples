var http = require('http');
var url = require('url');
// var mime = require('mime');
var crypto = require('crypto');

var port = 8888;
var server = http.createServer();
    server.listen(port,function() {
        console.log('server is running on localhost:',port);
        server
        .on('connection',function(s) {
            console.log('on connection ',s);
        })
        .on('request',onrequest)
        .on('upgrade',onupgrade);
    });

var onrequest = function(req,res) {
    console.log( Object.keys(req) ,req.url,req['upgrade']);
    if( !req.upgrade ){
        // 非upgrade请求选择：中断或提供普通网页
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write( 'WebSocket server worksqwqwqw!' );
        
    }
    res.end();
    return;
};

var onupgrade = function (req,sock,head) {
    // console.log('方法:',Object.keys(sock));
    if(req.headers.upgrade !== 'WebSocket'){
        console.warn('非法连接');
        sock.end();
        return;
    }
    
    bind_sock_event(sock);

    try{
        handshake(req,sock,head);
    }catch(e){
        console.error(e);
        sock.end();
    }
};

// 包装将要发送的帧
var wrap = function(data) {
    var fa = 0x00, fe = 0xff, data = data.toString()
        len = 2+Buffer.byteLength(data),
        buff = new Buffer(len);

    buff[0] = fa;
    buff.write(data,1);
    buff[len-1] = fe;
    return buff;
}
// 解开接收到的帧
var unwrap = function(data) {
    return data.slice(1,data.length-1);
}

var bind_sock_event = function(sock) {
    sock
    .on('data',function(buffer) {
        var data = unwrap(buffer);
        console.log('socket receive data : ',buffer,data,'\n>>> '+data);
        // send('hello html5,'+Date.now())
        sock.emit('send',data);
    })
    .on('close',function() {
        console.log('socket close');
    })
    .on('end',function() {
        console.log('socket end');
    })
    .on('send',function(data) { //自定义事件
        sock.write(wrap(data),'binary');
    })
};

var get_part = function(key) {
    var empty   = '',
        spaces  = key.replace(/\S/g,empty).length,
        part    = key.replace(/\D/g,empty);
    if(!spaces) throw {message:'Wrong key: '+key,name:'HandshakeError'}
    return get_big_endian(part / spaces);
}

var get_big_endian = function(n) {  
    return String.fromCharCode.apply(null,[3,2,1,0].map(function(i) { return n >> 8*i & 0xff }))
}

var challenge = function(key1,key2,head) {
    var sum = get_part(key1) + get_part(key2) + head.toString('binary');
    return crypto.createHash('md5').update(sum).digest('binary');
}

var handshake = function(req,sock,head) {
    var output = [],h = req.headers, br = '\r\n';

    // header
    output.push(
        'HTTP/1.1 101 WebSocket Protocol Handshake','Upgrade: WebSocket','Connection: Upgrade',
        'Sec-WebSocket-Origin: ' + h.origin,
        'Sec-WebSocket-Location: ws://' + h.host + req.url,
        'Sec-WebSocket-Protocol: my-custom-chat-protocol'+br
    );
    // body
    var c = challenge(h['sec-websocket-key1'],h['sec-websocket-key2'],head);
    output.push(c);

    sock.write(output.join(br),'binary');
}
