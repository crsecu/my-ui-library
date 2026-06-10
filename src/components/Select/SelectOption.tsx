import styles from './Select.module.css';
import type { MouseEventHandler } from 'react';

export interface Option {
  value: string;
  label: string;
}
export interface SelectOptionProps {
  option: Option;
  disabled?: boolean;
  key: number;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
}

export const SelectOption = ({ option, onClick, isSelected, ...props }: SelectOptionProps) => {
  return (
    <div className={`${styles.option} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
      {option.label}
    </div>
  );
};
