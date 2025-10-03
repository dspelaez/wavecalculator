/**
 * JONSWAP Spectrum Calculator - JavaScript implementation
 * Converted from Python Flask application
 *
 * Copyright © 2020 Daniel Santiago <http://github.com/dspelaez>
 * Distributed under terms of the GNU/GPL 3.0 license.
 */

class JonswapSpectrum {
    constructor(u10, F, gamma = 3.3, fmin = 0.01, fmax = 1, nfrqs = 256) {
        this.F = F;
        this.u10 = u10;
        this.gamma = gamma;
        this.fmin = fmin;
        this.fmax = fmax;
        this.nfrqs = nfrqs;
    }

    get frqs() {
        const result = [];
        const logMin = Math.log10(this.fmin);
        const logMax = Math.log10(this.fmax);
        const step = (logMax - logMin) / (this.nfrqs - 1);

        for (let i = 0; i < this.nfrqs; i++) {
            result.push(Math.pow(10, logMin + i * step));
        }
        return result;
    }

    get omega() {
        return this.frqs.map(f => TWO_PI * f);
    }

    _alpha() {
        return 0.076 * Math.pow(this.u10 * this.u10 / this.F / GRAVITY, 0.22);
    }

    _omegap() {
        return 22 * Math.pow(GRAVITY * GRAVITY / this.u10 / this.F, 1/3);
    }

    _fp() {
        return this._omegap() / TWO_PI;
    }

    _sigma() {
        const omegap = this._omegap();
        return this.omega.map(w => w <= omegap ? 0.07 : 0.09);
    }

    _rexp() {
        const omegap = this._omegap();
        const sigma = this._sigma();

        return this.omega.map((w, i) => {
            const diff = w - omegap;
            return Math.exp(-(diff * diff) / (2 * sigma[i] * sigma[i] * omegap * omegap));
        });
    }

    get S() {
        const alpha = this._alpha();
        const omegap = this._omegap();
        const rexp = this._rexp();

        return this.omega.map((w, i) => {
            const term1 = (alpha * GRAVITY * GRAVITY) / Math.pow(w, 5);
            const term2 = Math.exp(-1.25 * Math.pow(omegap / w, 4));
            const term3 = Math.pow(this.gamma, rexp[i]);

            return term1 * term2 * term3;
        });
    }

    get bulkParameters() {
        const S = this.S;
        const frqs = this.frqs;

        // Calculate significant wave height (Hs = 4 * sqrt(m0))
        let m0 = 0;
        for (let i = 1; i < frqs.length; i++) {
            const df = frqs[i] - frqs[i-1];
            m0 += S[i] * df;
        }
        const Hs = 4 * Math.sqrt(m0);

        // Peak frequency
        const maxIndex = S.indexOf(Math.max(...S));
        const Tp = 1 / frqs[maxIndex];

        // Mean frequency
        let m1 = 0;
        for (let i = 1; i < frqs.length; i++) {
            const df = frqs[i] - frqs[i-1];
            m1 += frqs[i] * S[i] * df;
        }
        const Tm = m0 / m1;

        return {
            Hs: Hs,
            Tp: Tp,
            Tm: Tm,
            fp: this._fp(),
            alpha: this._alpha()
        };
    }
}