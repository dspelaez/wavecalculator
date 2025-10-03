# Wave Calculator

An advanced JavaScript-based wave calculator for computing linear wave properties, analysing wave spectra, and visualising wave dynamics. This tool provides comprehensive wave analysis capabilities with an intuitive web interface.

## Features

### Linear Wave Calculations
- **Comprehensive wave properties**: Calculate amplitude, wavelength, period, phase speed, group velocity, and more
- **Interactive controls**: Real-time sliders for all wave parameters
- **Flexible input modes**: Toggle between wave period and wavelength inputs
- **Depth-dependent calculations**: Analyse wave properties at different water depths

### Wave Spectrum Analysis
- **JONSWAP spectrum**: Generate realistic wind-wave spectra based on wind speed and fetch
- **Bulk parameters**: Automatically compute significant wave height (Hs), peak period (Tp), and mean period (Tm)
- **Interactive visualisation**: Linear-scale spectrum plots with real-time updates

### Advanced Visualisations
- **Wave profile animations**: Watch waves propagate in real-time
- **Velocity profiles**: Visualise how particle velocities change with depth
- **Dispersion relations**: Explore frequency-wavelength relationships
- **Particle motion**: Examine orbital trajectories at different depths

### User Experience
- **Tabbed interface**: Organised workflow from basic calculations to advanced analysis
- **Synchronised controls**: Parameter changes automatically update across all tabs
- **Export capabilities**: Download results as CSV or PDF
- **Responsive design**: Works seamlessly on desktop and mobile devices

## Live Demo

Visit the live application: [https://dspelaez.github.io/wavecalculator](https://dspelaez.github.io/wavecalculator)

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Visualisations**: Plotly.js
- **Icons**: Font Awesome 4.7
- **Hosting**: GitHub Pages (static site)

## Usage

### Basic Wave Calculations
1. Navigate to the **Linear Waves** tab
2. Adjust wave parameters using the interactive sliders:
   - Amplitude (0.1 - 5.0 m)
   - Water depth (1 - 200 m)
   - Wave period (1 - 20 s) or wavelength (10 - 500 m)
   - Distance from surface (0 - 100 m)
3. View categorised results including basic properties, velocities, energy, and dimensionless parameters

### Wave Profile Analysis
1. Switch to the **Wave Profile** tab
2. Adjust parameters to see real-time updates of:
   - Wave surface elevation
   - Velocity amplitude profiles with depth
3. Use the animation button to visualise wave propagation

### Advanced Analysis
1. Visit the **Advanced Analysis** tab for:
   - Wave dispersion curves
   - Particle motion trajectories at different depths
2. Explore how wave characteristics change with varying parameters

### Spectrum Analysis
1. Navigate to the **Wave Spectrum** tab
2. Set environmental conditions:
   - Wind speed U10 (5 - 30 m/s)
   - Fetch distance (10 - 1000 km)
3. View the generated JONSWAP spectrum and bulk wave parameters

## Wave Theory

This calculator implements linear wave theory (Airy theory) for surface gravity waves. Key equations include:

- **Dispersion relation**: ω² = gk tanh(kh)
- **Wave celerity**: C = ω/k
- **Group velocity**: Cg = ∂ω/∂k
- **JONSWAP spectrum**: Based on Hasselmann et al. (1973)

### Assumptions and Limitations
- Linear wave theory (small amplitude waves)
- Constant water depth
- No wave-current interaction
- Ideal fluid (inviscid, incompressible)

## References

1. Dean, R.G. & Dalrymple, R.A. (1991). *Water Wave Mechanics for Engineers and Scientists*
2. Hasselmann, K. et al. (1973). Measurements of wind-wave growth and swell decay during the Joint North Sea Wave Project (JONSWAP)
3. Hunt, J.N. (1979). Direct solution of wave dispersion equation


## Licence

Copyright © 2020 Daniel Peláez-Zapata

Distributed under the terms of the GNU/GPL 3.0 licence.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Contact

- **Author**: Daniel Peláez-Zapata
- **Website**: [https://dspelaez.github.io](https://dspelaez.github.io)
- **Repository**: [https://github.com/dspelaez/wavecalculator](https://github.com/dspelaez/wavecalculator)

---

*Made with ♥ using JavaScript, Bootstrap & Plotly.js*
