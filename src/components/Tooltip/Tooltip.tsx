import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children?: React.ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export const Tooltip = ({
  children,
  content,
  position = 'top',
  align = 'center',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {isVisible && (
        <p className={`${styles.tooltip} ${styles[position]} ${styles[align]}`}>
          {content}
        </p>
      )}

      {children}
    </div>
  );
};
