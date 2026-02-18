import { useLayoutEffect, useRef } from 'react';
import styles from './Tooltip.module.css';
type TooltipDimensions = {
  width: number;
  height: number;
};

interface TooltipProps {
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';

  //FOR DEVELOPMENT ONLY: forces the tooltip to stay open regardless of focus state
  forceOpen?: boolean;
}

export const Tooltip = ({
  content,
  position = 'top',
  align = 'center',
  forceOpen = true,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLParagraphElement>(null);
  const tooltipDimensions = useRef<TooltipDimensions>(null);

  // Find Tooltip dimensions
  useLayoutEffect(() => {
    if (tooltipRef.current !== null) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();

      tooltipDimensions.current = {
        width,
        height,
      };
    }
  }, []);

  function handleHover() {
    // Find viewport dimensions
    const vh = window.document.documentElement.clientHeight;
    const vw = window.document.documentElement.clientWidth;

    console.log('viewport width', vw, 'viewport height', vh);
  }

  return (
    <p
      className={`${styles.tooltip} ${styles[position]} ${styles[align]}`}
      onMouseEnter={handleHover}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          console.log('close tooltip');
        }
      }}
      ref={tooltipRef}
    >
      {content}
    </p>
  );
};
