/**
 * Application logic for Wave Calculator
 * Handles UI interactions and form processing
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waveForm');
    const resultsContainer = document.getElementById('results');
    const wavelengthCheckbox = document.getElementById('wavelengthCheckbox');
    const periodLabel = document.getElementById('periodLabel');

    // Toggle between period and wavelength input
    wavelengthCheckbox.addEventListener('change', function() {
        if (this.checked) {
            periodLabel.textContent = 'Wavelength (m)';
        } else {
            periodLabel.textContent = 'Wave Period (s)';
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        try {
            // Get form values
            const amplitude = parseFloat(document.getElementById('amplitude').value);
            const depth = parseFloat(document.getElementById('depth').value);
            const periodOrWavelength = parseFloat(document.getElementById('periodOrWavelength').value);
            const zDepth = parseFloat(document.getElementById('zDepth').value);
            const isWavelength = wavelengthCheckbox.checked;

            // Validate inputs
            if (isNaN(amplitude) || isNaN(depth) || isNaN(periodOrWavelength) || isNaN(zDepth)) {
                throw new Error('Please fill in all fields with valid numbers');
            }

            if (amplitude <= 0 || depth <= 0 || periodOrWavelength <= 0) {
                throw new Error('Amplitude, depth, and period/wavelength must be positive');
            }

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

            // Display results
            displayResults(wave.results);

            // Scroll to results
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            showError(error.message);
        }
    });

    function displayResults(results) {
        resultsContainer.innerHTML = '';

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group mb-2';

        results.forEach(result => {
            const [name, value, unit] = result;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center py-1 px-2';

            listItem.innerHTML = `
                ${name}: <span class="badge bg-light text-dark">
                    ${value.toFixed(2)} ${unit}
                </span>
            `;

            listGroup.appendChild(listItem);
        });

        resultsContainer.appendChild(listGroup);
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> ${message}
            </div>
        `;
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
    }
});