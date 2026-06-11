import styles from './Select.module.css';
import type { MouseEventHandler } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectOptionProps extends Option {
  disabled?: boolean;
  key: number;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
}

export const SelectOption = ({
  value,
  label,
  onClick,
  isSelected,
  ...props
}: SelectOptionProps) => {
  return (
    <div
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      tabIndex={0}
    >
      {label}
    </div>
  );
};
