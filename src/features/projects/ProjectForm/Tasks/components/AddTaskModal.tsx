import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search } from '@/components/ui/search';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TaskList } from './TaskList';
import { ITaskResponse } from '@/types/task.type';
import { TASK_STATUS, TaskFilterStatusKey } from '@/constants/constants';

type AddTaskModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (task: ITaskResponse) => void;
  onUnselect?: (task: ITaskResponse) => void;
  selectedTasks?: ITaskResponse[];
};

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onOpenChange,
  onSelect,
  onUnselect,
  selectedTasks = [],
}) => {
  const [nameQuery, setNameQuery] = useState('');
  const [status, setStatus] = useState<TaskFilterStatusKey>('all');
  const [totalTaskCount, setTotalTaskCount] = useState(0);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setNameQuery('');
      setStatus('all');
    }
    onOpenChange(o);
  };

  const handleStatusChange = (statusValue: boolean) => {
    setStatus((prevStatus) =>
      prevStatus === statusValue ? 'all' : statusValue,
    );
  };

  const availableTaskCount = Math.max(totalTaskCount - selectedTasks.length, 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col gap-4 p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-4 sm:px-6 pb-6">
          <div className="flex-shrink-0">
            <div className="rounded-md border bg-background p-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="modal-task-filter-active"
                      checked={status === TASK_STATUS.ACTIVE}
                      onCheckedChange={() =>
                        handleStatusChange(TASK_STATUS.ACTIVE)
                      }
                    />
                    <Label htmlFor="modal-task-filter-active">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="modal-task-filter-inactive"
                      checked={status === TASK_STATUS.INACTIVE}
                      onCheckedChange={() =>
                        handleStatusChange(TASK_STATUS.INACTIVE)
                      }
                    />
                    <Label htmlFor="modal-task-filter-inactive">Inactive</Label>
                  </div>
                </div>
                <div className="md:col-span-2 w-full sm:w-auto">
                  <Search
                    placeholder="Search by task name"
                    value={nameQuery}
                    onChange={setNameQuery}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <span className="block text-sm text-muted-foreground mb-2">
              Available tasks: {availableTaskCount}
            </span>
            <TaskList
              nameQuery={nameQuery}
              status={status}
              onSelect={onSelect}
              onUnselect={(task) => onUnselect?.(task)}
              selectedTasks={selectedTasks}
              onTaskListLengthChange={setTotalTaskCount}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
