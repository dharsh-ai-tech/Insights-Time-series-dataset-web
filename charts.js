// 🌟 Draws Line, Bar, Pie, and Radar Charts for Dataset Insights

function getChartData(data, chartType = 'line') {
    const keys = Object.keys(data);
    const labels = keys;
    const datasets = [];

    if (keys.length === 0) return { labels: [], datasets: [] };

    const sample = data[keys[0]];

    for (let metric in sample) {
        const values = keys.map(k => data[k][metric]);

        // Pie chart handles only one metric at a time
        if (chartType === 'pie' || chartType === 'doughnut') {
            return {
                labels,
                datasets: [{
                    label: metric,
                    data: values,
                    backgroundColor: generateColors(values.length),
                    hoverOffset: 4
                }]
            };
        }

        datasets.push({
            label: metric,
            data: values,
            backgroundColor: generateColors(values.length),
            borderColor: generateColors(values.length),
            fill: chartType === 'line' || chartType === 'radar',
            tension: 0.4
        });
    }

    return { labels, datasets };
}

function generateColors(n) {
    return Array.from({ length: n }, () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
}

function drawAllCharts(data) {
    const chartTypes = ['line', 'bar', 'pie', 'radar'];
    const container = document.getElementById('charts-container');
    container.innerHTML = ''; // Clear old charts

    chartTypes.forEach(type => {
        const chartBox = document.createElement('div');
        chartBox.className = 'chart-box';

        const title = document.createElement('h3');
        title.textContent = `${type.toUpperCase()} Chart`;
        chartBox.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        chartBox.appendChild(canvas);

        container.appendChild(chartBox);

        const ctx = canvas.getContext('2d');
        const chartData = getChartData(data, type);

        new Chart(ctx, {
            type: type === 'pie' ? 'pie' : type,
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: false
                    }
                }
            }
        });
    });
}

// 🔁 Handle dropdown change
document.getElementById('range').addEventListener('change', (e) => {
    const selected = e.target.value;
    drawAllCharts(rawInsights[selected]);
});

// 🚀 Initial chart draw
drawAllCharts(rawInsights['month']);
