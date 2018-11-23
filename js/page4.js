//global handler for the IDB
var db;

//current position for paging
var position = 0;

//total number of cats
var totaltext;

//dom items for prev/next buttons, not using jQuery but like the syntax
var $prev, $next;

//how many per page?
var page = 5;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
	console.log('page init');

	$prev = document.querySelector("#backButton");
	$next = document.querySelector("#nextButton");

	$prev.addEventListener('click', move);
	$next.addEventListener('click', move);

	dbSetup().then(function() {
		console.log('db is setup');

		countData().then(function(result) {
			totaltext = result;
			displayData();
		});

	}).catch(function(e) {
		console.log('I had an issue making the db: '+e);
	});
}

function dbSetup() {

	return new Promise(function(resolve, reject) {

		var req = window.indexedDB.open('MemoDB', 25);

		req.onupgradeneeded = function(e) {
			var thedb = e.target.result;
			var os = thedb.createObjectStore("MemoTextField", { keyPath: "textNo", autoIncrement:true});
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

		db.transaction(['MemoTextField'],'readonly').objectStore('MemoTextField').count().onsuccess = function(e) {
			resolve(e.target.result);
		};

	});

}


function displayData() {

	getData(position,page).then(function(datas) {
		var s = '';
		var audioUrl;
		for(let i = datas.length-1; i > -1; i--) {
			color = datas[i].Color;
			if(datas[i].Audio != undefined) {
				audioUrl= URL.createObjectURL(datas[i].Audio);
				s += `
				<tr>
					<td class="header_font"><p class="mdl-navigation__link mdl-typography--text-uppercase">${datas[i].Date.getFullYear()}-${(((datas[i].Date.getMonth()+1) < 10) ? '0' + (datas[i].Date.getMonth()+1) : (datas[i].Date.getMonth()+1))}-${((datas[i].Date.getDate() < 10) ? '0' + datas[i].Date.getDate() : datas[i].Date.getDate())} ${((datas[i].Date.getHours() < 10) ? '0' + datas[i].Date.getHours() : datas[i].Date.getHours())}:${((datas[i].Date.getMinutes() < 10) ? '0' + datas[i].Date.getMinutes() : datas[i].Date.getMinutes())}</p></td>
					<td><span class="color" id="color${datas[i].textNo}"><style> #color${datas[i].textNo} { background-color: ${color} }</style></span></td>
					<td><audio src="${audioUrl}" controls 	type="audio/mpeg"></td>
					<td class="td" style="color: #757575; font-weight: 700;" onclick=tr(${datas[i].textNo}) id=${datas[i].textNo}><p class="mdl-navigation__link mdl-typography--text-uppercase">${datas[i].Content}</p></td>
				</tr>`;
			}
			else {
				s += `
				<tr>
					<td class="header_font">${datas[i].Date.getFullYear()}-${(((datas[i].Date.getMonth()+1) < 10) ? '0' + (datas[i].Date.getMonth()+1) : (datas[i].Date.getMonth()+1))}-${((datas[i].Date.getDate() < 10) ? '0' + datas[i].Date.getDate() : datas[i].Date.getDate())} ${((datas[i].Date.getHours() < 10) ? '0' + datas[i].Date.getHours() : datas[i].Date.getHours())}:${((datas[i].Date.getMinutes() < 10) ? '0' + datas[i].Date.getMinutes() : datas[i].Date.getMinutes())}</td>
					<td><span class="color" id="color${datas[i].textNo}"><style> #color${datas[i].textNo} { background-color: ${color} }</style></span></td>
					<td></td>
					<td class="td" style="color: #757575; font-weight: 700;" onclick=tr(${datas[i].textNo}) id=${datas[i].textNo}>${datas[i].Content}</td>
				</tr>`;
			}
		}
		document.getElementById('tbody').innerHTML = s;

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

function tr(key) {
	console.log(key + "page load");
	location.href = 'page6.html?' + "id=" + key;
}

function move(e) {
	if(e.target.id === 'nextButton') {
		position += page;
		displayData();
	} else {
		position -= page;
		displayData();
	}
}

function getData(start,total) {

	return new Promise(function(resolve, reject) {

		var t = db.transaction(['MemoTextField'],'readonly');
		var catos = t.objectStore('MemoTextField');
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
