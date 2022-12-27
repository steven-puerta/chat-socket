

function inicializar () {
    let boton = document.getElementById("boton");
    funcionBoton = function(event) {
        let autor = document.getElementById("nick");
        let mensaje = document.getElementById("mensaje");
        let recipiente = document.getElementById("objetivo");
        console.log(autor.value);
        console.log(mensaje.value);
        botonEnviar(autor.value, mensaje.value, recipiente.value);
    }
    boton.addEventListener("click", funcionBoton);

    conectarWebsocket();
}

function botonEnviar (autor, mensaje, recipiente) {
    //let texto = autor + ": " + mensaje;
    enviar(autor, mensaje, recipiente);
    let mensajeInput = document.getElementById("mensaje");
    mensajeInput.value = "";
}

async function conectarWebsocket () {

    let ip = "";

    obetenerIp = async function(event) {
        //
        const respuesta = await fetch("/ip", {
            method: 'GET'
        });
        const respuestaRecibida = await respuesta.json();

        ip = respuestaRecibida.ip;
    }

    await obetenerIp();

    websocket = new WebSocket("ws://" + ip + ":3100");

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
    enviar("Servidor", "Alguien entró al canal", "");
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

function enviar(emisor, mensaje, recipiente) {
    console.log("Emisor: " + emisor + ". Mensaje: " + mensaje + ". Recipiente: " + recipiente);
    websocket.send("-"+emisor);
    websocket.send("*"+recipiente);
    websocket.send("+"+mensaje);
}