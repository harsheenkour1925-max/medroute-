
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  value: string;
  className?: string;
}

const AnimatedCounter: React.FC<Props> = ({ value, className }) => {
  const [count, setCount] = useState(0);
  const targetStr = value.replace(/[^0-9]/g, '');
  const target = parseInt(targetStr);
  const isCurrency = value.includes('₹');
  const hasPlus = value.includes('+');
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2500; // Complete in ~2.5 seconds as requested (max 3)

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smoother finish
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(Math.floor(easeOutQuad(progress) * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, target]);

  const formatted = count.toLocaleString('en-IN');

  return (
    <div 
      ref={countRef} 
      className={`${className} transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
    >
      {isCurrency ? '₹' : ''}
      {formatted}
      {hasPlus ? '+' : ''}
    </div>
  );
};

export default AnimatedCounter;
