//set defaults
Chart.defaults.global.defaultFontSize = 40;

var ctx = document.getElementById("chart-wins").getContext('2d')
winsChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Red", "Blue"],
    datasets: [{
        label: '# of Wins',
        data: [0, 0],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
    }]
  },
  options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
})

function increaseWins(which) {
  winsChart.data.datasets[0].data[which] += 1
  winsChart.update()
}
