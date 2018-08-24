$(document).ready(function () {  
  // windowwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;  
  var request, db;

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

  function move() {
    location.href = 'page4.html';
  }
  
  
  $("#addBtn").click(function () {    
    var content = $('#content').val();
    var newdate = new Date();  
    var date = new Date(newdate.toISOString());
    var color = "#" + readColorByQueryString();

    var transaction = db.transaction(["MemoTextField"], "readwrite");  

    var objectStore = transaction.objectStore("MemoTextField");  
    objectStore.add({ Content: content, Date: date, Color: color });  

    transaction.oncomplete = function (event) {  
        console.log("Success :)");  
        $('#result').html("Add: Successfully");
        move();  

    };  

    transaction.onerror = function (event) {  
        console.log("Error :)");  
        $('#result').html("Add: Error occurs in inserting");  
    };  

    ClearTextBox();  

    });
    

  function ClearTextBox() {  
      $('#title').val('');  
      $('#content').val('');    
      $('#txtSearch').val('');  
  }  

  setMoodColor();
});

function setMoodColor() {
    let color = readColorByQueryString();
    let node = document.getElementsByClassName('circle')[0];
    node.style.backgroundColor = '#' + color;
}

function readColorByQueryString(){
    var regex = "color="; 
    var str = window.location.search.substring(1); 
    return str.replace(regex, ""); 
}