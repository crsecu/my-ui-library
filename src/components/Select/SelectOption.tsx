import styles from './Select.module.css';
import type { MouseEventHandler } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectOptionProps extends Option {
  disabled?: boolean;
  key: number;
  onClick: MouseEventHandler<HTMLLIElement>;
  isSelected: boolean;
  ref?: React.Ref<HTMLLIElement>;
}

export const SelectOption = ({ label, onClick, isSelected, ref }: SelectOptionProps) => {
  return (
    <li
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      tabIndex={-1}
      ref={ref}
      role="option"
      aria-selected={isSelected}
    >
      {label}
    </li>
  );
};
