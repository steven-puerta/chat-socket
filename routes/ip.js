var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    //Estas tres líneas nos permiten extraer la ip del servidor
    const ipSinFormato = req.socket.localAddress;
    let vectorIp = ipSinFormato.split(":");
    let ip = vectorIp[vectorIp.length-1];

    //Este caso sucede cuando se ejecuta en el mismo computador que el servidor
    if (ip == "1") {
        console.log("Condición cumplida");
        ip = "localhost";
    }
    
    res.send({ ip: ip});
});

module.exports = router;