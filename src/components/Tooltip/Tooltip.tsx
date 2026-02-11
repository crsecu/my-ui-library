import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';

  //FOR DEVELOPMENT ONLY: forces the tooltip to stay open regardless of focus state
  forceOpen?: boolean;
}

export const Tooltip = ({
  children,
  content,
  position = 'top',
  align = 'center',
  forceOpen = false,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const shouldShowTooltip = isVisible || forceOpen;

  if (!content) return children;

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {shouldShowTooltip && (
        <p className={`${styles.tooltip} ${styles[position]} ${styles[align]}`}>
          {content}
        </p>
      )}

      {children}
    </div>
  );
};
