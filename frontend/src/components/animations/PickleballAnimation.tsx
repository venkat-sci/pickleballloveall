import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const PickleballAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastBounceTime = useRef<number>(Date.now());
  const lastScrollY = useRef<number>(0);
  const lastScrollBounceTime = useRef<number>(0);

  const [ball, setBall] = useState<Ball>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
    y: 200,
    vx: 4,
    vy: -2,
    radius: 12,
  });

  const { scrollYProgress } = useScroll();

  // Create smooth scroll-based transforms with reduced movement
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const springY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create bounce sound
    const playBounceSound = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create a bounce sound (quick pop)
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          150,
          audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch {
        // Fallback: silent operation if audio context fails
        console.log("Audio context not available");
      }
    };

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const gravity = 0.18;
    const friction = 0.997; // Slightly more friction for realism
    const bounceDecay = 0.88; // More realistic bounce decay
    const sideBouncePower = 1.05; // Reduced side bounce power

    const animate = () => {
      setBall((prevBall) => {
        const newBall = { ...prevBall };

        // Apply gravity
        newBall.vy += gravity;

        // Apply friction
        newBall.vx *= friction;
        newBall.vy *= friction;

        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Top and bottom boundary collisions with realistic energy
        if (newBall.y + newBall.radius > containerHeight - 50) {
          newBall.y = containerHeight - 50 - newBall.radius;
          newBall.vy *= -bounceDecay;
          newBall.vx *= 0.95; // Normal rolling friction
          // Add small energy boost only if very slow
          if (Math.abs(newBall.vy) < 1) {
            newBall.vy = -1.5;
          }
        }
        if (newBall.y - newBall.radius < 50) {
          newBall.y = 50 + newBall.radius;
          newBall.vy *= -bounceDecay;
          // Add small energy boost only if very slow
          if (Math.abs(newBall.vy) < 1) {
            newBall.vy = 1.5;
          }
        }

        // Left side collision
        if (newBall.x - newBall.radius <= 0) {
          newBall.x = newBall.radius;
          newBall.vx = Math.abs(newBall.vx) * sideBouncePower; // Bounce to the right
          newBall.vy += (Math.random() - 0.5) * 2; // Add some random vertical variation
          playBounceSound();
        }

        // Right side collision
        if (newBall.x + newBall.radius >= containerWidth) {
          newBall.x = containerWidth - newBall.radius;
          newBall.vx = -Math.abs(newBall.vx) * sideBouncePower; // Bounce to the left
          newBall.vy += (Math.random() - 0.5) * 2; // Add some random vertical variation
          playBounceSound();
        }

        // Ensure minimum speed to keep the ball moving but realistic
        const minSpeed = 2;
        const minVerticalSpeed = 0.5;

        if (Math.abs(newBall.vx) < minSpeed) {
          newBall.vx = newBall.vx > 0 ? minSpeed : -minSpeed;
        }

        // Ensure some vertical movement for visible bouncing (reduced)
        if (
          Math.abs(newBall.vy) < minVerticalSpeed &&
          Math.abs(newBall.vy) > 0.1
        ) {
          newBall.vy = newBall.vy > 0 ? minVerticalSpeed : -minVerticalSpeed;
        }

        // Add very gentle energy boost to maintain bouncing (reduced)
        if (Math.abs(newBall.vx) < 2.5 && Math.abs(newBall.vy) < 1) {
          newBall.vx *= 1.02; // Very small horizontal boost
          newBall.vy += newBall.vy > 0 ? 0.3 : -0.3; // Very small vertical boost
        }

        // Force bounce every 8 seconds for continuous movement (more realistic timing)
        const currentTime = Date.now();
        if (currentTime - lastBounceTime.current > 8000) {
          // Add gentle energy boost to keep animation alive
          const boostPower = 2; // Reduced boost power
          newBall.vx += newBall.vx > 0 ? boostPower : -boostPower;
          newBall.vy += -1.5 + (Math.random() - 0.5) * 2; // Gentle upward boost

          // Play bounce sound for the forced boost
          playBounceSound();

          // Update the last bounce time
          lastBounceTime.current = currentTime;
        }

        // Scroll-triggered bounce
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        const scrollTime = Date.now();

        // Trigger bounce if user scrolled more than 25px and it's been at least 200ms since last scroll bounce
        if (
          scrollDelta > 25 &&
          scrollTime - lastScrollBounceTime.current > 200
        ) {
          const scrollBoostPower = Math.min(scrollDelta / 25, 4); // Reduced max boost power

          // Add moderate horizontal boost in current direction
          newBall.vx += newBall.vx > 0 ? scrollBoostPower : -scrollBoostPower;

          // Add moderate vertical boost - always upward but realistic
          newBall.vy +=
            -Math.abs(scrollBoostPower * 1.2) + (Math.random() - 0.5) * 2;

          // Play bounce sound for scroll boost
          playBounceSound();

          // Reset tracking to allow for next scroll bounce
          lastScrollBounceTime.current = scrollTime;
        }

        // Always update scroll position for continuous tracking
        lastScrollY.current = currentScrollY;

        return newBall;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      setBall((prev) => ({
        ...prev,
        x: Math.min(prev.x, window.innerWidth - prev.radius),
      }));
    };

    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [ball.x, ball.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {/* Background gradient with Love All theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20" />

      {/* Court lines */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Center line */}
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
          {/* Side lines */}
          <line
            x1="5%"
            y1="20%"
            x2="5%"
            y2="80%"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line
            x1="95%"
            y1="20%"
            x2="95%"
            y2="80%"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Animation container */}
      <motion.div
        ref={containerRef}
        className="relative w-full h-full"
        style={{
          y: springY,
        }}
      >
        {/* Enhanced Ball */}
        <motion.div
          className="fixed w-10 h-10 z-20"
          style={{
            left: ball.x - 20,
            top: ball.y - 20,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Ball shadow */}
          <div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/20 rounded-full blur-sm transition-all duration-100"
            style={{
              width: `${Math.max(8, 20 - ball.y / 40)}px`,
              height: `${Math.max(4, 10 - ball.y / 80)}px`,
              opacity: Math.max(0.1, 0.4 - ball.y / 1000),
            }}
          />

          {/* Ball body with enhanced design */}
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-lg border-2 border-yellow-300 relative overflow-hidden">
            {/* Pickleball hole pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-5 gap-0.5">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-yellow-700/60 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Ball highlight */}
            <div className="absolute top-1 left-1 w-4 h-4 bg-white/60 rounded-full blur-sm" />

            {/* Speed trail effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full"
              style={{
                transform: `scaleX(${Math.abs(ball.vx) / 10})`,
                opacity: Math.min(0.8, Math.abs(ball.vx) / 15),
              }}
            />
          </div>
        </motion.div>

        {/* Floating particles across the width */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed"
            style={{
              left: `${(i + 1) * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              zIndex: 1,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.5, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          >
            {/* Alternating hearts and dots */}
            {i % 3 === 0 ? (
              <div className="w-3 h-3 text-pink-400/30 text-sm">♥</div>
            ) : (
              <div className="w-1.5 h-1.5 bg-green-400/20 rounded-full" />
            )}
          </motion.div>
        ))}

        {/* Ball trail effect */}
        <motion.div
          className="fixed w-2 h-2 bg-yellow-400/40 rounded-full blur-sm"
          style={{
            left: ball.x - 4,
            top: ball.y - 4,
            zIndex: 15,
          }}
          animate={{
            opacity: [0.6, 0, 0.6],
            scale: [1, 3, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};
