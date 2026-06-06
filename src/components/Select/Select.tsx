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

    if (searchValue) {
      setSearchValue('');
      console.log('testtttt', searchInputRef.current);

      if (searchInputRef.current) {
        const input = searchInputRef.current;
        console.log('INPUT', input);
      }
    }
  };

  const filteredOptions = options.filter((option: Option) => option.value.includes(searchValue));
  const displayOptions = searchValue ? filteredOptions : options;

  console.log(filteredOptions);

  return (
    <div className={styles.selectContainer}>
      <div className={styles.valueContainer}>
        {searchable && (
          <input
            ref={searchInputRef}
            value={searchValue}
            onClick={toggleMenuVisibility}
            onChange={handleSearch}
          />
        )}

        <div className={`${styles.valueDisplay} ${styles.hide}`} onClick={toggleMenuVisibility}>
          {selectedOption ? (
            selectedOption
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
          {selectedOption && <span onClick={closeMenu}>x</span>}
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
