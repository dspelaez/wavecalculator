/**
 * Wave Visualization Functions
 * Interactive charts and animations for wave properties
 */

class WaveVisualizations {
    constructor() {
        this.animationId = null;
        this.isAnimating = false;
    }

    // Create wave profile plot
    plotWaveProfile(wave, containerId, animate = false) {
        const x = [];
        const y = [];
        const points = 200;
        const wavelength = wave.wavelength;

        for (let i = 0; i <= points; i++) {
            const xi = (i / points) * 2 * wavelength;
            x.push(xi);
            y.push(wave.amplitude * Math.sin(2 * Math.PI * xi / wavelength));
        }

        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            name: 'Wave Profile',
            line: {
                color: '#2E86AB',
                width: 3
            }
        };

        const layout = {
            title: 'Wave Profile',
            xaxis: {
                title: 'Distance (m)',
                showgrid: true
            },
            yaxis: {
                title: 'Elevation (m)',
                showgrid: true,
                zeroline: true
            },
            showlegend: false,
            responsive: true
        };

        Plotly.newPlot(containerId, [trace], layout);

        if (animate) {
            this.animateWaveProfile(wave, containerId);
        }
    }

    // Animate wave profile
    animateWaveProfile(wave, containerId) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        let time = 0;
        const dt = 0.1;
        const points = 200;
        const wavelength = wave.wavelength;

        const animate = () => {
            const x = [];
            const y = [];

            for (let i = 0; i <= points; i++) {
                const xi = (i / points) * 2 * wavelength;
                x.push(xi);
                y.push(wave.amplitude * Math.sin(2 * Math.PI * (xi / wavelength - time / wave.period)));
            }

            Plotly.restyle(containerId, {
                x: [x],
                y: [y]
            });

            time += dt;
            if (this.isAnimating) {
                this.animationId = requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Stop animation
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    // Plot velocity profile with depth
    plotVelocityProfile(wave, containerId) {
        const depths = [];
        const uAmplitudes = [];
        const wAmplitudes = [];
        const points = 50;

        for (let i = 0; i <= points; i++) {
            const z = -(i / points) * wave.waterDepth;
            depths.push(z);

            // Calculate velocity amplitudes at this depth
            const tempWave = new LinearWave(wave.frequency, wave.waterDepth, wave.amplitude, z);
            uAmplitudes.push(tempWave.horizontalVelocity);
            wAmplitudes.push(Math.abs(tempWave.verticalVelocity));
        }

        const trace1 = {
            x: uAmplitudes,
            y: depths,
            type: 'scatter',
            mode: 'lines',
            name: 'Horizontal Velocity',
            line: { color: '#2E86AB', width: 2 }
        };

        const trace2 = {
            x: wAmplitudes,
            y: depths,
            type: 'scatter',
            mode: 'lines',
            name: 'Vertical Velocity',
            line: { color: '#F24236', width: 2 }
        };

        const layout = {
            title: 'Velocity Amplitudes vs Depth',
            xaxis: {
                title: 'Velocity Amplitude (m/s)',
                showgrid: true
            },
            yaxis: {
                title: 'Depth (m)',
                showgrid: true,
                autorange: 'reversed',
                zeroline: true
            },
            showlegend: true,
            responsive: true
        };

        Plotly.newPlot(containerId, [trace1, trace2], layout);
    }

    // Plot JONSWAP spectrum
    plotJonswapSpectrum(spectrum, containerId) {
        const frqs = spectrum.frqs;
        const S = spectrum.S;

        const trace = {
            x: frqs,
            y: S,
            type: 'scatter',
            mode: 'lines',
            name: 'JONSWAP Spectrum',
            line: {
                color: '#6A994E',
                width: 2
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(106, 153, 78, 0.3)'
        };

        const layout = {
            title: 'JONSWAP Wave Spectrum',
            xaxis: {
                title: 'Frequency (Hz)',
                showgrid: true
            },
            yaxis: {
                title: 'Spectral Density (m²·s)',
                showgrid: true
            },
            showlegend: false,
            responsive: true
        };

        Plotly.newPlot(containerId, [trace], layout);
    }

    // Plot dispersion relation
    plotDispersionRelation(containerId, depth = 50) {
        const frequencies = [];
        const wavelengths = [];
        const points = 100;

        for (let i = 1; i <= points; i++) {
            const f = (i / points) * 0.5; // 0 to 0.5 Hz
            frequencies.push(f);

            const tempWave = new LinearWave(f, depth, 1, 0);
            wavelengths.push(tempWave.wavelength);
        }

        const trace = {
            x: frequencies,
            y: wavelengths,
            type: 'scatter',
            mode: 'lines',
            name: 'Dispersion Relation',
            line: {
                color: '#F18F01',
                width: 3
            }
        };

        const layout = {
            title: `Wave Dispersion Relation (h = ${depth} m)`,
            xaxis: {
                title: 'Frequency (Hz)',
                showgrid: true
            },
            yaxis: {
                title: 'Wavelength (m)',
                showgrid: true
            },
            showlegend: false,
            responsive: true
        };

        Plotly.newPlot(containerId, [trace], layout);
    }

    // Plot particle motion ellipses
    plotParticleMotion(wave, containerId) {
        const depths = [0, -wave.waterDepth * 0.25, -wave.waterDepth * 0.5, -wave.waterDepth * 0.75];
        const traces = [];

        depths.forEach((z, index) => {
            const tempWave = new LinearWave(wave.frequency, wave.waterDepth, wave.amplitude, z);
            const x = [];
            const y = [];
            const points = 50;

            for (let i = 0; i <= points; i++) {
                const t = (i / points) * wave.period;
                const xi = tempWave.horizontalVelocity * Math.sin(2 * Math.PI * t / wave.period) / (2 * Math.PI / wave.period);
                const yi = tempWave.verticalVelocity * Math.cos(2 * Math.PI * t / wave.period) / (2 * Math.PI / wave.period);
                x.push(xi);
                y.push(yi + z);
            }

            traces.push({
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                name: `Depth: ${Math.abs(z).toFixed(1)} m`,
                line: { width: 2 }
            });
        });

        const layout = {
            title: 'Particle Motion Trajectories',
            xaxis: {
                title: 'Horizontal Displacement (m)',
                showgrid: true
            },
            yaxis: {
                title: 'Vertical Position (m)',
                showgrid: true
            },
            showlegend: true,
            responsive: true
        };

        Plotly.newPlot(containerId, traces, layout);
    }
}