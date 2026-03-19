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
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  testId?: string;
  tooltipText?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipAlignment?: TooltipAlignmentType;
  ref?: RefObject<HTMLButtonElement | null>;
}

/**
 * A versatile button component that supports loading states, icons and an automated tooltip system.
 * @param children - The text (label) to be displayed inside the button.
 * @param type - The standard HTML button type (e.g., 'button', 'submit', 'reset'). Defaults to 'button'.
 * @param icon - An optional icon shown next to the text.
 * @param variant - The visual style of the button (e.g., 'solid', 'outlined'). Defaults to 'solid'.
 * @param intent - The semantic meaning/color of the button (e.g., 'primary', 'success'). Defaults to 'primary'.
 * @param className - Additional CSS classes to apply custom styling to the button element.
 * @param isLoading - If true, shows a loading spinner and disables interaction.
 * @param disabled - Standard HTML disabled attribute to prevent user interaction.
 * @param ref  - An optional ref object passed from a parent to access the underlying button element.
 * @param testId - A unique string used to target the component in automated tests (data-testid).
 * @param tooltipText - The text content to display within the associated Tooltip.
 * @param tooltipPosition - The vertical/horizontal placement of the tooltip relative to the button. Defaults to 'top'.
 * @param tooltipAlignment - Defines how the tooltip edges line up with the button. Defaults to 'center'.
 * @param props - Remaining standard HTML button attributes (e.g., onClick, onMouseEnter)
 */
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
          {isLoading && <Loader testId="miniLoader"/>}

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
