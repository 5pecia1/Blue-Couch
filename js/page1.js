document.addEventListener('DOMContentLoaded', () => {
    let moods = document.getElementsByClassName('item');
    console.log(moods);

    for(let i = 0; i < moods.length; i++) {
        console.log(moods[i]);
        moods[i].onclick = nextPage;
    }
});

function nextPage() {
    let rgb = window.getComputedStyle(this).getPropertyValue('background-color');
    let hex = rgbToHex(rgb);
    window.location.href = `page3.html?color=${hex}`
}

function rgbToHex(rgb) {
    let s = rgb.split("(")[1].split(")")[0];
    s = s.split(",");
    let hex = s.map(function(x){
        x = parseInt(x).toString(16);
        return (x.length==1) ? "0"+x : x;
    });

    return hex.join("");
}