import { Tooltip } from '../../../components/Tooltip/Tooltip.tsx';
import type { TooltipAlignmentType, TooltipPositionType } from '../../../components/Tooltip/tooltip.types.ts';
import { type ReactNode, useRef } from 'react';
import styles from './MockTooltipAnchor.module.css';

interface MockTooltipAnchorProps {
  children: ReactNode;
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipAlignment?: TooltipAlignmentType;

}

export const MockTooltipAnchor = ({ children, tooltipText, tooltipPosition, tooltipAlignment}: MockTooltipAnchorProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button className={styles.mockTooltipAnchor}  ref={ref}>
      {children}

      {tooltipText && (
        <Tooltip
          anchorRef={ref}
          content={tooltipText}
          position={tooltipPosition}
          align={tooltipAlignment}
        />
      )}
    </button>
  );
};