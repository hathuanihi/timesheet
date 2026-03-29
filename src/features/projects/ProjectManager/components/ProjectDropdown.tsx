import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ViewProjectModal } from './ViewProjectModal/ViewProjectModal';
import ProjectConfirmDialog from './ProjectConfirmDialog';
import { cn } from '@/lib/utils';
import {
  ActivateProjectAPI,
  DeactivateProjectAPI,
  DeleteProjectAPI,
} from '@/services/project.service';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores/store';
import { fetchProjects } from '@/stores/slices/projectSlice';
import { getErrorMessage } from '@/utils/errorHandler';
import useModal from '@/hooks/useModal';
import {
  PROJECT_ACTIONS,
  PROJECT_STATUS,
  type ProjectStatus,
} from '@/constants/constants';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Props = {
  projectId: number;
  status: ProjectStatus;
  projectName?: string;
};

export const ProjectDropdown: React.FC<Props> = ({
  projectId,
  status,
  projectName,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen: isOpenView, toggleModal: toggleView } = useModal();
  const { isOpen: isOpenConfirm, toggleModal: toggleConfirm } = useModal();
  const [confirmType, setConfirmType] = useState<
    'toggle-status' | 'delete' | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const closeConfirm = useCallback(() => {
    setConfirmType(null);
    if (isOpenConfirm) toggleConfirm();
  }, [isOpenConfirm, toggleConfirm]);

  const handleAction = useCallback(
    (key: string) => {
      switch (key) {
        case 'view':
          if (!isOpenView) toggleView();
          break;
        case 'edit':
          navigate(`/${projectId}/general`);
          break;
        case 'toggle-status':
          setConfirmType('toggle-status');
          if (!isOpenConfirm) toggleConfirm();
          break;
        case 'delete':
          setConfirmType('delete');
          if (!isOpenConfirm) toggleConfirm();
          break;
        default:
          break;
      }
    },
    [navigate, projectId, isOpenView, toggleView, isOpenConfirm, toggleConfirm],
  );

  const onConfirm = useCallback(async () => {
    if (!confirmType || submitting) return;
    try {
      setSubmitting(true);
      if (confirmType === 'toggle-status') {
        if (status === PROJECT_STATUS.ACTIVE) {
          await ActivateProjectAPI(projectId);
          toast.success('Project activated');
        } else {
          await DeactivateProjectAPI(projectId);
          toast.success('Project deactivated');
        }
      } else if (confirmType === 'delete') {
        await DeleteProjectAPI(projectId);
        toast.success('Project deleted');
      }
      dispatch(fetchProjects());
      closeConfirm();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Action failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }, [confirmType, submitting, status, projectId, dispatch, closeConfirm]);

  const computedActions = useMemo(() => {
    return PROJECT_ACTIONS.map((action) => {
      if (action.key === 'toggle-status') {
        return {
          ...action,
          label: status === PROJECT_STATUS.ACTIVE ? 'Active' : 'Deactive',
        };
      }
      return action;
    });
  }, [status]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn('flex items-center gap-2 border-gray-300')}
        >
          <Button
            variant="outline"
            size="default"
            className="hover:bg-transparent"
          >
            Actions
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="flex flex-col justify-center"
        >
          {computedActions.map(({ key, label }) => (
            <DropdownMenuItem
              key={key}
              variant={key === 'delete' ? 'destructive' : 'default'}
              onSelect={() => handleAction(key)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewProjectModal
        open={isOpenView}
        onOpenChange={(o) => {
          if (o !== isOpenView) toggleView();
        }}
        projectName={projectName}
        projectId={projectId}
      />

      <ProjectConfirmDialog
        open={isOpenConfirm}
        type={confirmType ?? 'toggle-status'}
        status={status}
        projectName={projectName}
        submitting={submitting}
        onCancel={closeConfirm}
        onConfirm={onConfirm}
      />
    </>
  );
};
