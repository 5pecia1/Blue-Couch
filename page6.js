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
    };

    function pageload(){
    var id = readIdByQueryString();  
    var request = db.transaction(["MemoTextField"], "readonly").objectStore("MemoTextField").get(id);
    let node = document.getElementsByClassName('circle')[0];
    currentTime.textContent = NOW();
    
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