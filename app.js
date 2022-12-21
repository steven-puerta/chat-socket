var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Cosas requeridas
var cors = require('cors');
var server = require("http").Server(app);
var WebSocketServer = require("websocket").server;

const servidorWebsocket = new WebSocketServer({httpServer: server, autoAcceptConnections: false});

function origenValido (origin) {
  if (origin === "http://localhost:3000") {
    return true;
  }
  return false;
}

servidorWebsocket.on("request", (request) => {
  if (!origenValido(request.origin)){
    request.reject();
    console.log("Conexión rechazada");
    return;
  }
  const conexion = request.accept(null, request.origin);
  conexion.on("message", (message) => {
    console.log("Mensaje: " + message.utf8Data);
    conexion.sendUTF(message.utf8Data);
  });
  conexion.on("close", (reasonCode, description) => {
    console.log("Cliente desconectado")
  });
})

server.listen(('3100'), () => {console.log("Servidor iniciado en el puerto: 3100");})
//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
