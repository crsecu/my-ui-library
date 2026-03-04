import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import styles from './Tooltip.module.css';
import { createPortal } from 'react-dom';
import { useTooltip } from './Tooltip.hooks';
import type { TooltipAlignType, TooltipPositionType } from './tooltip.types';

interface TooltipProps {
  content?: string;
  position?: TooltipPositionType;
  align?: TooltipAlignType;
  anchorRef?: RefObject<HTMLElement | null>;

  //FOR DEVELOPMENT ONLY: forces the tooltip to stay open regardless of focus state
  forceOpen?: boolean;
}

export const Tooltip = ({ content, position, align, anchorRef, forceOpen = true }: TooltipProps) => {
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
