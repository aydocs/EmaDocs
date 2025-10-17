/**
 * Ema Framework - Advanced Chart System
 * Canvas tabanlı gelişmiş grafik ve veri görselleştirme sistemi
 */

class EmaCharts {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.charts = new Map();
        this.animations = new Map();
        this.colors = {
            purple: '#6f42c1',
            blue: '#007bff',
            green: '#28a745',
            yellow: '#ffc107',
            red: '#dc3545',
            orange: '#fd7e14',
            gray: '#6c757d',
            white: '#ffffff'
        };
    }

    init(container) {
        this.createCanvas(container);
        this.setupEventListeners();
    }

    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 8px;
        `;
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.charts.forEach(chart => {
                if (chart.onHover) {
                    chart.onHover(x, y, chart);
                }
            });
        });
    }

    createLineChart(options = {}) {
        const chart = {
            type: 'line',
            data: options.data || [],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: true,
                animationDuration: 1000,
                showGrid: true,
                showLabels: true,
                showLegend: true,
                colors: options.colors || [this.colors.purple, this.colors.blue, this.colors.green],
                ...options
            },
            canvas: this.canvas,
            ctx: this.ctx
        };

        this.charts.set('line', chart);
        this.renderChart(chart);
        return chart;
    }

    createBarChart(options = {}) {
        const chart = {
            type: 'bar',
            data: options.data || [],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: true,
                animationDuration: 1200,
                showGrid: true,
                showLabels: true,
                showLegend: true,
                colors: options.colors || [this.colors.purple, this.colors.blue, this.colors.green],
                ...options
            },
            canvas: this.canvas,
            ctx: this.ctx
        };

        this.charts.set('bar', chart);
        this.renderChart(chart);
        return chart;
    }

    createPieChart(options = {}) {
        const chart = {
            type: 'pie',
            data: options.data || [],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: true,
                animationDuration: 1500,
                showLabels: true,
                showLegend: true,
                colors: options.colors || [this.colors.purple, this.colors.blue, this.colors.green, this.colors.yellow, this.colors.red],
                ...options
            },
            canvas: this.canvas,
            ctx: this.ctx
        };

        this.charts.set('pie', chart);
        this.renderChart(chart);
        return chart;
    }

    createAreaChart(options = {}) {
        const chart = {
            type: 'area',
            data: options.data || [],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: true,
                animationDuration: 1300,
                showGrid: true,
                showLabels: true,
                showLegend: true,
                colors: options.colors || [this.colors.purple, this.colors.blue, this.colors.green],
                fillOpacity: 0.3,
                ...options
            },
            canvas: this.canvas,
            ctx: this.ctx
        };

        this.charts.set('area', chart);
        this.renderChart(chart);
        return chart;
    }

    createRadarChart(options = {}) {
        const chart = {
            type: 'radar',
            data: options.data || [],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: true,
                animationDuration: 1400,
                showGrid: true,
                showLabels: true,
                showLegend: true,
                colors: options.colors || [this.colors.purple, this.colors.blue, this.colors.green],
                ...options
            },
            canvas: this.canvas,
            ctx: this.ctx
        };

        this.charts.set('radar', chart);
        this.renderChart(chart);
        return chart;
    }

    renderChart(chart) {
        const { ctx, canvas } = chart;
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set up drawing area
        const padding = 60;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        ctx.save();
        
        switch (chart.type) {
            case 'line':
                this.renderLineChart(ctx, chart, padding, chartWidth, chartHeight);
                break;
            case 'bar':
                this.renderBarChart(ctx, chart, padding, chartWidth, chartHeight);
                break;
            case 'pie':
                this.renderPieChart(ctx, chart, width / 2, height / 2);
                break;
            case 'area':
                this.renderAreaChart(ctx, chart, padding, chartWidth, chartHeight);
                break;
            case 'radar':
                this.renderRadarChart(ctx, chart, width / 2, height / 2);
                break;
        }
        
        ctx.restore();
    }

    renderLineChart(ctx, chart, padding, chartWidth, chartHeight) {
        const { data, options } = chart;
        
        // Draw grid
        if (options.showGrid) {
            this.drawGrid(ctx, padding, chartWidth, chartHeight);
        }
        
        // Calculate scales
        const maxValue = Math.max(...data.flat());
        const minValue = Math.min(...data.flat());
        const valueRange = maxValue - minValue;
        
        const stepX = chartWidth / (data[0].length - 1);
        const scaleY = chartHeight / valueRange;
        
        // Draw lines for each dataset
        data.forEach((dataset, datasetIndex) => {
            ctx.beginPath();
            ctx.strokeStyle = options.colors[datasetIndex % options.colors.length];
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            dataset.forEach((value, index) => {
                const x = padding + (index * stepX);
                const y = padding + chartHeight - ((value - minValue) * scaleY);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Draw points
                ctx.fillStyle = options.colors[datasetIndex % options.colors.length];
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.stroke();
        });
        
        // Draw labels
        if (options.showLabels) {
            this.drawLabels(ctx, data[0], padding, chartWidth, chartHeight, 'x');
            this.drawValueLabels(ctx, maxValue, minValue, padding, chartHeight, 'y');
        }
    }

    renderBarChart(ctx, chart, padding, chartWidth, chartHeight) {
        const { data, options } = chart;
        
        // Draw grid
        if (options.showGrid) {
            this.drawGrid(ctx, padding, chartWidth, chartHeight);
        }
        
        // Calculate scales
        const maxValue = Math.max(...data.flat());
        const minValue = Math.min(...data.flat());
        const valueRange = maxValue - minValue;
        
        const barWidth = chartWidth / (data[0].length * data.length + data.length);
        const scaleY = chartHeight / valueRange;
        
        // Draw bars for each dataset
        data.forEach((dataset, datasetIndex) => {
            dataset.forEach((value, index) => {
                const x = padding + (index * (data.length + 1) + datasetIndex) * barWidth;
                const barHeight = (value - minValue) * scaleY;
                const y = padding + chartHeight - barHeight;
                
                ctx.fillStyle = options.colors[datasetIndex % options.colors.length];
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // Add hover effect
                ctx.strokeStyle = options.colors[datasetIndex % options.colors.length];
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, barWidth, barHeight);
            });
        });
        
        // Draw labels
        if (options.showLabels) {
            this.drawLabels(ctx, data[0], padding, chartWidth, chartHeight, 'x');
            this.drawValueLabels(ctx, maxValue, minValue, padding, chartHeight, 'y');
        }
    }

    renderPieChart(ctx, chart, centerX, centerY) {
        const { data, options } = chart;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        const radius = Math.min(centerX, centerY) - 60;
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = options.colors[index % options.colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw slice border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw labels
            if (options.showLabels) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
                
                ctx.fillStyle = '#333';
                ctx.font = '14px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);
            }
            
            currentAngle += sliceAngle;
        });
    }

    renderAreaChart(ctx, chart, padding, chartWidth, chartHeight) {
        const { data, options } = chart;
        
        // Draw grid
        if (options.showGrid) {
            this.drawGrid(ctx, padding, chartWidth, chartHeight);
        }
        
        // Calculate scales
        const maxValue = Math.max(...data.flat());
        const minValue = Math.min(...data.flat());
        const valueRange = maxValue - minValue;
        
        const stepX = chartWidth / (data[0].length - 1);
        const scaleY = chartHeight / valueRange;
        
        // Draw areas for each dataset
        data.forEach((dataset, datasetIndex) => {
            ctx.beginPath();
            ctx.fillStyle = options.colors[datasetIndex % options.colors.length];
            
            // Start from bottom
            ctx.moveTo(padding, padding + chartHeight);
            
            dataset.forEach((value, index) => {
                const x = padding + (index * stepX);
                const y = padding + chartHeight - ((value - minValue) * scaleY);
                
                ctx.lineTo(x, y);
            });
            
            // Close area
            ctx.lineTo(padding + chartWidth, padding + chartHeight);
            ctx.closePath();
            
            // Fill with opacity
            ctx.globalAlpha = options.fillOpacity || 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Draw line
            ctx.strokeStyle = options.colors[datasetIndex % options.colors.length];
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    renderRadarChart(ctx, chart, centerX, centerY) {
        const { data, options } = chart;
        
        const maxRadius = Math.min(centerX, centerY) - 80;
        const numPoints = data[0].length;
        const angleStep = (2 * Math.PI) / numPoints;
        
        // Draw grid circles
        for (let i = 1; i <= 5; i++) {
            const radius = (maxRadius / 5) * i;
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw grid lines
        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * maxRadius;
            const y = centerY + Math.sin(angle) * maxRadius;
            
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        // Draw data polygons
        data.forEach((dataset, datasetIndex) => {
            ctx.beginPath();
            ctx.strokeStyle = options.colors[datasetIndex % options.colors.length];
            ctx.fillStyle = options.colors[datasetIndex % options.colors.length];
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            
            const maxValue = Math.max(...dataset);
            
            dataset.forEach((value, index) => {
                const angle = index * angleStep;
                const radius = (value / maxValue) * maxRadius;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
        });
    }

    drawGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 10; i++) {
            const y = padding + (chartHeight / 10) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
    }

    drawLabels(ctx, labels, padding, chartWidth, chartHeight, axis) {
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        if (axis === 'x') {
            labels.forEach((label, index) => {
                const x = padding + (chartWidth / (labels.length - 1)) * index;
                const y = padding + chartHeight + 20;
                ctx.fillText(label.toString(), x, y);
            });
        }
    }

    drawValueLabels(ctx, maxValue, minValue, padding, chartHeight, axis) {
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        
        if (axis === 'y') {
            for (let i = 0; i <= 10; i++) {
                const value = minValue + ((maxValue - minValue) / 10) * i;
                const y = padding + chartHeight - (chartHeight / 10) * i;
                ctx.fillText(value.toFixed(1), padding - 10, y + 4);
            }
        }
    }

    // Animation methods
    animateChart(chartId, newData, duration = 1000) {
        const chart = this.charts.get(chartId);
        if (!chart) return;
        
        const startTime = Date.now();
        const startData = [...chart.data];
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            // Interpolate data
            chart.data = startData.map((dataset, datasetIndex) => 
                dataset.map((value, valueIndex) => {
                    const startValue = value;
                    const endValue = newData[datasetIndex][valueIndex];
                    return startValue + (endValue - startValue) * easeOutCubic;
                })
            );
            
            this.renderChart(chart);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // Public methods
    updateData(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = newData;
            this.renderChart(chart);
        }
    }

    destroy() {
        this.charts.clear();
        this.animations.clear();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize global instance
window.emaCharts = new EmaCharts();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmaCharts;
}
