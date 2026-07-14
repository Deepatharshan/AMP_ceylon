'use client';

import { useScrollFade } from '@/hooks/useScrollFade';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollFadeWrapper({ children, className = '', delay = 0 }: Props) {
  const { ref, isVisible } = useScrollFade();

  return (
    <div 
      ref={ref} 
      className={`${className} fade-in ${delay > 0 ? `delay-${delay}` : ''} ${isVisible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
}
