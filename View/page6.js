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
            pageload();
        }  
    }  
    
    function pageload(){
    var id = readIdByQueryString();  
    var request = db.transaction(["MemoTextField"], "readonly").objectStore("MemoTextField").get(id);  
    request.onsuccess = function (event) {  
        var r = request.result;  
        if (r != null) {  
              $('#content').val(r.Content);   
        } else {  
              ClearTextBox();  
              alert('Record Does not exist');  
        }  
    };
    }; 
  
  
    function ClearTextBox() {  
        $('#title').val('');  
        $('#content').val('');    
        $('#txtSearch').val('');  
    }  
  
     
    $('#updateBtn').click(function () {  
       // var rollNo = parseInt($('#txtSearch').val());
        var rollNo = readIdByQueryString(); 
        var title = $('#title').val();  
        var content = $('#content').val();    
  
        var transaction = db.transaction(["MemoTextField"], "readwrite");  
        var objectStore = transaction.objectStore("MemoTextField");  
        var request = objectStore.get(rollNo);  
        request.onsuccess = function (event) {  
  
            request.result.Title = title;  
            request.result.Content = content;   
            objectStore.put(request.result);  
            alert('Recored Updated Successfully !!!');  
        };  
  
    });  
  
    $('#deleteBtn').click(function () {  
        //var id = parseInt($('#txtSearch').val());
        var id = readIdByQueryString();  
        db.transaction(["MemoTextField"], "readwrite").objectStore("MemoTextField").delete(id);  
        alert(' Recored No. ' + id + ' Deleted Successfully !!!');  
    });  
  
  
  });
  
  function readIdByQueryString(){
    var regex = "id="; 
    var str = window.location.search.substring(1); 
    str = str.replace(regex, ""); 
    const queryString = parseInt(str);
    return (isNaN(queryString))? null : queryString;
  }