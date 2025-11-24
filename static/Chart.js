function renderChart(canvasId, serie) {
    const ctx = document.getElementById(canvasId);

    const labels = Object.keys(serie).filter(k => k !== "empty");
    const values = Object.values(serie).filter((v, i) => labels[i] !== "empty");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: serie.empty,
                data: values,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
