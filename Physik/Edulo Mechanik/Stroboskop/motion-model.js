/* Analytical screen coordinates: x rightwards, y downwards; seconds and radians. */
const MotionModel = (() => {
  const configurations = {
    ball: { width:1000, height:700, duration:1.44, dt:0.04, objectWidth:44, restitution:0.8, impactTime:0.8 },
    uniform: { width:1000, height:250, duration:1, dt:0.2, objectWidth:135 },
    accelerated: { width:1000, height:250, duration:1, dt:0.2, objectWidth:165 }
  };

  function config(kind) {
    if (!Object.prototype.hasOwnProperty.call(configurations, kind)) throw new RangeError('Unknown motion: ' + kind);
    return { ...configurations[kind] };
  }

  function sample(kind, time) {
    const c = config(kind);
    if (!Number.isFinite(time)) throw new RangeError('Time must be finite.');
    const t = Math.max(0, Math.min(c.duration, time));
    if (kind === 'ball') {
      // At the intermediate contact use the outgoing right-hand velocity.
      // The terminal contact is an arrival sample (vy=+1440); no third flight
      // is simulated. A smooth floor leaves vx unchanged and scales vy by -e.
      const secondFlight = t >= c.impactTime;
      const u = secondFlight ? t-c.impactTime : t;
      const launchVy = secondFlight ? -1800*c.restitution : -1800;
      const terminal = t === c.duration;
      return { t, x:140+450*t, y:terminal?620:620+launchVy*u+2250*u*u, vx:450, vy:terminal?1440:launchVy+4500*u, rotation:4*t };
    }
    if (kind === 'uniform') return { t, x:90+820*t, y:155, vx:820, vy:0, rotation:0 };
    return { t, x:90+300*t+520*t*t, y:155, vx:300+1040*t, vy:0, rotation:0 };
  }

  function samples(kind) {
    const c = config(kind), count = Math.round(c.duration / c.dt);
    return Array.from({ length:count+1 }, (_, i) => sample(kind, i === count ? c.duration : Number((i*c.dt).toFixed(12))));
  }

  function ghosts(kind, time) {
    const current = sample(kind, time);
    const visible = samples(kind).filter(s => s.t <= current.t + 1e-12);
    return visible.map((s, i) => ({ ...s, opacity:Math.max(0.16, 0.92 * Math.pow(kind==='ball'?0.96:0.84, visible.length-1-i)) }));
  }

  function blurVector(kind, time, exposure = 0.005) {
    if (!Number.isFinite(exposure) || exposure < 0) throw new RangeError('Exposure must be finite and nonnegative.');
    const { vx, vy } = sample(kind, time);
    return { dx:-vx*exposure, dy:-vy*exposure };
  }

  return { config, sample, samples, ghosts, blurVector };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = MotionModel;
