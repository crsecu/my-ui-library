import { type Option, SelectOption } from './SelectOption.tsx';
import { useState } from 'react';
import styles from './Select.module.css';

import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';
import { Label } from '../Label/Label.tsx';
import { ChevronDown, X } from 'lucide-react';

type SelectProps = {
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  disabled?: boolean;
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
  disabled,
  placeholder,
  searchable,
  withFreeText,
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

  const clearValue = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedOption(null);

    if (resolvedProps) {
      resolvedProps?.setValue('');
    }

    if (searchValue) {
      setSearchValue('');
    }

    // if (showMenu) setShowMenu(false);
  };

  const filteredOptions = options.filter((option: Option) => {
    const searchValueSafe = searchValue?.trim().toLowerCase();
    const optionSafe = option.value.trim().toLowerCase();

    return optionSafe.includes(searchValueSafe);
  });

  console.log(filteredOptions);

  return (
    <div className={`${styles.selectContainer} ${disabled ? styles.wrapperDisabled : ''}`}>
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
              disabled={disabled}
            />
          ) : (
            (selectedOption ?? <span className={styles.placeholder}>{placeholder}</span>)
          )}

          {/*<span className={styles.closeBtn} onClick={clearValue}>*/}
          {/*  x*/}
          {/*</span>*/}
          <div className={styles.iconWrapper}>
            {(searchValue || selectedOption) && (
              <>
                <button
                  type={'button'}
                  aria-label={'Clear input'}
                  onClick={clearValue}
                  className={styles.closeBtn}
                >
                  <X />
                </button>
                {/*<div className={styles.separator}></div>*/}
              </>
            )}

            <span>
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className={`${styles.dropdownMenu} `}>
          {filteredOptions.map((option, index) => (
            <SelectOption
              option={option}
              key={index}
              onClick={(e) => handleSelectedOption(e, option.label)}
              isSelected={selectedOption === option.label}
            />
          ))}

          {filteredOptions.length < 1 && <span className={styles.noOptions}>No options</span>}
        </div>
      )}
    </div>
  );
};
