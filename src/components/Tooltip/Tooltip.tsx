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

/**
 * A floating bubble that displays contextual information when a user hovers over or focuses on a 'trigger' element (e.g. button).
 * Renders via a React Portal to ensure it appears above all other UI layers.
 * @param content - The text message shown inside the tooltip.
 * @param position - Sets which side of the anchor the tooltip sits on. Defaults to 'top'.
 * @param align - Defines how the tooltip edges line up with the anchor. Defaults to 'center'.
 * @param anchorRef - The reference to the UI element the tooltip is attached to.
 */
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
