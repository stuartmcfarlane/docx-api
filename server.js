//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

function error404(err, req, res) {
  res.render('404.jade', { locals: { 
            title : '404 - Not Found'
           ,description: ''
           ,author: ''
           ,analyticssiteid: 'XXXXXXX' 
          },status: 404 });
};

function error500(err, req, res) {
  res.render('500.jade', { locals: { 
            title : 'The Server Encountered an Error'
           ,description: ''
           ,author: ''
           ,analyticssiteid: 'XXXXXXX'
           ,error: err 
          },status: 500 });
};


//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
      error404(err, req, res);
    } else {
      error500(err, req, res);
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function onSocketConnect(socket){
  console.log('Client Connected');
  socket.on('message', function onSocketMessage(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function onSocketDisconnect(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function getIndex(req,res){
  res.render('index.jade', {
    locals : { 
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

///////////////////////////////////////////
//              API routes               //
///////////////////////////////////////////

var request = require('request');
var docx = require('docx-transform');

server.get('/api/v1/docx', function apiV1Docx (req, res) {
  var url = req.query.url;
  console.log('url', url);
  request.get(url).pipe(docx.toDocx).pipe(res);
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function get500(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function get400(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
