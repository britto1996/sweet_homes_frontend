"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animated, to, useSpring } from "@react-spring/web";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  yPx?: number;
  threshold?: number;
};

export default function Reveal({
  children,
  className,
  delayMs = 0,
  once = true,
  yPx = 18,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const observerOptions = useMemo<IntersectionObserverInit>(
    () => ({ threshold }),
    [threshold]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, observerOptions);

    observer.observe(node);
    return () => observer.disconnect();
  }, [observerOptions, once]);

  const styles = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : yPx,
    scale: inView ? 1 : 0.98,
    config: { mass: 1.2, tension: 170, friction: 22 },
    delay: delayMs,
  });

  return (
    <animated.div
      ref={ref}
      className={className}
      style={{
        opacity: styles.opacity,
        transform: to([styles.y, styles.scale], (y, s) => `translate3d(0, ${y}px, 0) scale(${s})`),
        willChange: "transform, opacity",
      }}
    >
      {children}
    </animated.div>
  );
}
