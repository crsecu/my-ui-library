import { useRef, type RefObject } from 'react';
import styles from './Tooltip.module.css';
import { createPortal } from 'react-dom';
import { useTooltip } from './Tooltip.hooks';
import type { TooltipAlignmentType, TooltipPositionType } from './tooltip.types';

interface TooltipProps {
  content: string;
  position?: TooltipPositionType;
  align?: TooltipAlignmentType;
  anchorRef: RefObject<HTMLElement | null>;
}

export const Tooltip = ({ content, position, align, anchorRef }: TooltipProps) => {
  const tooltipRef = useRef<HTMLParagraphElement>(null);

  const { isVisible, tooltipStyles } = useTooltip({
    anchorRef,
    tooltipRef,
    selectedPosition: position,
    selectedAlign: align,
  });

  if (!isVisible) return null;

  return createPortal(
    <p className={styles.tooltip} ref={tooltipRef} style={tooltipStyles}>
      {content}
    </p>,
    document.body,
  );
};
