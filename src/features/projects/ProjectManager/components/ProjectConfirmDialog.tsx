import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROJECT_STATUS, type ProjectStatus } from '@/constants/constants';
import Loading from '@/components/ui/loading';

export type ProjectConfirmDialogProps = {
  open: boolean;
  type: 'toggle-status' | 'delete';
  status: ProjectStatus | null;
  projectName?: string;
  submitting?: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
};

export const ProjectConfirmDialog: React.FC<ProjectConfirmDialogProps> = ({
  open,
  type,
  status,
  projectName,
  submitting = false,
  onCancel,
  onConfirm,
}) => {
  const isDeleteAction = type === 'delete';
  const isActivating = status === PROJECT_STATUS.INACTIVE;
  const actionVerb = isActivating ? 'deactivate' : 'activate';
  const capitalizedActionVerb = isActivating ? 'Deactivated' : 'Activated';

  const title = isDeleteAction
    ? 'Delete project?'
    : `${capitalizedActionVerb} project?`;

  const description = isDeleteAction
    ? `This action cannot be undone. ${projectName ? `Project "${projectName}" will be permanently deleted.` : ''}`
    : `Are you sure you want to ${actionVerb} the project "${projectName}"?`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel?.()}>
      <DialogContent>
        <div className="relative">
          {submitting && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
              <Loading />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{description}</p>
          <DialogFooter className="mt-4">
            <DialogClose onClick={onCancel} disabled={submitting}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={type === 'delete' ? 'destructive' : 'default'}
              onClick={onConfirm}
              disabled={submitting}
              aria-busy={submitting}
              className="relative min-w-[7.5rem]"
            >
              <span
                className={cn(
                  'inline-flex items-center justify-center transition-opacity',
                  submitting ? 'opacity-0' : 'opacity-100',
                )}
              >
                Confirm
              </span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectConfirmDialog;
