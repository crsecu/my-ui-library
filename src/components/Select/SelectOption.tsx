import styles from './Select.module.css';
import type { MouseEventHandler, RefObject } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectOptionProps extends Option {
  disabled?: boolean;
  key: number;
  onClick: MouseEventHandler<HTMLLIElement>;
  onMouseEnter?: MouseEventHandler<HTMLLIElement>;
  isSelected: boolean;
  ref?: React.Ref<HTMLLIElement>;
}

export const SelectOption = ({
  value,
  label,
  onClick,
  isSelected,
  ref,
  ...props
}: SelectOptionProps) => {
  return (
    <li
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      tabIndex={-1}
      ref={ref}
    >
      {label}
    </li>
  );
};
