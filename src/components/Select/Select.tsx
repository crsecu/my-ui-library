import { type Option, SelectOption } from './SelectOption.tsx';
import { useState } from 'react';
import styles from './Select.module.css';

import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';
import { Label } from '../Label/Label.tsx';

type SelectProps = {
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  options: Option[];
  onChange?: (value: string) => void;
  searchable?: boolean;
  withFreeText?: boolean;
};

export const Select = ({
  id,
  name,
  options,
  label,
  placeholder,
  searchable,
  withFreeText,
  ...props
}: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | string>(null);
  const [searchValue, setSearchValue] = useState('');

  const resolvedProps = useResolvedInputPropsRefactored({
    name,
  });

  console.log('select resolvedProps', resolvedProps);

  const toggleMenuVisibility = () => {
    if (filteredOptions.length < 1 && showMenu) {
      setSearchValue('');
    }
    setShowMenu(!showMenu);
  };

  const handleSelectedOption = (e: React.MouseEvent<HTMLDivElement>, optionValue: string) => {
    if (searchValue) setSearchValue('');

    if (resolvedProps) {
      resolvedProps?.setValue(optionValue);
    }
    setSelectedOption(optionValue);

    setShowMenu(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const closeMenu = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedOption(null);

    if (resolvedProps) {
      resolvedProps?.setValue('');
    }

    if (showMenu) setShowMenu(false);

    if (searchValue) {
      setSearchValue('');
    }
  };

  const filteredOptions = options.filter((option: Option) => {
    const searchValueSafe = searchValue?.trim().toLowerCase();
    const optionSafe = option.value.trim().toLowerCase();

    return optionSafe.includes(searchValueSafe);
  });

  console.log(filteredOptions);

  return (
    <div className={styles.selectContainer}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.valueContainer}>
        <div className={`${styles.valueDisplay}`} onClick={toggleMenuVisibility}>
          {searchable ? (
            <input
              {...resolvedProps?.mergedProps}
              name={name}
              value={searchValue}
              onChange={handleSearch}
              placeholder={selectedOption ?? placeholder}
              className={` ${selectedOption ? styles.displaySelectedValue : ''}`}
            />
          ) : (
            (selectedOption ?? <span className={styles.placeholder}>{placeholder}</span>)
          )}

          <span className={styles.closeBtn} onClick={closeMenu}>
            x
          </span>
        </div>
      </div>

      {showMenu && (
        <div className={`${styles.dropdownMenu} `}>
          {filteredOptions.map((option, index) => (
            <SelectOption
              option={option}
              key={index}
              onClick={(e) => handleSelectedOption(e, option.value)}
            />
          ))}

          {filteredOptions.length < 1 && <span className={styles.noOptions}>No options</span>}
        </div>
      )}
    </div>
  );
};
