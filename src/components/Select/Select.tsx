import { type Option, SelectOption } from './SelectOption.tsx';
import { Label } from '../Label/Label.tsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  //Stores option.value
  const [selectedValue, setSelectedValue] = useState<null | string>(null);

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

  const selectedOption = options.find((option) => option.value === selectedValue);
  const selectedDisplayValue = selectedOption?.label ?? selectedValue ?? null;

  //Filter Options based on Search Query
  const filteredOptions = useMemo(() => {
    const searchQuery = searchValue?.trim().toLowerCase();

    return options.filter((option: Option) => option.label.toLowerCase().includes(searchQuery));
  }, [options, searchValue]);

  const openDropdownMenu = useCallback(() => {
    setShowMenu(true);
    setFocusedIndex(0);
  }, []);

  const closeDropdownMenu = useCallback(() => {
    setShowMenu(false);
    setFocusedIndex(-1);

    triggerRef.current?.focus();
  }, [triggerRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showMenu) setShowMenu(true);

    setSearchValue(e.currentTarget.value);

    if (withFreeText) {
      resolvedProps?.mergedProps.onChange(e);
    }
  };

  const clearValue = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedValue(null);

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

    setSelectedValue(optionValue);

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
        case 'ArrowDown':
          e.preventDefault();
          openDropdownMenu();
          break;
        case ' ':
          if (!searchValue) {
            e.preventDefault();
          }

          if (!searchable) {
            setFocusedIndex(0);
          }

          setShowMenu(true);
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
          break;
      }
    },
    [openDropdownMenu, closeDropdownMenu, filteredOptions.length, searchable, searchValue],
  );

  // Handle menu keyboard events
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case 'ArrowDown':
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
            handleSelectedOption(selected.value);
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
  const listboxId = `${id}-listbox`;

  return (
    <div className={`${styles.selectContainer} ${disabled ? styles.wrapperDisabled : ''}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div role="status" aria-live="polite" className={styles.srOnly}>
        {srMessage}
      </div>

      <div
        className={styles.valueContainer}
        onClick={() => {
          return showMenu ? setShowMenu(false) : setShowMenu(true);
        }}
      >
        {searchable ? (
          <input
            id={id}
            name={props.name}
            placeholder={selectedDisplayValue ?? placeholder}
            className={selectedValue ? styles.displaySelectedOption : ''}
            disabled={disabled}
            ref={inputRef}
            onKeyDown={handleTriggerKeyDown}
            value={searchValue}
            onChange={handleSearch}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={showMenu}
            aria-controls={listboxId}
            aria-autocomplete="list"
            onBlur={() => {
              if (withFreeText && searchValue && focusedIndex < 0) {
                setSelectedValue(searchValue);
                setSearchValue('');
              }
            }}
          />
        ) : (
          <button
            className={`${styles.dropdownButton} ${selectedValue ? styles.selectedOption : ''}`}
            type={'button'}
            ref={buttonRef}
            onKeyDown={handleTriggerKeyDown}
            id={id}
            disabled={disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-expanded={showMenu}
          >
            <span className={selectedValue ? styles.selectedOption : ''}>
              {selectedDisplayValue ?? placeholder}
            </span>
          </button>
        )}

        <div className={styles.iconWrapper}>
          {(searchValue || selectedValue) && (
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
          id={listboxId}
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
                  isSelected={selectedValue === option.value}
                  onClick={() => handleSelectedOption(option.value)}
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
