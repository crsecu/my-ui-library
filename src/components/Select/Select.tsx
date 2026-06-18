import { type Option, SelectOption } from './SelectOption.tsx';
import { Label } from '../Label/Label.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Select.module.css';
import { ChevronDown, X } from 'lucide-react';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';

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

type TriggerType = HTMLInputElement | HTMLButtonElement;

const Select = ({
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
  const [focusedIndex, setFocusedIndex] = useState(-1);

  //Trigger refs
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const triggerRef = searchable ? inputRef : buttonRef;
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<HTMLLIElement[]>([]);

  const resolvedProps = useResolvedInputPropsRefactored(props);
  console.log('resolvedProps ', resolvedProps);

  //Filter Options based on Search Query
  const filteredOptions = options.filter((option: Option) => {
    const searchValueSafe = searchValue?.trim().toLowerCase();
    const optionSafe = option.value.trim().toLowerCase();

    return optionSafe.includes(searchValueSafe);
  });

  const openDropdownMenu = () => {
    setShowMenu(true);
    setFocusedIndex(0);
  };

  const closeDropdownMenu = () => {
    setShowMenu(false);
    setFocusedIndex(-1);

    triggerRef.current?.focus();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showMenu) setShowMenu(true);

    setSearchValue(e.currentTarget.value);

    if (withFreeText) {
      resolvedProps?.mergedProps.onChange(e);
    }
  };

  const clearValue = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    console.log('clear');
    setSelectedOption(null);

    if (resolvedProps) {
      resolvedProps?.setValue('');
    }

    if (searchValue) {
      setSearchValue('');
    }

    triggerRef.current?.focus();
  };

  const handleSelectedOption = (optionValue: string) => {
    if (searchValue) setSearchValue('');

    if (resolvedProps) {
      resolvedProps?.setValue(optionValue);
    }

    setSelectedOption(optionValue);

    setShowMenu(false);
  };

  // Focus the option at the current index
  useEffect(() => {
    if (showMenu && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [showMenu, focusedIndex]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const triggerContainer = triggerRef.current?.parentElement as HTMLDivElement;

      if (
        menuRef.current &&
        !menuRef.current?.contains(e.target as Node) &&
        !triggerContainer?.contains(e.target as Node)
      ) {
        console.log('handleClickOutside CLOSE MENU', e.target);
        if (!withFreeText) setSearchValue('');

        closeDropdownMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, closeDropdownMenu, withFreeText, triggerRef]);

  // Handle trigger keyboard events
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<TriggerType>) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          break;
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          openDropdownMenu();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setShowMenu(true);
          setFocusedIndex(filteredOptions.length - 1);
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdownMenu();
          setSearchValue('');
          break;
        case 'Tab':
          closeDropdownMenu();
          break;
        default:
          console.log('what is this');
          break;
      }
    },
    [openDropdownMenu, closeDropdownMenu, filteredOptions.length],
  );

  // Handle menu keyboard events
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          console.log('EL WITH FOCUS IS:', document.activeElement);
          e.preventDefault();
          setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(filteredOptions.length - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0) {
            const selected = filteredOptions[focusedIndex];
            console.log('selected', selected);
            handleSelectedOption(selected.label);
            closeDropdownMenu();
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdownMenu();
          break;
        case 'Tab':
          closeDropdownMenu();
          break;
        default:
          break;
      }
    },
    [filteredOptions, focusedIndex, handleSelectedOption, closeDropdownMenu],
  );

  const hasNoOptions = showMenu && filteredOptions.length === 0;
  const srMessage = hasNoOptions ? 'No options found' : '';
  console.log('hasNoOptions', hasNoOptions, srMessage);

  return (
    <div className={`${styles.selectContainer} ${disabled ? styles.wrapperDisabled : ''}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div role="status" aria-live="polite" className={styles.srOnly}>
        {srMessage}
      </div>

      <div
        className={styles.valueContainer}
        onClick={() => {
          console.log('CAUGHT');
          return showMenu ? setShowMenu(false) : setShowMenu(true);
        }}
      >
        {searchable ? (
          <input
            id={id}
            name={props.name}
            placeholder={selectedOption ?? placeholder}
            className={selectedOption ? styles.displaySelectedOption : ''}
            disabled={disabled}
            aria-disabled={disabled}
            ref={inputRef}
            onKeyDown={handleTriggerKeyDown}
            value={searchValue}
            onChange={handleSearch}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={showMenu}
            aria-controls={'dropdownId'}
            aria-autocomplete="list"
          />
        ) : (
          <button
            className={`${styles.dropdownButton} ${selectedOption ? styles.selectedOption : ''}`}
            type={'button'}
            ref={buttonRef}
            onKeyDown={handleTriggerKeyDown}
            id={id}
            disabled={disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-controls={'dropdownId'}
            aria-expanded={showMenu}
            aria-disabled={disabled}
          >
            <span className={selectedOption ? styles.selectedOption : ''}>
              {selectedOption ?? placeholder}
            </span>
          </button>
        )}

        <div className={styles.iconWrapper}>
          {(searchValue || selectedOption) && (
            <button
              type="button"
              aria-label={'Clear input'}
              className={styles.closeBtn}
              onClick={clearValue}
            >
              <X />
            </button>
          )}

          <span>
            <ChevronDown />
          </span>
        </div>
      </div>

      {showMenu && (
        <div
          className={`${styles.dropdownMenu} ${filteredOptions.length < 1 ? styles.noOptions : ''} `}
          tabIndex={-1}
          ref={menuRef}
          id={'dropdownId'}
        >
          {filteredOptions.length > 0 ? (
            <ul role="listbox" onKeyDown={handleMenuKeyDown}>
              {filteredOptions.map((option, index) => (
                <SelectOption
                  key={index}
                  ref={(el: HTMLLIElement) => {
                    optionRefs.current[index] = el;
                  }}
                  value={option.value}
                  label={option.label}
                  isSelected={selectedOption === option.label}
                  onClick={() => handleSelectedOption(option.label)}
                />
              ))}
            </ul>
          ) : (
            <span className={styles.noOptions} onMouseDown={(e) => e.preventDefault()}>
              No options
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default Select;
