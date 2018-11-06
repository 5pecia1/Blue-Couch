document.addEventListener("DOMContentLoaded", function () {
    // windowwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var request, db;
    let addData = document.getElementById('addBtn');
    let audioData = document.getElementById('audioBtn');
    let stop = document.getElementById('stopBtn');
    var recorder,chunks = [];
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
            var objectStore = db.createObjectStore("RecordField", { keyPath: "RecordNo", autoIncrement: true });

        }
        request.onsuccess = function (event) {
            console.log("Success opening DB");
            db = event.target.result;
        }
    }

    audioData.addEventListener('click', function() {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {handlerFuction(stream)});
    });

    function handlerFuction(stream){
        recorder = new MediaRecorder(stream);
        console.log('권한 확인을 위해서 로그를 띄움');

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

        recorder.start();

        recorder.ondataavailable = e => {
            console.log(recorder.state);
            chunks.push(e.data);
            console.log("12312312"+chunks);
            if (recorder.state == 'inactive') {
                blob = new Blob(chunks, {type:'audio/wav'});
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }

    stop.addEventListener('click', function(){
        alert("저장 되었습니다.");
        recorder.stop();
    });

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
