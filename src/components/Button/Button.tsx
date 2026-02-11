/* TO DO
1. Create Button component
2. Create interface ButtonProps and type all props
3. Destructure props one by one as you develop the component
4. Create and configure stories
*/

import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './Button.module.css';
import { Tooltip } from '../Tooltip/Tooltip';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  //is ReactNode the correct type for children? ReactElement | 'string' may be better type choice
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
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipJustify?: 'start' | 'center' | 'end';
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
  tooltipPosition,
  tooltipJustify,
  onFocus,
  ...props
}: ButtonProps) => {
  return (
    <Tooltip
      content={tooltipText}
      position={tooltipPosition}
      align={tooltipJustify}
      forceOpen={true}
    >
      <button
        type={type}
        disabled={disabled || isLoading}
        className={`${styles.button} ${styles[variant]} ${className}`}
        ref={ref}
        data-testid={testId}
        {...props}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            {children}
            {icon}
          </>
        )}
      </button>
    </Tooltip>
  );
};
