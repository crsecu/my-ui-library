import { type Option, SelectOption } from './SelectOption.tsx';
import { useRef, useState } from 'react';
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
  searchable?: boolean;
  withFreeText?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

// TO DO: withFreeText value becomes selectedOption when user presses enter/click etc
// state lives in parent component, not internally

//when withFreeText = false, value from parent shouldn't be updated (use dif way to capture
//the value typed in by user
export const Select = ({
  id,
  options,
  label,
  disabled,
  placeholder,
  searchable,
  withFreeText,
  ...props
}: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | string>(null);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedProps = useResolvedInputPropsRefactored(props);

  // console.log('resolved PROPS', resolvedProps);

  const openDropdownMenu = (e: React.FocusEvent<HTMLElement>) => {
    setShowMenu(true);
  };

  const closeDropdownMenu = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowMenu(false);
      setSearchValue('');
    }
  };

  const handleSelectedOption = (optionValue: string) => {
    if (searchValue) setSearchValue('');

    if (resolvedProps) {
      resolvedProps?.setValue(optionValue);
    }
    setSelectedOption(optionValue);

    setShowMenu(false);
  };

  //save searchQuery as selected option
  const handleFreeText = () => {
    if (!withFreeText) return;

    if (filteredOptions.length < 1) {
      handleSelectedOption(searchValue);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showMenu) setShowMenu(true);

    setSearchValue(e.currentTarget.value);
    if (filteredOptions.length < 1) {
      console.log('NO MATCHING OPTIONS');
    }
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

    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('test');
    if (e.key === 'Enter') {
      e.preventDefault();

      handleFreeText();
    }
  };

  //Filter Options based on Search Query
  const filteredOptions = options.filter((option: Option) => {
    const searchValueSafe = searchValue?.trim().toLowerCase();
    const optionSafe = option.value.trim().toLowerCase();

    return optionSafe.includes(searchValueSafe);
  });

  return (
    <div
      className={`${styles.selectContainer} ${disabled ? styles.wrapperDisabled : ''}`}
      onBlur={closeDropdownMenu}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.valueContainer} onFocus={openDropdownMenu}>
        {searchable ? (
          <input
            name={props.name}
            value={searchValue}
            placeholder={selectedOption ?? placeholder}
            className={` ${selectedOption ? styles.displaySelectedValue : ''}`}
            disabled={disabled}
            ref={inputRef}
            onChange={handleSearch}
            onClick={handleFreeText}
            onKeyDown={handleKey}
          />
        ) : selectedOption ? (
          <div className={`${styles.valueDisplay}`}>{selectedOption}</div>
        ) : (
          <button className={styles.placeholderDisplay} type={'button'}>
            <span>{placeholder}</span>
          </button>
        )}

        <div className={styles.iconWrapper}>
          {(searchValue || selectedOption) && (
            <button
              type={'button'}
              aria-label={'Clear input'}
              onClick={clearValue}
              className={styles.closeBtn}
            >
              <X />
            </button>
          )}

          <span tabIndex={-1}>
            <ChevronDown />
          </span>
        </div>
      </div>

      {showMenu && (
        <div
          className={`${styles.dropdownMenu} ${filteredOptions.length < 1 ? styles.noOptions : ''} `}
        >
          {filteredOptions.map((option, index) => (
            <SelectOption
              value={option.value}
              label={option.label}
              key={index}
              onClick={() => handleSelectedOption(option.label)}
              isSelected={selectedOption === option.label}
            />
          ))}

          {filteredOptions.length < 1 && (
            <span className={styles.noOptions} onMouseDown={(e) => e.preventDefault()}>
              No options
            </span>
          )}
        </div>
      )}
    </div>
  );
};
