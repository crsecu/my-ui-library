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

  function handleHover() {
    // Find viewport dimensions
    const viewportHeight = window.document.documentElement.clientHeight;
    const viewportWidth = window.document.documentElement.clientWidth;

    // Determine the available space between anchor and viewport
    const anchorEl = document.querySelector('button');

    const {
      top,
      left,
      bottom,
      right,
      width: anchorWidth,
      height: anchorHeight,
    } = anchorEl?.getBoundingClientRect() ?? {};

    const topSpaceAvailable = top;
    const leftSpaceAvailable = left;
    const rightSpaceAvailable =
      right !== undefined ? viewportWidth - right : undefined;
    const bottomSpaceAvailable =
      bottom !== undefined ? viewportHeight - bottom : undefined;

    // Find out Tooltip dimensions
    console.log(
      `viewportHeight: ${viewportHeight}, viewportWidth: ${viewportWidth}`,
      rightSpaceAvailable,
      bottomSpaceAvailable,
    );

    setIsVisible(true);
  }

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsVisible(false);
        }
      }}
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
