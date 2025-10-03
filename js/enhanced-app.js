/**
 * Enhanced Wave Calculator Application
 * Handles all UI interactions, real-time updates, and visualizations
 */

class EnhancedWaveApp {
    constructor() {
        this.currentWave = null;
        this.currentSpectrum = null;
        this.visualizations = new WaveVisualizations();
        this.isAnimating = false;

        this.initializeSliders();
        this.setupEventListeners();
        this.updateCalculations();
    }

    initializeSliders() {
        // Initialize sliders for all three tabs
        this.initializeTabSliders('', this.updateCalculations.bind(this));
        this.initializeTabSliders('2', this.updateProfiles.bind(this));
        this.initializeTabSliders('3', this.updateAdvancedAnalysis.bind(this));

        // Wind speed slider
        const windSpeedSlider = document.getElementById('windSpeedSlider');
        const windSpeedValue = document.getElementById('windSpeedValue');
        windSpeedSlider.oninput = () => {
            windSpeedValue.textContent = `${windSpeedSlider.value} m/s`;
            this.updateSpectrum();
        };

        // Fetch slider
        const fetchSlider = document.getElementById('fetchSlider');
        const fetchValue = document.getElementById('fetchValue');
        fetchSlider.oninput = () => {
            fetchValue.textContent = `${fetchSlider.value} km`;
            this.updateSpectrum();
        };
    }

    initializeTabSliders(suffix, updateCallback) {
        // Amplitude slider
        const amplitudeSlider = document.getElementById(`amplitudeSlider${suffix}`);
        const amplitudeValue = document.getElementById(`amplitudeValue${suffix}`);
        if (amplitudeSlider) {
            amplitudeSlider.oninput = () => {
                amplitudeValue.textContent = `${amplitudeSlider.value} m`;
                updateCallback();
                this.syncSliders('amplitude', amplitudeSlider.value, suffix);
            };
        }

        // Depth slider
        const depthSlider = document.getElementById(`depthSlider${suffix}`);
        const depthValue = document.getElementById(`depthValue${suffix}`);
        if (depthSlider) {
            depthSlider.oninput = () => {
                depthValue.textContent = `${depthSlider.value} m`;
                updateCallback();
                this.syncSliders('depth', depthSlider.value, suffix);
            };
        }

        // Period/Wavelength slider
        const periodSlider = document.getElementById(`periodSlider${suffix}`);
        const periodValue = document.getElementById(`periodValue${suffix}`);
        const periodLabel = document.getElementById(`periodLabel${suffix}`);
        const wavelengthCheckbox = document.getElementById(`wavelengthCheckbox${suffix}`);

        if (periodSlider) {
            periodSlider.oninput = () => {
                const unit = wavelengthCheckbox?.checked ? 'm' : 's';
                periodValue.textContent = `${periodSlider.value} ${unit}`;
                updateCallback();
                this.syncSliders('period', periodSlider.value, suffix);
                this.syncSliders('wavelengthMode', wavelengthCheckbox?.checked || false, suffix);
            };
        }

        // Z-depth slider
        const zDepthSlider = document.getElementById(`zDepthSlider${suffix}`);
        const zDepthValue = document.getElementById(`zDepthValue${suffix}`);
        if (zDepthSlider) {
            zDepthSlider.oninput = () => {
                zDepthValue.textContent = `${zDepthSlider.value} m`;
                updateCallback();
                this.syncSliders('zDepth', zDepthSlider.value, suffix);
            };
        }

        // Wavelength checkbox
        if (wavelengthCheckbox) {
            wavelengthCheckbox.onchange = () => {
                if (wavelengthCheckbox.checked) {
                    periodLabel.textContent = 'Wavelength';
                    periodValue.textContent = `${periodSlider.value} m`;
                    periodSlider.min = '10';
                    periodSlider.max = '500';
                    periodSlider.step = '5';
                    periodSlider.value = '100';
                } else {
                    periodLabel.textContent = 'Wave Period';
                    periodValue.textContent = `${periodSlider.value} s`;
                    periodSlider.min = '1';
                    periodSlider.max = '20';
                    periodSlider.step = '0.1';
                    periodSlider.value = '10';
                }
                updateCallback();
                this.syncSliders('wavelengthMode', wavelengthCheckbox.checked, suffix);
                this.syncSliders('period', periodSlider.value, suffix);
            };
        }
    }

