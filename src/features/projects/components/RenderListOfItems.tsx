import React from 'react';
import { SelectItem, SelectGroup } from '@/components/ui/select';
import { MAX_ITEMS } from '@/constants/constants';
import Loading from '@/components/ui/loading';

type RenderListOfItemsProps<T> = {
  loading: boolean;
  error: string | null;
  isPending?: boolean;
  items: T[];
  itemToValue: (item: T) => string;
  itemToKey?: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
  variant?: 'select' | 'list';
  emptyText?: string;
  errorPrefix?: string;
};

export const RenderListOfItems = <T extends object>({
  loading,
  error,
  isPending,
  items,
  itemToValue,
  itemToKey,
  renderItem,
  variant = 'select',
  emptyText = 'No data.',
  errorPrefix,
}: RenderListOfItemsProps<T>) => {
  if (variant === 'list') {
    if (loading) return <Loading />;
    if (error)
      return (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorPrefix ? `${errorPrefix}: ${error}` : error}
        </div>
      );
    if (isPending)
      return (
        <div className="py-6 text-sm text-muted-foreground">Searching…</div>
      );
    if (items.length === 0)
      return (
        <div className="p-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md">
          {emptyText}
        </div>
      );
    return (
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <React.Fragment key={itemToKey ? itemToKey(item) : itemToValue(item)}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (loading)
    return (
      <SelectItem value="__loading">
        <Loading />
      </SelectItem>
    );
  if (error)
    return (
      <SelectItem value="__error">
        {errorPrefix ? `${errorPrefix}: ${error}` : error}
      </SelectItem>
    );
  if (isPending) return <SelectItem value="__searching">Searching…</SelectItem>;
  if (items.length === 0)
    return <SelectItem value="__empty">{emptyText}</SelectItem>;

  const limitedItems = items.slice(0, MAX_ITEMS);
  const remainingCount = Math.max(0, items.length - limitedItems.length);

  return (
    <SelectGroup>
      {limitedItems.map((item) => (
        <SelectItem
          key={itemToKey ? itemToKey(item) : itemToValue(item)}
          value={itemToValue(item)}
        >
          {renderItem(item)}
        </SelectItem>
      ))}
      {remainingCount > 0 && (
        <SelectItem value="__more">
          Showing first {MAX_ITEMS} of {items.length} results. Refine your
          search…
        </SelectItem>
      )}
    </SelectGroup>
  );
};
