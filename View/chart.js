google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);


function drawChart() {
    const graphData = google.visualization.arrayToDataTable([
        ['날짜', '기분'],
        ['123', 123]
    ]);
    
    var options = {
      title: 'Company Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };
    
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    
    chart.draw(graphData, options);
}

function addDrawChart(rowData){
    
}