import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import styles from './Tooltip.module.css';
import { createPortal } from 'react-dom';

type TooltipPositionType = {
  top: number | undefined;
  left: number | undefined;
};

type TooltipDimensions = {
  width: number;
  height: number;
};

interface TooltipProps {
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  anchorRef?: RefObject<HTMLElement | null>;

  //FOR DEVELOPMENT ONLY: forces the tooltip to stay open regardless of focus state
  forceOpen?: boolean;
}

const tooltipInitialStyles = {
  top: undefined,
  left: undefined,
};

export const Tooltip = ({
  content,
  position = 'top',
  align = 'center',
  anchorRef,
  forceOpen = true,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLParagraphElement>(null);
  const tooltipDimensions = useRef<TooltipDimensions>({ height: 0, width: 0 });
  const tooltipRect = useRef<DOMRect>(null);

  const [tooltipXY, setTooltipXY] =
    useState<TooltipPositionType>(tooltipInitialStyles);

  // Find Tooltip dimensions
  useLayoutEffect(() => {
    if (tooltipRef.current !== null) {
      const tooltipRectData = tooltipRef.current.getBoundingClientRect();
      tooltipRect.current = tooltipRectData;

      tooltipDimensions.current = {
        width: tooltipRectData.width,
        height: tooltipRectData.height,
      };
    }
  }, []);

  function handleHover() {
    // Find viewport dimensions
    const vh = window.document.documentElement.clientHeight;
    const vw = window.document.documentElement.clientWidth;

    if (!anchorRef?.current) return;
    if (!tooltipRect?.current) return;

    //Find Anchor Positioning
    const anchorRect = anchorRef?.current.getBoundingClientRect();

    // tooltip height + 6px offset
    const tooltipRequiredVerticalSpace = tooltipDimensions.current.height + 6;
    const tooltipRequiredHorizontalSpace = tooltipDimensions.current.width + 6;

    /**** check if tooltip fits above anchor ****/
    if (anchorRect.top - tooltipRequiredVerticalSpace > 0) {
      //place above anchor code
      setTooltipXY({
        ...tooltipXY,
        top: anchorRect.top - tooltipRequiredVerticalSpace,
      });
      console.log('ABOVE');
    } else if (vh - anchorRect.bottom > tooltipRequiredVerticalSpace) {
      //place below anchor code
      setTooltipXY({ ...tooltipXY, top: anchorRect.bottom + 6 });
      console.log('BELOW');
    } else if (anchorRect.right + tooltipRequiredHorizontalSpace < vw) {
      //place right of anchor
      setTooltipXY({
        ...tooltipInitialStyles,
        left: anchorRect.left + anchorRect.width + 6,
      });
      console.log('RIGHT', vw - anchorRect.right);
    } else {
      //place left of anchor
      //more code might be needed here to check if placement on right is possible
      setTooltipXY({
        ...tooltipInitialStyles,
        left: anchorRect.left - tooltipRequiredHorizontalSpace,
      });

      console.log('LEFT');
    }

    console.log(
      'anchor rect ',
      anchorRect,
      'tooltip rect ',
      tooltipRect.current,
      'caculated position ',
    );
  }

  return createPortal(
    <p
      className={`${styles.tooltip} ${styles[position]} ${styles[align]}`}
      onMouseEnter={handleHover}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          console.log('close tooltip');
        }
      }}
      ref={tooltipRef}
      style={tooltipXY}
    >
      {content}
    </p>,
    document.body,
  );
};
