document.addEventListener("DOMContentLoaded", function () {
    // windowwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var check = 0;
    var request, db;
    let h2 = document.getElementById('timer');
    let addData = document.getElementById('addBtn');
    let audioData = document.getElementById('audioBtn');
    var recorder,chunks = [];
    var seconds = 0,minutes = 0, clear_time = 0;
    var blob;
    if (!window.indexedDB) {
        console.log("Your Browser does not support IndexedDB");
    }
    else {
        request = window.indexedDB.open("MemoDB", 25);
        request.onerror = function (event) {
            console.log("Error opening DB", event);
        }

        request.onupgradeneeded = function (event) {
            console.log("Upgrading");
            db = event.target.result;
            var objectStore = db.createObjectStore("MemoTextField", { keyPath: "textNo", autoIncrement: true });

        }
        request.onsuccess = function (event) {
            console.log("Success opening DB");
            db = event.target.result;
        }
    }

    audioData.addEventListener('click', function() {
      if(check == 0) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {handlerFuction(stream)});
      }
      else {
        alert(h2.textContent + " 저장 되었습니다.");
        h2.textContent = "00:00";
        seconds = 0; minutes = 0;
        chunks = [];
        clearTimeout(clear_time);
        recorder.stop();
        check = 0;
        audioData.value = "녹음하기";
        addData.disabled = false;
      }
    });

    function handlerFuction(stream){
        recorder = new MediaRecorder(stream);
        console.log('권한 확인을 위해서 로그를 띄움');
        check = 1;
        addData.disabled = true;
        timer();
        if (window.MediaRecorder == undefined) {
            console.error('MediaRecorder not supported, boo');
        }
        else {
            var contentTypes = ["video/webm",
            "video/webm;codecs=vp8",
            "video/x-matroska;codecs=avc1",
            "audio/webm",];
            contentTypes.forEach(contentType => {
                console.log(contentType + ' is '
                + (MediaRecorder.isTypeSupported(contentType) ?
                'supported' : 'NOT supported '));
            });
        }
        
        audioData.value = "정지하기";
        recorder.start();

        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state == 'inactive') {
                blob = new Blob(chunks, {type:'audio/wav'});
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }

    function add() {
        seconds++;

        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
            }
        }

        h2.textContent =(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timer();
    }

    function timer() {
        clear_time = setTimeout(add, 1000);
    }

    addData.addEventListener('click', function () {
        var content = document.querySelector('#content').value;
        var newdate = new Date();
        var date = new Date(newdate.toISOString());
        var color = "#" + readColorByQueryString();

        var transaction = db.transaction(["MemoTextField"], "readwrite");
        var objectStore = transaction.objectStore("MemoTextField");
        objectStore.add({ Content: content, Date: date, Color: color, Audio: blob});

        transaction.oncomplete = function (event) {
            console.log("Success :)");
            move();

        };

        transaction.onerror = function (event) {
            console.log("Error :)");
        };
    });

    function move() {
      location.href = 'page4.html';
    }
    setMoodColor();
});



function setMoodColor() {
    let color = readColorByQueryString();
    let node = document.getElementsByClassName('circle')[0];
    node.style.backgroundColor = '#' + color;
};

function readColorByQueryString(){
    var regex = "color=";
    var str = window.location.search.substring(1);
    return str.replace(regex, "");
};
