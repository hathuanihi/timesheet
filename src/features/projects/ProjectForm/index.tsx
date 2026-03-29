import React, { useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  useLoaderData,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errorHandler';
import { cn } from '@/lib/utils';
import { TABS_PROJECT_EDIT } from '@/constants/constants';
import { Button } from '@/components/ui/button';
import { useForm, FieldErrors, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ProjectFormValues,
  projectSchema,
} from '@/validations/project.schema';
import type { AppDispatch } from '@/stores/store';
import {
  selectProjectForm,
  selectProjectIsLoading,
} from '@/stores/selectors/projectSelectors';
import {
  saveProject,
  resetProjectForm,
  initializeNewProjectForm,
} from '@/stores/slices/projectSlice';
import { updateProjectForm } from '@/stores/slices/projectSlice';
import Loading from '@/components/ui/loading';
import {
  findTabForFieldError,
  collectMessagesByTabFromFieldErrors,
  GLOBAL_ERROR_KEYS,
  loadDraftFormDataFromLocalStorage,
  saveDraftFormDataToLocalStorage,
  clearDraftFormDataFromLocalStorage,
} from '@/helpers/projectFormHelpers';
import { useDebounce } from '@/hooks/useDebounce';

export const ProjectForm: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const projectForm = useSelector(selectProjectForm);
  const isLoading = useSelector(selectProjectIsLoading);
  const loaderData = useLoaderData() as unknown as
    | ProjectFormValues
    | undefined;

  const [isCancelling, setIsCancelling] = useState(false);

  const form = useForm<ProjectFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(projectSchema),
    defaultValues: loadDraftFormDataFromLocalStorage() || projectForm,
  });

  const debouncedSaveDraft = useDebounce(saveDraftFormDataToLocalStorage, 1000);

  useEffect(() => {
    const subscription = form.watch((values) => {
      debouncedSaveDraft(values as ProjectFormValues);
    });

    return () => subscription.unsubscribe();
  }, [form, debouncedSaveDraft]);

  useEffect(() => {
    if (loaderData) {
      dispatch(updateProjectForm(loaderData));
    } else if (!projectId) {
      if (!loadDraftFormDataFromLocalStorage()) {
        dispatch(initializeNewProjectForm());
      }
    }
    return () => {
      dispatch(resetProjectForm());
    };
  }, [dispatch, loaderData, projectId]);

  useEffect(() => {
    const draft = loadDraftFormDataFromLocalStorage();
    if (!draft) {
      form.reset(projectForm);
    }
  }, [projectForm, form]);

  useEffect(() => {
    if (isCancelling) {
      const timer = setTimeout(() => {
        dispatch(resetProjectForm());
        form.reset();
        navigate('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCancelling, dispatch, form, navigate]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<ProjectFormValues>) => {
      const keys = Object.keys(errors);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const tab = findTabForFieldError(firstKey);
        const href = projectId ? `/${projectId}/${tab}` : `/${tab}`;
        navigate(href);

        const grouped = collectMessagesByTabFromFieldErrors(errors);
        const messagesForTab = grouped[tab] || [];
        if (messagesForTab.length > 0) {
          toast.error(messagesForTab.join('; '));
          return;
        }
      }
      const globalMessages: string[] = [];
      Object.keys(errors).forEach((key) => {
        if (GLOBAL_ERROR_KEYS.includes(key as keyof ProjectFormValues)) {
          const message = errors[key as keyof ProjectFormValues]?.message;
          if (message) {
            globalMessages.push(String(message));
          }
        }
      });
      if (globalMessages.length > 0) {
        toast.error(globalMessages.join('; '));
      }
    },
    [navigate, projectId],
  );

  const handleSave: SubmitHandler<ProjectFormValues> = useCallback(
    async (data: ProjectFormValues) => {
      const action = projectId ? 'updated' : 'created';
      try {
        await dispatch(
          saveProject({
            data: data,
            projectId: projectId ? Number(projectId) : undefined,
          }),
        ).unwrap();
        toast.success(`Project ${action} successfully!`);
        clearDraftFormDataFromLocalStorage();
        navigate('/');
      } catch (err) {
        const message = getErrorMessage(err, `Failed to save project.`);
        toast.error(message);
      }
    },
    [dispatch, projectId, navigate],
  );

  const handleCancel = useCallback(() => {
    clearDraftFormDataFromLocalStorage();
    setIsCancelling(true);
  }, []);

  const submitForm = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      handleSubmitError(form.formState.errors);
      return;
    }
    const values = form.getValues() as ProjectFormValues;
    await handleSave(values);
  }, [form, handleSave, handleSubmitError]);

  const isPageLoading = projectId && (isLoading || !projectForm.projectName);
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="border-b mb-4">
          <div className="flex items-center gap-6">
            {TABS_PROJECT_EDIT.map((tab) => {
              const href = projectId ? `/${projectId}/${tab.id}` : `/${tab.id}`;
              return (
                <NavLink
                  key={tab.id}
                  to={href}
                  end={true}
                  className={({ isActive }) =>
                    cn(
                      'px-2 py-2 text-sm -mb-px border-b-2 transition-colors',
                      isActive
                        ? 'border-primary font-medium text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              );
            })}
          </div>
        </div>

        <Outlet context={{ form }} />
      </div>

      <div className="flex-shrink-0 bg-background border-t">
        <div className="flex items-center justify-end gap-2 p-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading || isCancelling}
          >
            {isCancelling && <span className="spinner mr-2" />}
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submitForm}
            disabled={isLoading || isCancelling}
          >
            {isLoading && <span className="spinner mr-2" />}
            Save
          </Button>
        </div>
      </div>
      {isCancelling && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
