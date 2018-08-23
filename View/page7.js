var h2 = document.getElementById('timer'),
start = document.getElementById('start'),
cancle = document.getElementById('cancle'),
save = document.getElementById('save'),
currentTime = document.getElementById('now'),
seconds = 0,minutes = 0,t;
var request, db;  

var recorder,chunks = [];


if (!window.indexedDB) {  
    console.log("Your Browser does not support IndexedDB");  
}  
else {  
    request = window.indexedDB.open("RecordDB", 25);  
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
function NOW() {

    var date = new Date();
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = (date.getMonth() + 1);

    if (gg < 10)
        gg = "0" + gg;
        
    var cur_day = aaaa + "년 " + mm + "월 " + gg + "일 ";

    var hours = date.getHours()
    var minutes = date.getMinutes()
    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0"+ minutes;
    return cur_day + " " + hours + "시 " + minutes + "분";
}

currentTime.textContent = NOW();

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
t = setTimeout(add, 1000);
}

start.onclick = function(){
timer();
start.disabled = true;
cancle.disabled = false;
save.disabled = false;
navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {handlerFuction(stream)})
}

cancle.onclick = function() {
h2.textContent = "00:00";
clearTimeout(t);
seconds = 0; minutes = 0;
start.disabled = false;
save.disabled = true;
recorder = null;
chunks = [];

}

save.onclick = function(){
alert(h2.textContent + "저장 되었습니다.");
h2.textContent = "00:00";
clearTimeout(t);
seconds = 0; minutes = 0;
recorder.stop();
}



function handlerFuction(stream){

recorder = new MediaRecorder(stream);
console.log('권한 확인을 위해서 로그를 띄움');

if (window.MediaRecorder == undefined) {
console.error('MediaRecorder not supported, boo');
} else {
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
console.log(chunks);
if (recorder.state == 'inactive') {                    
    const blob = new Blob(chunks, { type: 'audio/webm' });
    console.log(blob);
    var transaction = db.transaction(["RecordField"], "readwrite");  
    var objectStore = transaction.objectStore("RecordField");  
    objectStore.add({ Content: blob });  
    transaction.oncomplete = function (event) {  
        console.log("record save Success :)");  
    };  

    transaction.onerror = function (event) {  
        console.log(" record save Error :)");  
    };

    stream.getTracks().forEach(track => track.stop());
    createAudioElement(URL.createObjectURL(blob));
}
};

function createAudioElement(blobUrl) {
const downloadEl = document.createElement('a');
downloadEl.style = 'display: inline-block';
downloadEl.innerHTML = 'download';
downloadEl.download = 'audio.webm';
downloadEl.href = blobUrl;
const audioEl = document.createElement('audio');
audioEl.controls = true;
const sourceEl = document.createElement('source');
sourceEl.src = blobUrl;
sourceEl.type = 'audio/webm';
audioEl.appendChild(sourceEl);
document.body.appendChild(audioEl);
document.body.appendChild(downloadEl);
}
}
