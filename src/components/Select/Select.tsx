import { type Option, SelectOption } from './SelectOption.tsx';
import { useState, type MouseEvent, useRef } from 'react';
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

  const searchInputRef = useRef(null);

  const toggleMenuVisibility = () => {
    setShowMenu(!showMenu);
  };

  const handleSelectedOption = (e: React.MouseEvent<HTMLDivElement>, optionValue: string) => {
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

  const filteredOptions = options.filter((option: Option) => option.value.includes(searchValue));
  const displayOptions = searchValue ? filteredOptions : options;

  const shouldDisplayInput = searchable && !selectedOption;

  console.log(filteredOptions);

  return (
    <div className={styles.selectContainer}>
      <div className={styles.valueContainer}>
        <div className={`${styles.valueDisplay}`} onClick={toggleMenuVisibility}>
          {selectedOption
            ? selectedOption
            : !shouldDisplayInput && <span className={styles.placeholder}>{placeholder}</span>}

          <input
            ref={searchInputRef}
            value={searchValue}
            onChange={handleSearch}
            onClick={toggleMenuVisibility}
            placeholder={!selectedOption ? placeholder : ''}
            style={{ width: shouldDisplayInput ? 'unset' : '0' }}
          />

          {selectedOption && (
            <span className={styles.closeBtn} onClick={closeMenu}>
              x
            </span>
          )}
        </div>
      </div>

      {showMenu && (
        <div className={`${styles.dropdownMenu} `}>
          {displayOptions.map((option, index) => (
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
