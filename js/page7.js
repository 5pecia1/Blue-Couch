
document.addEventListener("DOMContentLoaded", function () {
    var h2 = document.getElementById('timer'),
    start = document.getElementById('start'),
    cancle = document.getElementById('cancle'),
    save = document.getElementById('save'),
    currentTime = document.getElementById('now'),
    audio = document.getElementById('audio'),
    seconds = 0,minutes = 0;
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
                const blob = new Blob(chunks, {type:'audio/wav'});
                stream.getTracks().forEach(track => track.stop());
                const audio = new Audio();
                //var test = createAudioElement(URL.createObjectURL(blob));
                test1= URL.createObjectURL(blob);
                audio.src = test1;
                var transaction = db.transaction(["RecordField"], "readwrite");
                var objectStore = transaction.objectStore("RecordField");
                audio.load();
                audio.play();
                console.log(audio);
                objectStore.add({ Content: blob });
                transaction.oncomplete = function (event) {
                    console.log("record save Success :)");
                };

                transaction.onerror = function (event) {
                    console.log(" record save Error :)");
                };
            }
        };
        // function createAudioElement(blobUrl) {
        //     const downloadEl = document.createElement('a');
        //     downloadEl.style = 'display: inline-block';
        //     downloadEl.innerHTML = 'download';
        //     downloadEl.download = 'audio.webm';
        //     downloadEl.href = blobUrl;
        //     const audioEl = document.createElement('audio');
        //     audioEl.controls = true;
        //     const sourceEl = document.createElement('source');
        //     sourceEl.src = blobUrl;
        //     sourceEl.type = 'audio/webm';
        //     audioEl.appendChild(sourceEl);
        //     document.body.appendChild(audioEl);
        //     document.body.appendChild(downloadEl);
        // }
    }
    currentTime.textContent = NOW();

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
    var totaltext;
    var page = 5;
    function timer() {
        t = setTimeout(add, 1000);
    }

    dbSetup().then(function() {
        console.log('db is setup');
        countData().then(function(result) {
            totaltext = result;
            displayData();
        });
    }).catch(function(e) {
      console.log('I had an issue making the db: '+e);
    });

    var position = 0;
    function dbSetup() {

    	return new Promise(function(resolve, reject) {

    		var req = window.indexedDB.open('RecordDB', 25);

    		req.onupgradeneeded = function(e) {
    			var thedb = e.target.result;
    			var os = thedb.createObjectStore("RecordField", { keyPath: "RecordNo", autoIncrement:true});

        };

    		req.onsuccess = function(e) {
			       db = e.target.result;
    			   resolve();
    		};

    		req.onerror = function(e) {
    			reject(e);
    		};

    	});
    }

    function countData() {

    	return new Promise(function(resolve, reject) {

    		db.transaction(['RecordField'],'readonly').objectStore('RecordField').count().onsuccess = function(e) {
    			resolve(e.target.result);
    		};

    	});

    }

    function displayData() {

    	getData(position,page).then(function(cats) {
    		var s = '';
    		console.log(cats)
        console.log(cats[0].Content);
        var blob = cats[0].Content;
        const audio = new Audio();
        //var test = createAudioElement(URL.createObjectURL(blob));
        test1= URL.createObjectURL(blob);
        audio.src = test1;
        audio.load();
        audio.play();
    		// cats.forEach(function(cat) {
        //   var imgURL = cat.Content;
        //   const audio = new Audio();
        //   audio.src = imgURL;
        //   audio.load();
        //   audio.play();
        //   console.log(audio);
        //   // const audio = new Audio(cat.Content);
        //   // console.log(audio)
    		// 	s += `
    		// 				<audio src="${te}" controls><br>
        //         "녹음"</td>
    		// 	</tr>`;
    		// });

    		document.getElementById('test').innerHTML = s;

    		console.log('got cats');
    		if(position > 0) {
    			console.log('enable back');
    			$prev.removeAttribute('disabled');
    		} else {
    			$prev.setAttribute('disabled', 'disabled');
    		}
    		if(position + page < totaltext) {
    			console.log('enable next');
    			$next.removeAttribute('disabled');
    		} else {
    			$next.setAttribute('disabled', 'disabled');
    		}
    	});
    }

    function getData(start,total) {

    	return new Promise(function(resolve, reject) {

    		var t = db.transaction(['RecordField'],'readonly');
    		var catos = t.objectStore('RecordField');
    		var cats = [];

    		console.log('start='+start+' total='+total);
    		var hasSkipped = false;
    		catos.openCursor().onsuccess = function(e) {

    			var cursor = e.target.result;
    			if(!hasSkipped && start > 0) {
    				hasSkipped = true;
    				cursor.advance(start);
    				return;
    			}
    			if(cursor) {
    				console.log('pushing ',cursor.value);
    				cats.push(cursor.value);
    				if(cats.length < total) {
    					cursor.continue();
    				} else {
    					resolve(cats);
    				}
    			} else {
    				console.log('resolving ',cats);
    				resolve(cats);
    			}
    		};

    	});

    }

});
