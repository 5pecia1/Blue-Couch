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

    
  $("#addBtn").click(function () {    
    var content = $('#content').val();  
    var newDate = new Date();
    var Month = newDate.getMonth()+1; 
    var date = newDate.getFullYear() + '.' + Month + '.' + newDate.getDate();

    var transaction = db.transaction(["MemoTextField"], "readwrite");  

    var objectStore = transaction.objectStore("MemoTextField");  
    objectStore.add({ Content: content, Date: date });  

    transaction.oncomplete = function (event) {  
        console.log("Success :)");  
        $('#result').html("Add: Successfully");  

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


});
