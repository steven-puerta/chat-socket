

function inicializar () {
    let boton = document.getElementById("boton");
    funcionBoton = function(event) {
        let autor = document.getElementById("nick");
        let mensaje = document.getElementById("mensaje");
        console.log(autor.value);
        console.log(mensaje.value);
        botonEnviar(autor.value, mensaje.value);
    }
    boton.addEventListener("click", funcionBoton);

    conectarWebsocket();
}

function botonEnviar (autor, mensaje) {
    let texto = autor + ": " + mensaje;
    enviar(texto);
    let autorInput = document.getElementById("nick");
    let mensajeInput = document.getElementById("mensaje");
    mensajeInput.value = "";
}

function conectarWebsocket () {
    websocket = new WebSocket("ws://localhost:3100");

    websocket.onopen = function (evt) {
        onOpen(evt)
    };

    websocket.onclose = function (evt) {
        onClose(evt)
    };

    websocket.onmessage = function (evt) {
        onMessage(evt)
    };

    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen (evt) {
    document.getElementById("boton").disabled = false;
    enviar("Alguien entró al canal");
}

function onClose (evt) {
    document.getElementById("boton").disabled = true;
    setTimeout(function () {conectarWebsocket()}, 2000);
}

function onMessage (evt) {
    let chat = document.getElementById("chat");
    chat.innerHTML += evt.data + "\n"
}

function onError (evt) {
    console.log("Error: " + evt.data);
}

function enviar(mensaje) {
    console.log("Enviando: " + mensaje);
    websocket.send(mensaje);
}