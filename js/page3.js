document.addEventListener("DOMContentLoaded", function () {  
    // windowwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;  
    var request, db;
    let addData = document.getElementById('addBtn');
  
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
    
    addData.addEventListener('click', function () {    
        var content = document.querySelector('#content').value;
        var newdate = new Date();  
        var date = new Date(newdate.toISOString());
        var color = "#" + readColorByQueryString();
        console.log("123");
    
        var transaction = db.transaction(["MemoTextField"], "readwrite");  
    
        var objectStore = transaction.objectStore("MemoTextField");  
        objectStore.add({ Content: content, Date: date, Color: color });  
    
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
