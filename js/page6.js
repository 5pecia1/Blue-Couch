$(document).ready(function () {  
    // windowwindow.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;  
    var request, db;
    var currentTime = document.getElementById('now');
       
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
            NOW((date) => {
                currentTime.textContent = date.getFullYear() + '-' + (((date.getMonth() < 10)+1) ? '0' + (date.getMonth()+1) : (date.getMonth()+1) ) + '-' + ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()) + ' ' + ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()) + ':' + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes());
            });
        }  
    }

    function NOW(callBack) {
        var id = readIdByQueryString();  
        var request = db.transaction(["MemoTextField"], "readonly").objectStore("MemoTextField").get(id);
        request.onsuccess = function (event) {
            var r = request.result;
            var newdate = new Date(r.Date);
            if (r != null) {
            console.log(newdate);   
            callBack(newdate);    
            }            
        };
    };


    function pageload(){
    var id = readIdByQueryString();  
    var request = db.transaction(["MemoTextField"], "readonly").objectStore("MemoTextField").get(id);
    let node = document.getElementsByClassName('circle')[0];
    
    request.onsuccess = function (event) {  
        var r = request.result;  
        if (r != null) {  
              $('#content').val(r.Content);
              node.style.backgroundColor = r.Color;   
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