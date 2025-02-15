import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import './Vortex.css';

const Vortex = (props) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const particleCount = props.particleCount || 1000;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 500;
  const baseTTL = 5;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 2;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;

  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  let center = [0, 0];

  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  const setup = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        resize(canvas, ctx);
        initParticles();
        draw(canvas, ctx);
      }
    }
  };

  const initParticles = () => {
    tick = 0;
    particleProps = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let x = rand(canvas.width);
    let y = center[1] + randRange(rangeY);
    let ttl = baseTTL + rand(rangeTTL);
    let speed = baseSpeed + rand(rangeSpeed);
    let radius = baseRadius + rand(rangeRadius);
    let hue = baseHue + rand(rangeHue);
    particleProps.set([x, y, 0, 0, 0, ttl, speed, radius, hue], i);
  };

  const draw = (canvas, ctx) => {
    tick++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles(ctx);
    window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const drawParticles = (ctx) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i, ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let [x, y, vx, vy, life, ttl, speed, radius, hue] = particleProps.slice(
      i,
      i + particlePropCount
    );
    let n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * Math.PI * 2;
    vx = lerp(vx, Math.cos(n), 0.5);
    vy = lerp(vy, Math.sin(n), 0.5);
    let x2 = x + vx * speed;
    let y2 = y + vy * speed;
    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);
    life++;
    particleProps.set([x2, y2, vx, vy, life], i);
    if (
      x2 > canvas.width ||
      x2 < 0 ||
      y2 > canvas.height ||
      y2 < 0 ||
      life > ttl
    ) {
      initParticle(i);
    }
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();

    // Add glow effect
    ctx.shadowBlur = radius * 2;
    ctx.shadowColor = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;

    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  const resize = (canvas, ctx) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center = [canvas.width / 2, canvas.height / 2];
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) resize(canvas, ctx);
    });
  }, []);

  return (
    <div className="vortex-outer">
      <div
        ref={containerRef}
        className="vortex-container"
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default Vortex;
