"use strict";

// create web audio api context

const canvas = document.getElementById("myCanvas");
let canvasCtx = canvas.getContext("2d");
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
let WIDTH = canvas.width;
let HEIGHT = canvas.height;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

// create Oscillator node
let oscillator;

let isPlaying; // toggle variable for if oscillator is running or not

function main() {
    let isPlaying = false;
}

function draw() {
    var drawVisual = requestAnimationFrame(draw);
    
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();
    var sliceWidth = WIDTH * 2.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
}

function playButton() {
    let playbtn = document.getElementById("play-button");
    if (isPlaying) {
        oscillator.stop();
        isPlaying = false;
        playbtn.innerHTML = "play";
    } else {
        startOscillator();
        playbtn.innerHTML = "pause";
    }
}

function startOscillator() {
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    isPlaying = true;

    oscillator.connect(analyser);
    analyser.fftsize = 2048;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    oscillator.start();
    draw();
}

main();