    // Sync sliders across tabs
    syncSliders(property, value, excludeSuffix) {
        const suffixes = ['', '2', '3'];

        suffixes.forEach(suffix => {
            if (suffix === excludeSuffix) return;

            switch(property) {
                case 'amplitude':
                    const ampSlider = document.getElementById(`amplitudeSlider${suffix}`);
                    const ampValue = document.getElementById(`amplitudeValue${suffix}`);
                    if (ampSlider) {
                        ampSlider.value = value;
                        ampValue.textContent = `${value} m`;
                    }
                    break;
                case 'depth':
                    const depthSlider = document.getElementById(`depthSlider${suffix}`);
                    const depthValue = document.getElementById(`depthValue${suffix}`);
                    if (depthSlider) {
                        depthSlider.value = value;
                        depthValue.textContent = `${value} m`;
                    }
                    break;
                case 'period':
                    const periodSlider = document.getElementById(`periodSlider${suffix}`);
                    const periodValue = document.getElementById(`periodValue${suffix}`);
                    const wavelengthCheckbox = document.getElementById(`wavelengthCheckbox${suffix}`);
                    if (periodSlider) {
                        periodSlider.value = value;
                        const unit = wavelengthCheckbox?.checked ? 'm' : 's';
                        periodValue.textContent = `${value} ${unit}`;
                    }
                    break;
                case 'zDepth':
                    const zDepthSlider = document.getElementById(`zDepthSlider${suffix}`);
                    const zDepthValue = document.getElementById(`zDepthValue${suffix}`);
                    if (zDepthSlider) {
                        zDepthSlider.value = value;
                        zDepthValue.textContent = `${value} m`;
                    }
                    break;
                case 'wavelengthMode':
                    const checkbox = document.getElementById(`wavelengthCheckbox${suffix}`);
                    const label = document.getElementById(`periodLabel${suffix}`);
                    const slider = document.getElementById(`periodSlider${suffix}`);
                    const valueDisplay = document.getElementById(`periodValue${suffix}`);

                    if (checkbox && slider) {
                        checkbox.checked = value;
                        if (value) {
                            label.textContent = 'Wavelength';
                            slider.min = '10';
                            slider.max = '500';
                            slider.step = '5';
                            if (slider.value < 10) slider.value = '100';
                            valueDisplay.textContent = `${slider.value} m`;
                        } else {
                            label.textContent = 'Wave Period';
                            slider.min = '1';
                            slider.max = '20';
                            slider.step = '0.1';
                            if (slider.value > 20) slider.value = '10';
                            valueDisplay.textContent = `${slider.value} s`;
                        }
                    }
                    break;
            }
        });
    }

