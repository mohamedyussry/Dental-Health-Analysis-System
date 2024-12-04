let teethHealthChart;
let symmetryChart;

function initializeCharts() {
    const teethHealthCtx = document.getElementById('teethHealthChart').getContext('2d');
    const symmetryCtx = document.getElementById('symmetryChart').getContext('2d');

    // Initialize teeth health chart
    teethHealthChart = new Chart(teethHealthCtx, {
        type: 'bar',
        data: {
            labels: Array.from({length: CONFIG.CHART.MAX_TEETH}, (_, i) => `السن ${i+1}`),
            datasets: [{
                label: 'صحة الأسنان %',
                data: Array(CONFIG.CHART.MAX_TEETH).fill(0),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Initialize symmetry chart
    symmetryChart = new Chart(symmetryCtx, {
        type: 'doughnut',
        data: {
            labels: ['تناسق', 'عدم تناسق'],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.5)',
                    'rgba(231, 76, 60, 0.5)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function updateCharts(healthData, symmetryData) {
    // Update teeth health chart
    teethHealthChart.data.datasets[0].data = healthData;
    teethHealthChart.update();

    // Update symmetry chart
    symmetryChart.data.datasets[0].data = [
        symmetryData.symmetry,
        100 - symmetryData.symmetry
    ];
    symmetryChart.update();
}

function resetCharts() {
    teethHealthChart.data.datasets[0].data = Array(CONFIG.CHART.MAX_TEETH).fill(0);
    teethHealthChart.update();
    
    symmetryChart.data.datasets[0].data = [0, 100];
    symmetryChart.update();
}
