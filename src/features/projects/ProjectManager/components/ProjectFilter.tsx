import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/stores/store';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FILTER_STATUS, FilterStatusKey } from '@/constants/constants';
import {
  setFilterQuery,
  setFilterStatus,
  fetchProjectQuantities,
} from '@/stores/slices/projectSlice';
import {
  selectProjectFilters,
  selectProjectQuantities,
} from '@/stores/selectors/projectSelectors';

export const ProjectFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { query, status } = useSelector(selectProjectFilters);
  const quantities = useSelector(selectProjectQuantities);

  useEffect(() => {
    dispatch(fetchProjectQuantities());
  }, [dispatch]);

  const handleQueryChange = useCallback(
    (value: string) => {
      dispatch(setFilterQuery(value));
    },
    [dispatch],
  );

  const handleStatusChange = useCallback(
    (newStatus: FilterStatusKey) => {
      dispatch(setFilterStatus(newStatus));
    },
    [dispatch],
  );

  const handleCreateProject = useCallback(() => {
    navigate('/general');
  }, [navigate]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Select
          value={String(status)}
          onValueChange={(value) =>
            handleStatusChange(value as FilterStatusKey)
          }
        >
          <SelectTrigger size="default" className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_STATUS.map(({ key, label }) => (
              <SelectItem key={String(key)} value={String(key)}>
                {`${label} (${quantities[key as FilterStatusKey] ?? 0})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Search
        value={query}
        onChange={handleQueryChange}
        placeholder="Search by client or project name..."
      />

      <Button variant="default" onClick={handleCreateProject}>
        Create Project
      </Button>
    </div>
  );
};
