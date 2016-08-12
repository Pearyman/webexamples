var fs=require("fs");
var http=require("http");
var chokidar = require('chokidar');
// <script src="https://cdn.goeasy.io/goeasy.js"></script>
var server = http.createServer(function(req , res){
    var htmlPage = fs.readFile("a.log", "utf8",function(err , data){
        if (err) {
            console.log(err);
        }else{
            res.writeHead(200 , {"Content-Type" : "text/html"});
            var arr=data.split('\n');
            var result='';
            for(var i=0; i<arr.length;i++){
              result+='<p style="margin:20px 0; color:green;"><i style="margin:0 20px; font-style:normal; font-size:20px; color:#000;">'+(i+1)+'</i>'+arr[i]+'</p>'
            }
            // setInterval(function(){
              res.end(result);
            // },5000);
            // chokidar.watch('a.log').on('change', function(){
            //   // server.on('close',function(){console.log(6666);});
            //   res.end(result);
              
            // })
       

        }

      })
});
server.listen(8888);

// var net = require('net');  
// var fs= require('fs');
  
// var chatServer = net.createServer();  
  
// chatServer.on('connection', function(client) {  
//   var htmlPage = fs.readFile("a.log", "utf8",function(err , data){
//         if (err) {
//             console.log(err);
//         }else{
//             // res.writeHead(200 , {"Content-Type" : "text/html"});
//             var arr=data.split('\n');
//             var result='';
//             for(var i=0; i<arr.length;i++){
//               result+='<p style="margin:20px 0; color:green;"><i style="margin:0 20px; font-style:normal; font-size:20px; color:#000;">'+(i+1)+'</i>'+arr[i]+'</p>'
//             }
            
//             client.write(result);

//         }

//       });

// });  
  
// chatServer.listen(8888);

console.log('server is starting...');
// 

