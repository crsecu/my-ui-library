import { type Option, SelectOption } from '../SelectOption/SelectOption.tsx';
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

/**
 * Flexible select component with optional search and free-text input support.
 * Supports keyboard navigation, filtering, clearing values.
 * Handles either Formik form state or custom externally controlled state automatically.
 * @param id - Unique identifier for the select input.
 * @param name - Field name used to identify the input value.
 * @param label - Optional label displayed above the select input.
 * @param placeholder - Placeholder text displayed when no option is selected.
 * @param disabled - Disables the select input and prevents interaction.
 * @param options - List of selectable options displayed in the dropdown.
 * @param searchable - Enables searching/filtering options through text input.
 * @param withFreeText - Allows users to enter and store values that are not part of the provided options.
 * @param value - Controlled value of the selected option.
 * @param onChange - Callback triggered when the selected value changes.
 *
 * @returns A dropdown select input.
 */
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
  const [searchValue, setSearchValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  //REFS
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = searchable ? inputRef : buttonRef;
  const menuRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<Map<string, HTMLLIElement>>(null);

  const resolvedProps = useResolvedInputPropsRefactored(props);
  const resolvedValue = resolvedProps?.mergedProps.value;

  const selectedOption = options.find((option) => option.value === resolvedValue);
  const selectedDisplayValue = (selectedOption?.label ?? resolvedValue) || null;

  //Filter Options based on search query
  const filteredOptions = useMemo(() => {
    const searchQuery = searchValue?.trim().toLowerCase();
    if (!searchQuery) return options;

    return options.filter((option: Option) => option.label.toLowerCase().includes(searchQuery));
  }, [options, searchValue]);

  const openDropdownMenu = useCallback(() => {
    setShowMenu(true);
    setFocusedIndex(0);
  }, []);

  const closeDropdownMenu = useCallback(() => {
    setShowMenu(false);
    setFocusedIndex(-1);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showMenu) setShowMenu(true);

    setFocusedIndex(0);
    setSearchValue(e.currentTarget.value);

    if (withFreeText) {
      resolvedProps?.mergedProps.onChange(e);
    }
  };

  const clearValue = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (searchValue) {
      setSearchValue('');
    }

    if (resolvedProps) {
      resolvedProps?.setValue('');
    }

    triggerRef.current?.focus();
  };

  const handleSelectedOption = useCallback(
    (optionValue: string) => {
      if (searchValue) setSearchValue('');

      if (resolvedProps) {
        resolvedProps.setValue(optionValue);

        if ('setTouched' in resolvedProps) {
          resolvedProps.setTouched(true);
        }
      }

      closeDropdownMenu();
    },
    [closeDropdownMenu, resolvedProps, searchValue],
  );

  //Scroll into view
  useEffect(() => {
    if (!showMenu || focusedIndex < 0) return;

    const option = filteredOptions[focusedIndex];
    if (!option) return;

    optionsRef.current?.get(option.value)?.scrollIntoView?.({
      block: 'nearest',
    });
  }, [focusedIndex, showMenu, filteredOptions]);

  //Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        closeDropdownMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, closeDropdownMenu]);

  //Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<TriggerType>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!showMenu) {
            openDropdownMenu();
            break;
          }

          setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!showMenu) {
            setShowMenu(true);
            setFocusedIndex(filteredOptions.length - 1);
            break;
          }

          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0) {
            const selected = filteredOptions[focusedIndex];

            if (selected) {
              handleSelectedOption(selected.value);
            }
          }
          break;
        case ' ':
          if (!searchValue) {
            if (focusedIndex >= 0) {
              e.preventDefault();
              const selected = filteredOptions[focusedIndex];
              if (selected) handleSelectedOption(selected.value);
              break;
            }

            e.preventDefault();
            openDropdownMenu();
          }

          break;
        case 'Escape':
          e.preventDefault();

          if (searchValue) setSearchValue('');
          if (withFreeText) resolvedProps?.setValue('');
          closeDropdownMenu();
          break;
        case 'Tab':
          if (focusedIndex >= 0) {
            if (filteredOptions.length === 0) {
              closeDropdownMenu();
              break;
            }
            e.preventDefault();
            const selected = filteredOptions[focusedIndex];
            if (selected) handleSelectedOption(selected.value);
            break;
          }
          setShowMenu(false);
          break;
        default:
          break;
      }
    },
    [
      showMenu,
      focusedIndex,
      searchValue,
      closeDropdownMenu,
      openDropdownMenu,
      filteredOptions,
      handleSelectedOption,
      withFreeText,
      resolvedProps,
    ],
  );

  const hasNoOptions = showMenu && filteredOptions.length === 0;
  const srMessage = hasNoOptions ? 'No options found' : '';
  const activeOption = focusedIndex >= 0 ? filteredOptions[focusedIndex] : null;
  const listboxId = `${id}-listbox`;

  return (
    <div
      className={`${styles.selectContainer} ${disabled ? styles.wrapperDisabled : ''}`}
      data-disabled={disabled}
      ref={rootRef}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <div role="status" aria-live="polite" className={styles.srOnly}>
        {srMessage}
      </div>

      <div
        className={styles.selectControl}
        onClick={() => setShowMenu((prev) => !prev)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            if (withFreeText) return;
            if (searchValue) setSearchValue('');
          }
        }}
      >
        {searchable ? (
          <input
            id={id}
            type="search"
            name={props.name}
            placeholder={selectedDisplayValue ?? placeholder}
            className={resolvedValue ? styles.displaySelectedOption : ''}
            disabled={disabled}
            ref={inputRef}
            role="combobox"
            aria-activedescendant={activeOption ? `listoption-${activeOption.value}` : undefined}
            aria-haspopup="listbox"
            aria-expanded={showMenu}
            aria-controls={listboxId}
            aria-autocomplete="list"
            value={searchValue}
            onKeyDown={handleKeyDown}
            onChange={handleSearch}
            onBlur={resolvedProps?.mergedProps.onBlur}
          />
        ) : (
          <button
            className={`${styles.dropdownButton} ${resolvedValue ? styles.selectedOption : ''}`}
            type={'button'}
            ref={buttonRef}
            onKeyDown={handleKeyDown}
            id={id}
            disabled={disabled}
            role="combobox"
            aria-activedescendant={activeOption ? `listoption-${activeOption.value}` : undefined}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-expanded={showMenu}
          >
            <span className={resolvedValue ? styles.selectedOption : ''}>
              {selectedDisplayValue ?? placeholder}
            </span>
          </button>
        )}

        <div className={styles.iconWrapper}>
          {(searchValue || resolvedValue) && (
            <button
              type="button"
              aria-label={'Clear input'}
              className={styles.clearButton}
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
            <ul className={styles.menuList} role="listbox">
              {filteredOptions.map((option, index) => (
                <SelectOption
                  key={option.value}
                  id={`listoption-${option.value}`}
                  ref={(el: HTMLLIElement) => {
                    if (!el) return;

                    if (!optionsRef.current) {
                      optionsRef.current = new Map();
                    }

                    const map = optionsRef.current;
                    map.set(option.value, el);

                    return () => {
                      map.delete(option.value);
                    };
                  }}
                  value={option.value}
                  label={option.label}
                  isSelected={resolvedValue === option.value}
                  onClick={() => handleSelectedOption(option.value)}
                  isFocused={focusedIndex === index}
                />
              ))}
            </ul>
          ) : (
            <span className={styles.noOptionsMessage} onMouseDown={(e) => e.preventDefault()}>
              No options
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default Select;
