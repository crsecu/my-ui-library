import { type Option, SelectOption } from './SelectOption.tsx';
import { useState, type MouseEvent } from 'react';
import styles from './Select.module.css';

type SelectProps = {
  id: string;
  placeholder?: string;
  options: Option[];
  onChange?: (value: string) => void;
};

export const Select = ({ options, id, ...props }: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | string>(null);

  const toggleMenuVisibility = () => {
    setShowMenu(!showMenu);
  };

  const handleSelectedOption = (e: React.MouseEvent<HTMLDivElement>, optionValue: string) => {
    console.log(e, optionValue);
    setSelectedOption(optionValue);
    setShowMenu(false);
  };

  const closeMenu = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedOption(null);
  };

  return (
    <div className={styles.selectContainer}>
      <p className={styles.valueDisplay} onClick={toggleMenuVisibility}>
        {selectedOption ? selectedOption : 'Animals'}
        {selectedOption && <span onClick={closeMenu}>x</span>}
      </p>
      {showMenu && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <SelectOption
              option={option}
              key={index}
              onClick={(e) => handleSelectedOption(e, option.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
