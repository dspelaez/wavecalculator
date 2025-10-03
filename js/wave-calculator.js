/**
 * Wave Calculator - JavaScript implementation
 * Converted from Python Flask application
 *
 * Copyright © 2020 Daniel Santiago <http://github.com/dspelaez>
 * Distributed under terms of the GNU/GPL 3.0 license.
 */

const GRAVITY = 9.8;
const DENSITY = 1024;
const TWO_PI = 2 * Math.PI;

/**
 * Compute wavenumber according to Hunt approximation
 */
function computeWavenumber(omega, h, g = GRAVITY) {
    const d0 = [0.666, 0.355, 0.161, 0.0632, 0.0218, 0.0065];
    const y = (omega ** 2) * Math.abs(h) / g;

    let poly = 0;
    for (let n = 0; n < d0.length; n++) {
        poly += d0[n] * (y ** (n + 1));
    }

    return Math.sqrt(y ** 2 + y / (1 + poly)) / Math.abs(h);
}

/**
 * Compute angular frequency for a given depth
 */
function computeFrequency(k, h, g = GRAVITY) {
    return Math.sqrt(g * k * Math.tanh(k * Math.abs(h)));
}

/**
 * Compute depth from k,omega
 */
function computeDepth(omega, k, g = GRAVITY, fac = 0.9) {
    if (omega ** 2 / (g * k) >= fac) {
        return Infinity;
    } else {
        return (1 / k) * Math.atanh(omega ** 2 / (g * k));
    }
}

/**
 * Return Doppler modified wave frequency
 */
function computeIntrinsicFrequency(omega, k, U) {
    return omega - k * U;
}

/**
 * LinearWave class for calculating linear wave properties
 */
class LinearWave {
    constructor(f, h, a = 1, z = 0, U = 0) {
        this.amplitude = a;
        this.frequency = f;
        this.currentSpeed = U;
        this.waterDepth = Math.abs(h);
        this.zDepth = Math.abs(z) > Math.abs(h) ? -Math.abs(h) : -Math.abs(z);
    }

    static fromWavenumber(k, h, a = 1, z = 0, U = 0) {
        const f = computeFrequency(k, h, GRAVITY) / TWO_PI;
        return new LinearWave(f, h, a, z, U);
    }

    get period() {
        return 1 / this.frequency;
    }

    get angularFrequency() {
        return TWO_PI * this.frequency;
    }

    get wavenumber() {
        return computeWavenumber(this.angularFrequency, this.waterDepth, GRAVITY);
    }

    get intrinsicFrequency() {
        return computeIntrinsicFrequency(this.angularFrequency, this.wavenumber, this.currentSpeed);
    }

    get wavelength() {
        return TWO_PI / this.wavenumber;
    }

    get relativeDepth() {
        return this.waterDepth * this.wavenumber;
    }

    get phaseSpeed() {
        return this.intrinsicFrequency / this.wavenumber;
    }

    get groupSpeed() {
        const kh = this.relativeDepth;
        const tanhKh = Math.tanh(kh);
        return 0.5 * this.phaseSpeed * (1 + kh * (1 - tanhKh ** 2) / tanhKh);
    }

    get _coshkz() {
        return Math.cosh(this.wavenumber * (this.zDepth + this.waterDepth));
    }

    get _sinhkz() {
        return Math.sinh(this.wavenumber * (this.zDepth + this.waterDepth));
    }

    get _coshkh() {
        return Math.cosh(this.relativeDepth);
    }

    get _sinhkh() {
        return Math.sinh(this.relativeDepth);
    }

    get pressure() {
        return this.amplitude * this._coshkz / this._coshkh;
    }

    get horizontalVelocity() {
        return this.amplitude * this.intrinsicFrequency * this._coshkz / this._sinhkh;
    }

    get verticalVelocity() {
        return this.amplitude * this.intrinsicFrequency * this._sinhkz / this._sinhkh;
    }

    get stokesDrift() {
        const ak = this.amplitude * this.wavenumber;
        const cosh2kz = Math.cosh(2 * this.wavenumber * (this.zDepth + this.waterDepth));
        const sinhkh2 = Math.sinh(this.relativeDepth) ** 2;
        return 0.5 * this.phaseSpeed * (ak ** 2) * cosh2kz / sinhkh2;
    }

    get relativeVelocity() {
        return this.horizontalVelocity / this.phaseSpeed;
    }

    get waveEnergy() {
        return 0.5 * DENSITY * GRAVITY * this.amplitude ** 2;
    }

    get wavePower() {
        return this.waveEnergy * this.groupSpeed;
    }

    get waveAction() {
        return this.waveEnergy / this.angularFrequency;
    }

    get radiationStress() {
        return 2 * (this.groupSpeed / this.phaseSpeed - 0.5) * this.waveEnergy;
    }

    get results() {
        return [
            ["Amplitude", this.amplitude, "m"],
            ["Water depth", this.waterDepth, "m"],
            ["Distance from surface", this.zDepth, "m"],
            ["Wave period", this.period, "s"],
            ["Frequency", this.frequency, "Hz"],
            ["Angular frequency", this.angularFrequency, "rad/s"],
            ["Wavenumber", this.wavenumber, "rad/m"],
            ["Wavelength", this.wavelength, "m"],
            ["Phase speed", this.phaseSpeed, "m/s"],
            ["Group velocity", this.groupSpeed, "m/s"],
            ["Wave energy", this.waveEnergy, "J/m^2"],
            ["Wave power", this.wavePower, "W/m"],
            ["Wave action", this.waveAction, "Js/m^2"],
            ["Radiation stress", this.radiationStress, "N/m"],
            ["Dynamic pressure", this.pressure, "m"],
            ["Horizontal velocity", this.horizontalVelocity, "m/s"],
            ["Vertical velocity", this.verticalVelocity, "m/s"],
            ["Stokes' drift", this.stokesDrift, "m/s"],
            ["Relative depth", this.relativeDepth, ""],
            ["Relative velocity", this.relativeVelocity, ""]
        ];
    }
}
