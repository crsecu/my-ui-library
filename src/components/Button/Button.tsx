import { useRef,  type ReactNode, type RefObject, type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import { Tooltip } from '../Tooltip/Tooltip';
import type { TooltipAlignmentType, TooltipPositionType } from '../Tooltip/tooltip.types';
import type { ButtonIntent, ButtonVariant } from './button.types';
import { Loader } from '../Loader/Loader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  //optional; allows for custom styling via className prop
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  testId?: string;
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipAlignment?: TooltipAlignmentType;
  ref?: RefObject<HTMLButtonElement | null>;
}

export const Button = ({
  children,
  type = 'button',
  icon,
  variant = 'solid',
  intent = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  ref,
  testId,
  tooltipText,
  tooltipPosition,
  tooltipAlignment,
  ...props
}: ButtonProps) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const activeButtonRef = ref ?? internalRef;

  return (
    <>
      <button
        type={type}
        disabled={disabled || isLoading}
        className={`${styles.button} ${styles[variant]} ${styles[intent]}${className}`}
        ref={activeButtonRef}
        data-testid={testId}
        {...props}
      >
        <>
          {isLoading && <Loader />}

          {children}
          {icon}
        </>
      </button>
      {tooltipText && (
        <Tooltip
          content={tooltipText}
          anchorRef={activeButtonRef}
          position={tooltipPosition}
          align={tooltipAlignment}
        />
      )}
    </>
  );
};
