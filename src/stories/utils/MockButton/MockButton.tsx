import { Tooltip } from '../../../components/Tooltip/Tooltip.tsx';
import type {
  TooltipAlignmentType,
  TooltipPositionType,
} from '../../../components/Tooltip/Tooltip.types.ts';
import { type ReactNode, useRef } from 'react';
import styles from './MockButton.module.css';
import { Loader } from '../../../components/Loader/Loader.tsx';

interface MockButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipAlignment?: TooltipAlignmentType;
}

export const MockButton = ({
  children,
  isLoading = false,
  tooltipText,
  tooltipPosition,
  tooltipAlignment,
}: MockButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button className={styles.mockButton} ref={ref}>
      {isLoading && <Loader testId="miniLoader" />}
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
