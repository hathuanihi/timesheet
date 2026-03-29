import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TaskItems } from './components/TaskItems';
import AddTaskModal from './components/AddTaskModal';
import useModal from '@/hooks/useModal';
import { useOutletContext } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '@/validations/project.schema';
import type { ITaskResponse } from '@/types/task.type';

export const Tasks: React.FC = () => {
  const { isOpen: isModalOpen, toggleModal: setIsModalOpen } = useModal();
  const { form } = useOutletContext<{
    form: UseFormReturn<ProjectFormValues>;
  }>();
  const selectedTasksRaw = form.watch('taskSelections') as
    | ITaskResponse[]
    | undefined;
  const selectedTasks = useMemo(
    () => (selectedTasksRaw || []) as ITaskResponse[],
    [selectedTasksRaw],
  );

  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const filteredSelectedTasks = useMemo(() => {
    const showAll =
      (showActive && showInactive) || (!showActive && !showInactive);
    if (showAll) {
      return selectedTasks;
    }

    return selectedTasks.filter((task) => {
      if (showActive) return !task.isDeleted;
      if (showInactive) return task.isDeleted;
      return false;
    });
  }, [selectedTasks, showActive, showInactive]);

  const handleShowActiveChange = (checked: boolean | 'indeterminate') => {
    setShowActive(Boolean(checked));
  };

  const handleShowInactiveChange = (checked: boolean | 'indeterminate') => {
    setShowInactive(Boolean(checked));
  };

  const handleOpenModal = () => {
    setIsModalOpen();
  };

  const handleRemoveTask = (taskId: number) => {
    const updatedTasks = selectedTasks.filter((x) => x.id !== taskId);
    form.setValue('taskSelections', updatedTasks, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSelectTask = (task: ITaskResponse) => {
    const isAlreadySelected = selectedTasks.some((x) => x.id === task.id);
    if (!isAlreadySelected) {
      const updatedTasks = [...selectedTasks, task];
      form.setValue('taskSelections', updatedTasks, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleUnselectTask = (task: ITaskResponse) => {
    const updatedTasks = selectedTasks.filter((x) => x.id !== task.id);
    form.setValue('taskSelections', updatedTasks, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="task-filter-active"
              checked={showActive}
              onCheckedChange={handleShowActiveChange}
            />
            <Label htmlFor="task-filter-active">Show Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="task-filter-inactive"
              checked={showInactive}
              onCheckedChange={handleShowInactiveChange}
            />
            <Label htmlFor="task-filter-inactive">Show Inactive</Label>
          </div>
        </div>
        <Button onClick={handleOpenModal}>Add Task</Button>
      </div>

      {selectedTasks.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border rounded-md">
          No tasks have been selected for this project yet. Click "Add Task" to
          begin.
        </div>
      ) : (
        <div className="rounded-md border bg-background p-3 mb-4">
          <h3 className="text-sm font-medium mb-2">
            Selected Tasks: {selectedTasks.length}
          </h3>
          {filteredSelectedTasks.length > 0 ? (
            <ul className="space-y-2">
              {filteredSelectedTasks.map((t) => (
                <TaskItems
                  key={t.id}
                  task={t}
                  selectedMode
                  onRemove={handleRemoveTask}
                />
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              No selected tasks match the current filter.
            </div>
          )}
        </div>
      )}

      <AddTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectTask}
        onUnselect={handleUnselectTask}
        selectedTasks={selectedTasks}
      />
    </div>
  );
};
