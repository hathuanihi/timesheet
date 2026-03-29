import React, { useState, useEffect, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  debounceDelay?: number;
}

export const Search: React.FC<SearchProps> = memo(
  ({
    value,
    onChange,
    onSubmit,
    placeholder,
    className,
    autoFocus,
    debounceDelay = 500,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const debouncedOnChange = useDebounce(onChange, debounceDelay);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      debouncedOnChange(newValue);
    };

    return (
      <div className={`relative w-full max-w-sm ${className}`}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit?.(value);
            }
          }}
          placeholder={placeholder ?? 'Search...'}
          className="pr-8"
          autoFocus={autoFocus}
          search
        />
        <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      </div>
    );
  },
);
