google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initChart);

function initChart() {
    console.log('init Chart!');
    let chart = null;
    let chartDataTable = null;

    chartDataTable = new google.visualization.DataTable();

    chartDataTable.addColumn('date', '날짜');
    chartDataTable.addColumn('number', '글자 수');
    chartDataTable.addColumn( {'type': 'string', 'role': 'style'} );

    let options = {
      title: '당신의 기분 변화',
      height: 300,
      legend: { position: 'bottom' },
      vAxis: {
        format: '0'
      },
      hAxis: {
        format: 'MMM/dd HH:mm'
      }
    };

    chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    chart.draw(chartDataTable, options);
    setChart().then((cursor) => {
        cursor.onsuccess = (result) => {
            let cursor = result.target.result;
            if(cursor != null) {
                console.log(cursor.value);
                let color = cursor.value['Color'];
                let date = cursor.value['Date'];
                let content = cursor.value['Content'];
                addRowsAndDraw(chart, chartDataTable, options, [date, content.length, 'point { fill-color:' + color + '}']);
                cursor.continue();
            }
        }
    });
}

function setChart() {
    return new Promise((resolve, reject) => {
        let iDBObjectStore = db.transaction(['MemoTextField'],'readonly').objectStore('MemoTextField');
        resolve(iDBObjectStore.openCursor());
    });
}

function addRowsAndDraw(chart, chartDataTable, options, rows = []) {
    chartDataTable.addRows([
        rows
    ]);
    chart.draw(chartDataTable, options);
}

window.addEventListener('resize', function(){
    initChart();
});