    setupEventListeners() {
        // Tab switching event listeners
        document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                const targetId = event.target.getAttribute('data-bs-target');
                this.onTabSwitch(targetId);
            });
        });

        // Initialize first tab
        this.onTabSwitch('#linear');
    }

    onTabSwitch(tabId) {
        switch(tabId) {
            case '#linear':
                this.updateCalculations();
                break;
            case '#spectrum':
                this.updateSpectrum();
                break;
            case '#profile':
                this.updateProfiles();
                break;
            case '#analysis':
                this.updateAdvancedAnalysis();
                break;
        }
    }

    updateCalculations() {
        this.currentWave = this.createWaveFromSliders('');
        if (this.currentWave) {
            this.displayResults(this.currentWave.results);
        }
    }

    updateProfiles() {
        this.currentWave = this.createWaveFromSliders('2');
        if (this.currentWave) {
            this.visualizations.plotWaveProfile(this.currentWave, 'waveProfileChart');
            this.visualizations.plotVelocityProfile(this.currentWave, 'velocityProfileChart');
        }
    }

    updateAdvancedAnalysis() {
        this.currentWave = this.createWaveFromSliders('3');
        if (this.currentWave) {
            this.visualizations.plotDispersionRelation('dispersionChart', this.currentWave.waterDepth);
            this.visualizations.plotParticleMotion(this.currentWave, 'particleMotionChart');
        }
    }

    createWaveFromSliders(suffix) {
        try {
            // Get values from sliders
            const amplitude = parseFloat(document.getElementById(`amplitudeSlider${suffix}`).value);
            const depth = parseFloat(document.getElementById(`depthSlider${suffix}`).value);
            const periodOrWavelength = parseFloat(document.getElementById(`periodSlider${suffix}`).value);
            const zDepth = parseFloat(document.getElementById(`zDepthSlider${suffix}`).value);
            const isWavelength = document.getElementById(`wavelengthCheckbox${suffix}`)?.checked || false;

            // Create wave object
            let wave;
            if (isWavelength) {
                const L = periodOrWavelength;
                const k = 2 * Math.PI / L;
                wave = LinearWave.fromWavenumber(k, depth, amplitude, zDepth);
            } else {
                const T = periodOrWavelength;
                const f = 1 / T;
                wave = new LinearWave(f, depth, amplitude, zDepth);
            }

            return wave;

        } catch (error) {
            console.error('Error in calculations:', error);
            return null;
        }
    }

    displayResults(results) {
        const container = document.getElementById('linearResults');

        // Group results by category
        const categories = {
            'Basic Properties': [0, 1, 2, 3, 4, 5, 6, 7], // Amplitude through Wavelength
            'Wave Speeds': [8, 9], // Phase speed, Group velocity
            'Energy & Power': [10, 11, 12, 13], // Wave energy through Radiation stress
            'Velocities': [14, 15, 16, 17], // Pressures and velocities
            'Dimensionless': [18, 19] // Relative depth and velocity
        };

        let html = '';

        Object.entries(categories).forEach(([categoryName, indices]) => {
            html += `
                <div class="results-card card mb-3">
                    <div class="card-header">
                        <h6 class="mb-0"><i class="fa fa-info-circle"></i> ${categoryName}</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
            `;

            indices.forEach(index => {
                if (index < results.length) {
                    const [name, value, unit] = results[index];
                    html += `
                        <div class="col-md-6 mb-2">
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">${name}:</span>
                                <span>
                                    <span class="metric-value">${value.toFixed(3)}</span>
                                    <span class="metric-unit">${unit}</span>
                                </span>
                            </div>
                        </div>
                    `;
                }
            });

            html += `
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    updateSpectrum() {
        try {
            const windSpeed = parseFloat(document.getElementById('windSpeedSlider').value);
            const fetch = parseFloat(document.getElementById('fetchSlider').value) * 1000; // Convert to meters

            const spectrum = new JonswapSpectrum(windSpeed, fetch);
            this.currentSpectrum = spectrum;

            // Update visualization
            this.visualizations.plotJonswapSpectrum(spectrum, 'spectrumChart');

            // Display bulk parameters
            const bulkParams = spectrum.bulkParameters;
            const bulkContainer = document.getElementById('bulkParameters');

            bulkContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0"><i class="fa fa-tachometer"></i> Bulk Parameters</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 mb-2">
                                <div class="text-center">
                                    <div class="metric-value">${bulkParams.Hs.toFixed(2)}</div>
                                    <div class="metric-unit">Hs (m)</div>
                                </div>
                            </div>
                            <div class="col-6 mb-2">
                                <div class="text-center">
                                    <div class="metric-value">${bulkParams.Tp.toFixed(2)}</div>
                                    <div class="metric-unit">Tp (s)</div>
                                </div>
                            </div>
                            <div class="col-6 mb-2">
                                <div class="text-center">
                                    <div class="metric-value">${bulkParams.Tm.toFixed(2)}</div>
                                    <div class="metric-unit">Tm (s)</div>
                                </div>
                            </div>
                            <div class="col-6 mb-2">
                                <div class="text-center">
                                    <div class="metric-value">${bulkParams.fp.toFixed(3)}</div>
                                    <div class="metric-unit">fp (Hz)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error in spectrum calculations:', error);
        }
    }

}

// Animation control
function toggleAnimation() {
    const btn = document.getElementById('animateBtn');
    const app = window.waveApp;

    if (app.isAnimating) {
        app.visualizations.stopAnimation();
        btn.innerHTML = '<i class="fa fa-play"></i> Start Animation';
        app.isAnimating = false;
    } else {
        if (app.currentWave) {
            app.visualizations.plotWaveProfile(app.currentWave, 'waveProfileChart', true);
            btn.innerHTML = '<i class="fa fa-stop"></i> Stop Animation';
            app.isAnimating = true;
        }
    }
}

// Export functionality
function exportResults(format) {
    const app = window.waveApp;
    if (!app.currentWave) return;

    const results = app.currentWave.results;

    if (format === 'csv') {
        exportToCSV(results);
    } else if (format === 'pdf') {
        exportToPDF(results);
    }
}

function exportToCSV(results) {
    let csv = 'Property,Value,Unit\\n';
    results.forEach(([name, value, unit]) => {
        csv += `"${name}",${value},"${unit}"\\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'wave_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function exportToPDF(results) {
    // Simple PDF export using browser print
    const printWindow = window.open('', '_blank');

    let html = `
        <html>
        <head>
            <title>Wave Calculator Results</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2E86AB; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Wave Calculator Results</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr><th>Property</th><th>Value</th><th>Unit</th></tr>
                </thead>
                <tbody>
    `;

    results.forEach(([name, value, unit]) => {
        html += `<tr><td>${name}</td><td>${value.toFixed(6)}</td><td>${unit}</td></tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.waveApp = new EnhancedWaveApp();
});