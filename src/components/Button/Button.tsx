/* TO DO
1. Create Button component
2. Create interface ButtonProps and type all props
3. Destructure props one by one as you develop the component
4. Create and configure stories
*/

import { useRef, type ComponentPropsWithRef, type ReactNode, type RefObject } from 'react';
import styles from './Button.module.css';
import { Tooltip } from '../Tooltip/Tooltip';
import type { TooltipAlignType, TooltipPositionType } from '../Tooltip/tooltip.types';

interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'ref'> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary'; //defaults to primary for now;
  //optional; allows for custom styling via className prop
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  testId?: string;
  //event handlers; should these be optional?
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipJustify?: TooltipAlignType;
  ref?: RefObject<HTMLButtonElement | null>;
}

export const Button = ({
  children,
  type = 'button',
  icon,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  ref,
  testId,
  tooltipText,
  tooltipPosition = 'top',
  tooltipJustify = 'center',
  ...props
}: ButtonProps) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const activeButtonRef = ref ?? internalRef;

  return (
    <>
      <button
        type={type}
        disabled={disabled || isLoading}
        className={`${styles.button} ${styles[variant]} ${className}`}
        ref={activeButtonRef}
        data-testid={testId}
        {...props}
      >
        <>
          {isLoading && (
            <div className="loader" data-testid="loader">
              Loading...
            </div>
          )}

          {children}
          {icon}
        </>
      </button>
      {tooltipText && (
        <Tooltip content={tooltipText} anchorRef={activeButtonRef} position={tooltipPosition} align={tooltipJustify} />
      )}
    </>
  );
};
