import styles from '../SelectOption/SelectOption.module.css';
import type { MouseEventHandler } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectOptionProps extends Option {
  disabled?: boolean;
  key: string;
  id: string;
  onClick: MouseEventHandler<HTMLLIElement>;
  isSelected: boolean;
  ref?: React.Ref<HTMLLIElement>;
  isFocused?: boolean;
}

export const SelectOption = ({
  label,
  onClick,
  isSelected,
  ref,
  id,
  isFocused,
}: SelectOptionProps) => {
  return (
    <li
      className={`${styles.option} ${isSelected ? styles.selected : ''} ${isFocused ? styles.testFocus : ''}`}
      onClick={onClick}
      tabIndex={-1}
      ref={ref}
      id={id}
      role="option"
      aria-selected={isSelected}
    >
      {label}
    </li>
  );
};
