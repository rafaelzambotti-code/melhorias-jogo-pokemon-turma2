var velocidade = 10
var pontos = 0
var vida = 3
var valorCenario = 0
var posVilao = -153
var posPersonagem = 70
var velocidadePulo = 0
var pulos = 0
var jogando = false
var invencivel = 0
var tempoAviso = 0
var record = localStorage.getItem("record")

if (record === null) {
    record = 0
}

var cenario = document.querySelector(".cenario")
var jogador = document.querySelector("#jogador")
var jogadorEvoluido = document.querySelector("#jogadorEvoluido")
var vilao = document.querySelector("#vilao")
var necrozma = document.querySelector("#necrozma")
var guzzlord = document.querySelector("#guzzlord")
var malamar = document.querySelector("#malamar")
var pokebola1 = document.querySelector("#pokebola1")
var pokebola2 = document.querySelector("#pokebola2")
var pokebola3 = document.querySelector("#pokebola3")
var aviso = document.querySelector("#aviso")
var telaInicio = document.querySelector("#telaInicio")
var telaFim = document.querySelector("#telaFim")
var musica = document.querySelector("#musicaTema")
var somDano = document.querySelector("#somDano")
var somMorte = document.querySelector("#somMorte")

musica.volume = 0.4


function mostrarTextos() {
    document.querySelector("#valorPontos").innerHTML = pontos
    document.querySelector("#valorRecord").innerHTML = record
    document.querySelector("#valorVelocidade").innerHTML = Math.round(velocidade)
}

function mostrarVidas() {
    pokebola1.style.display = "none"
    pokebola2.style.display = "none"
    pokebola3.style.display = "none"

    if (vida >= 1) {
        pokebola1.style.display = "inline"
    }
    if (vida >= 2) {
        pokebola2.style.display = "inline"
    }
    if (vida >= 3) {
        pokebola3.style.display = "inline"
    }
}


function mudarFase() {
    var fase = pontos % 80

    vilao.style.display = "none"
    necrozma.style.display = "none"
    guzzlord.style.display = "none"
    malamar.style.display = "none"

    if (fase < 20) {
        cenario.style.backgroundImage = "url(assets/img/cenario.png)"
        vilao.style.display = "block"
    } else if (fase < 40) {
        cenario.style.backgroundImage = "url(assets/img/cenario_noite.png)"
        necrozma.style.display = "block"
    } else if (fase < 60) {
        cenario.style.backgroundImage = "url(assets/img/cenario_outono.png)"
        guzzlord.style.display = "block"
    } else {
        cenario.style.backgroundImage = "url(assets/img/cenario_inverno.png)"
        malamar.style.display = "block"
    }
}


function moverCenario() {
    valorCenario = valorCenario - (velocidade / 20 + 0.5)
    cenario.style.backgroundPositionX = valorCenario + "px"
}

function moverVilao() {
    posVilao = posVilao + 1 + velocidade / 10

    vilao.style.right = posVilao + "px"
    necrozma.style.right = posVilao + "px"
    guzzlord.style.right = posVilao + "px"
    malamar.style.right = posVilao + "px"

    var larguraJogo = cenario.offsetWidth

    if (posVilao > larguraJogo) {
        posVilao = -153
        pontos = pontos + 10

        velocidade = velocidade + velocidade * 0.1

        if (velocidade > 100) {
            velocidade = 100
        }

        if (pontos > record) {
            record = pontos
            localStorage.setItem("record", pontos)
        }

        if (pontos === 40) {
            jogador.style.display = "none"
            jogadorEvoluido.style.display = "block"
            aviso.innerHTML = "Seu Pokémon evoluiu!"
            tempoAviso = 125
        }

        if (pontos === 50) {
            aviso.innerHTML = "Pulo duplo liberado! Aperte ESPAÇO duas vezes"
            tempoAviso = 125
        }

        mudarFase()
        mostrarTextos()
    }
}

function pular() {
    posPersonagem = posPersonagem + velocidadePulo

    if (posPersonagem > 70) {
        velocidadePulo = velocidadePulo - 0.8
    } else {
        posPersonagem = 70
        velocidadePulo = 0
        pulos = 0
    }

    jogador.style.bottom = posPersonagem + "px"
    jogadorEvoluido.style.bottom = posPersonagem + "px"
}

function colisao() {
    var larguraJogo = cenario.offsetWidth
    var vilaoEsquerda = larguraJogo - posVilao - 153

    if (invencivel === 0 && vilaoEsquerda > 100 && vilaoEsquerda < 320 && posPersonagem < 140) {
        perderVida()
    }
}

function perderVida() {
    vida = vida - 1
    mostrarVidas()

    if (vida === 0) {
        fimDeJogo()
    } else {
        somDano.currentTime = 0
        somDano.play()
        invencivel = 75
        jogador.style.opacity = 0.5
        jogadorEvoluido.style.opacity = 0.5
    }
}

function fimDeJogo() {
    jogando = false
    musica.pause()
    somMorte.currentTime = 0
    somMorte.play()

    document.querySelector("#pontosFinal").innerHTML = pontos
    telaFim.style.display = "block"
}

function comecarJogo() {
    velocidade = 10
    pontos = 0
    vida = 3
    posVilao = -153
    posPersonagem = 70
    velocidadePulo = 0
    pulos = 0
    invencivel = 0

    jogador.style.display = "block"
    jogador.style.opacity = 1
    jogadorEvoluido.style.display = "none"
    jogadorEvoluido.style.opacity = 1

    mudarFase()
    mostrarTextos()
    mostrarVidas()

    telaInicio.style.display = "none"
    telaFim.style.display = "none"

    musica.currentTime = 0
    musica.play()
    jogando = true
}


setInterval(function(){

    if (tempoAviso > 0) {
        tempoAviso = tempoAviso - 1

        if (tempoAviso === 0) {
            aviso.innerHTML = ""
        }
    }

    if (jogando === true) {
        moverCenario()
        moverVilao()
        pular()
        colisao()

        if (invencivel > 0) {
            invencivel = invencivel - 1

            if (invencivel === 0) {
                jogador.style.opacity = 1
                jogadorEvoluido.style.opacity = 1
            }
        }
    }

}, 20)


document.addEventListener("keypress", function(event){

    if (event.code === "Enter" && jogando === false) {
        comecarJogo()
    }

    if (event.code === "Space" && jogando === true) {
        if (pulos === 0) {
            velocidadePulo = 16
            pulos = 1
        } else if (pulos === 1 && pontos >= 50) {
            velocidadePulo = 14
            pulos = 2
        }
    }

})


mostrarTextos()
mostrarVidas()
