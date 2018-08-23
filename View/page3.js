var currentTime = Document.getElementById("now");

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