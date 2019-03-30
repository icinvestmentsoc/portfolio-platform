/**
 * @name createLineChart
 * @description used for creating a stock line chart for showing off society portfolio
 * @param {*} jsonURL | GET URL for where we can find the data
 * @param {*} chartID | element id for where the chart will be placed within
 * @returns null
 */

function createLineChart(jsonURL, chartID) {
    $.getJSON(jsonURL, function (data) {
        Highcharts.chart(chartID, {
            chart: {
                height: 200
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false 
            },
            title: false,
          	subtitle:false,
            xAxis: {
                type: 'datetime',
                gridLineColor: 'transparent',
                labels: {
                  enabled: false
                },
                visible: false
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor: 'transparent'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
               line: {
               	color: "black"
               },
               series: {
                lineWidth: 4,
               	marker: {
                enabled: false
                }
               }
            },
            series: [{
                type: 'line',
                name: 'USD to EUR',
                data: [[0,1],[1,2],[2,2],[3,7],[4,5],[5,0.3],[6,1],[7,20],[8,1.3]]
            }]
        });
    })
}