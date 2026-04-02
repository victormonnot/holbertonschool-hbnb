import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function BlurText({
  text,
  className = '',
  delay = 0,
  animateBy = 'words',
  direction = 'bottom',
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const segments =
    animateBy === 'words' ? text.split(' ') : text.split('');

  const yFrom = direction === 'bottom' ? 20 : -20;

  return (
    <span
      ref={ref}
      style={{ display: 'flex', flexWrap: 'wrap' }}
      className={className}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: yFrom }}
          animate={
            inView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: yFrom }
          }
          transition={{
            duration: 0.4,
            delay: delay + i * 0.08,
            ease: 'easeOut',
          }}
          style={{
            display: 'inline-block',
            willChange: 'filter, opacity, transform',
          }}
        >
          {segment}
          {animateBy === 'words' && i < segments.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}
