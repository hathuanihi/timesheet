import React from 'react';
import { Search } from '@/components/ui/search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IBranchResponse } from '@/types/branch.type';
import { IPositionResponse } from '@/types/position.type';
import { RenderListOfItems } from '@/features/projects/components/RenderListOfItems';

type Props = {
  emailQuery: string;
  onEmailQueryChange: (v: string) => void;

  branchQuery: string;
  onBranchQueryChange: (v: string) => void;

  type: number | null;
  onTypeChange: (v: number | null) => void;

  branches: IBranchResponse[];
  positions: IPositionResponse[];

  isLoading: boolean;
  error: string | null;
};

const getSelectPlaceholder = (
  loading: boolean,
  error: string | null,
  defaultText: string,
) => {
  if (loading) return 'Loading...';
  if (error) return 'Error loading data';
  return defaultText;
};

export const FilterAndSearchOption: React.FC<Props> = ({
  emailQuery,
  onEmailQueryChange,
  branchQuery,
  onBranchQueryChange,
  type,
  onTypeChange,
  branches,
  positions,
  isLoading,
  error,
}) => {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="sticky top-0 z-10 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <Search
          placeholder="Search..."
          value={emailQuery}
          onChange={onEmailQueryChange}
        />

        <Select
          value={branchQuery === '' ? 'all' : branchQuery}
          onValueChange={(value) =>
            onBranchQueryChange(value === 'all' ? '' : value)
          }
          disabled={isLoading || !!error}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={getSelectPlaceholder(isLoading, error, 'Branch')}
            />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-64 w-[160px] overflow-y-auto"
          >
            <SelectItem value="all">All branches</SelectItem>
            <RenderListOfItems<IBranchResponse>
              loading={isLoading}
              error={error}
              isPending={false}
              items={branches}
              itemToValue={(b) => String(b.id)}
              itemToKey={(b) => b.id}
              renderItem={(b) => b.displayName}
            />
          </SelectContent>
        </Select>

        <Select
          value={type === null ? 'all' : String(type)}
          onValueChange={(v) => onTypeChange(v === 'all' ? null : Number(v))}
          disabled={isLoading || !!error}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={getSelectPlaceholder(isLoading, error, 'Type')}
            />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-64 w-[160px] overflow-y-auto"
          >
            <SelectItem value="all">All types</SelectItem>
            <RenderListOfItems<IPositionResponse>
              loading={isLoading}
              error={error}
              isPending={false}
              items={positions}
              itemToValue={(p) => String(p.id)}
              itemToKey={(p) => p.id}
              renderItem={(p) => p.shortName || p.name}
            />
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterAndSearchOption;
