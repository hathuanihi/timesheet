import React, { useEffect, useMemo, useState } from 'react';
import { getAllTasksAPI } from '@/services/task.service';
import { ITaskResponse } from '@/types/task.type';
import { getErrorMessage } from '@/utils/errorHandler';
import { RenderListOfItems } from '@/features/projects/components/RenderListOfItems';
import { TaskItems } from './TaskItems';
import { type TaskFilterStatusKey } from '@/constants/constants';

type TaskListProps = {
  nameQuery?: string;
  status?: TaskFilterStatusKey;
  onSelect?: (task: ITaskResponse) => void;
  onUnselect?: (task: ITaskResponse) => void;
  selectedTasks?: ITaskResponse[];
  onTaskListLengthChange?: (length: number) => void;
};

export const TaskList: React.FC<TaskListProps> = ({
  nameQuery = '',
  status = 'all',
  onSelect,
  onUnselect,
  selectedTasks = [],
  onTaskListLengthChange,
}) => {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllTasksAPI();
        setTasks(res ?? []);
        onTaskListLengthChange?.((res ?? []).length);
      } catch (e) {
        setError(getErrorMessage(e, 'Failed to load tasks'));
        onTaskListLengthChange?.(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [onTaskListLengthChange]);

  const selectedTaskIds = useMemo(
    () => new Set(selectedTasks.map((task) => task.id)),
    [selectedTasks],
  );

  const filteredTasks = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (status !== 'all' && t.isDeleted !== status) {
          return false;
        }
        if (q && !t.name.toLowerCase().includes(q)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.type - a.type);
  }, [tasks, nameQuery, status]);

  return (
    <RenderListOfItems<ITaskResponse>
      variant="list"
      loading={loading}
      error={error}
      isPending={false}
      items={filteredTasks}
      itemToValue={(t) => String(t.id)}
      itemToKey={(t) => t.id}
      renderItem={(t) => (
        <TaskItems
          task={t}
          onSelect={onSelect}
          onUnselect={onUnselect}
          isSelected={selectedTaskIds.has(t.id)}
        />
      )}
      emptyText="No tasks found."
      errorPrefix="Error:"
    />
  );
};
