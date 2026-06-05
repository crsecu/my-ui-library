import { type Option, SelectOption } from './SelectOption.tsx';
import { useState, type MouseEvent } from 'react';
import styles from './Select.module.css';

type SelectProps = {
  id: string;
  placeholder: string;
  options: Option[];
  onChange?: (value: string) => void;
  searchable?: boolean;
};

export const Select = ({ id, options, placeholder, searchable, ...props }: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | string>(null);
  const [searchValue, setSearchValue] = useState('');

  const toggleMenuVisibility = () => {
    setShowMenu(!showMenu);
  };

  const handleSelectedOption = (e: React.MouseEvent<HTMLDivElement>, optionValue: string) => {
    console.log(e, optionValue);
    setSelectedOption(optionValue);
    setShowMenu(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const closeMenu = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedOption(null);
  };

  return (
    <div className={styles.selectContainer}>
      <div className={styles.valueContainer}>
        {searchable ? (
          <input value={searchValue} onClick={toggleMenuVisibility} onChange={handleSearch} />
        ) : (
          <div className={styles.valueDisplay} onClick={toggleMenuVisibility}>
            {selectedOption ? selectedOption : placeholder}
            {selectedOption && <span onClick={closeMenu}>x</span>}
          </div>
        )}
      </div>

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
