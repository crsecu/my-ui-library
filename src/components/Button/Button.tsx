/* TO DO
1. Create Button component
2. Create interface ButtonProps and type all props
3. Destructure props one by one as you develop the component
4. Create and configure stories
*/

import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  //is ReactNode the correct type for children? ReactElement | 'string' may be better type choice
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary'; //optional; if no value passed, button defaults to regular styling
  //optional; allows for custom styling via className prop
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  testId?: string;
  //event handlers; should these be optional?
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  //React doesn't have a built-in onHover event, so this would need to be handled via onMouseEnter and onMouseLeave
  onHover?: () => void;
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
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${styles.button} ${styles[variant]} ${className}`}
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
  );
};
