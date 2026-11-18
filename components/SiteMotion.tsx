import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const REVEAL_SELECTOR = [
  ".studio-home > section > .studio-section-heading",
  ".work-tile",
  ".studio-home .studio-row",
  ".studio-page > header",
  ".studio-page > section",
  ".footer-wordmark",
].join(",");

function useScrollReveals() {
  const router = useRouter();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      reduceMotion.matches ||
      !("IntersectionObserver" in window) ||
      !("animate" in Element.prototype)
    ) {
      return;
    }

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    ).filter((element) => element.dataset.revealed !== "true");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset.revealDelay ?? 0);

          element.dataset.revealed = "true";
          element.animate(
            [
              { opacity: 0, transform: "translateY(22px) scale(0.99)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            {
              duration: 760,
              delay,
              easing: "cubic-bezier(0.19, 1, 0.22, 1)",
              fill: "both",
            }
          );
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [router.asPath]);
}

export default function SiteMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useScrollReveals();

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const precisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!canvas || reduceMotion.matches || !precisePointer.matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const spacing = 50;
    const influenceRadius = 170;
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      strength: 0,
      targetStrength: 0,
    };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let animating = false;

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const dark = isDark();
      const baseAlpha = dark ? 0.1 : 0.14;
      const color = dark ? "244, 244, 242" : "50, 50, 50";

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const deltaX = x - pointer.x;
          const deltaY = y - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);
          const proximity =
            distance < influenceRadius
              ? 1 - distance / influenceRadius
              : 0;
          const response = proximity * proximity * pointer.strength;
          const displacement = response * 14;
          const directionX = distance > 0 ? deltaX / distance : 0;
          const directionY = distance > 0 ? deltaY / distance : 0;
          const dotX = x + directionX * displacement;
          const dotY = y + directionY * displacement;
          const radius = 1 + response * 1.15;
          const alpha = baseAlpha + response * (dark ? 0.25 : 0.3);

          context.beginPath();
          context.arc(dotX, dotY, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${color}, ${alpha})`;
          context.fill();
        }
      }
    };

    const tick = () => {
      pointer.x += (pointer.targetX - pointer.x) * 0.14;
      pointer.y += (pointer.targetY - pointer.y) * 0.14;
      pointer.strength +=
        (pointer.targetStrength - pointer.strength) * 0.12;

      draw();

      const positionSettled =
        Math.abs(pointer.targetX - pointer.x) < 0.1 &&
        Math.abs(pointer.targetY - pointer.y) < 0.1;
      const strengthSettled =
        Math.abs(pointer.targetStrength - pointer.strength) < 0.005;

      if (positionSettled && strengthSettled) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.strength = pointer.targetStrength;
        draw();
        animating = false;
        return;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    const requestDraw = () => {
      if (animating) return;
      animating = true;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.targetStrength = 1;
      requestDraw();
    };

    const handlePointerLeave = () => {
      pointer.targetStrength = 0;
      requestDraw();
    };

    const themeObserver = new MutationObserver(() => draw());

    document.documentElement.classList.add("has-interactive-dots");
    canvas.dataset.active = "true";
    resize();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
      themeObserver.disconnect();
      document.documentElement.classList.remove("has-interactive-dots");
      delete canvas.dataset.active;
    };
  }, []);

  return <canvas ref={canvasRef} className="site-dots-canvas" aria-hidden="true" />;
}
