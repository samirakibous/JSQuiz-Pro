const labels = themeStats.map(stat => stat.thematique);
const data = themeStats.map(stat => stat.total);
const labelsLine = evolutionStats.map(item => item.mois);
const dataLine = evolutionStats.map(item => parseFloat(item.avg_score).toFixed(1));

const ctx = document.getElementById('themeChart').getContext('2d');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Nombre de parties par thématique',
            data: data,
            backgroundColor: [
                '#3b82f6',
                '#f97316',
                '#10b981',
                '#f43f5e',
                '#8b5cf6',
                '#eab308'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});


const ctxLine = document.getElementById("scoreEvolutionChart").getContext("2d");
new Chart(ctxLine, {
    type: "line",
    data: {
        labels: labelsLine,
        datasets: [{
            label: "Score moyen",
            data: dataLine,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});