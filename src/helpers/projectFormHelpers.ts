import { FieldErrors } from 'react-hook-form';
import { TABS_PROJECT_EDIT } from '@/constants/constants';
import type { ProjectFormValues } from '@/validations/project.schema';

export type TabId = (typeof TABS_PROJECT_EDIT)[number]['id'];

export const GLOBAL_ERROR_KEYS: (keyof ProjectFormValues)[] = [
  'teamSelections',
  'taskSelections',
  'notifications',
];

export function findTabForFieldError(fieldName: string): TabId {
  const f = fieldName.toLowerCase();
  const tabIds = TABS_PROJECT_EDIT.map((t) => t.id) as TabId[];

  const generalKeys = ['client', 'project', 'time', 'note', 'date', 'code'];

  const pick = (): TabId => {
    if (generalKeys.some((k) => f.includes(k))) return 'general' as TabId;

    if (
      f.startsWith('team') ||
      f.startsWith('users') ||
      f.startsWith('projecttarget')
    )
      return 'team' as TabId;

    if (
      f.startsWith('task') ||
      f.startsWith('tasks') ||
      f.includes('taskselections')
    )
      return 'tasks' as TabId;

    if (
      f.startsWith('notification') ||
      f.startsWith('notifications') ||
      f.includes('komu') ||
      f.includes('notice')
    )
      return 'notification' as TabId;

    return 'general' as TabId;
  };

  const chosen = pick();
  return tabIds.includes(chosen) ? chosen : tabIds[0];
}

export function collectMessagesByTabFromFieldErrors(
  errors: FieldErrors<ProjectFormValues>,
): Record<TabId, string[]> {
  const map = {} as Record<TabId, string[]>;
  Object.keys(errors).forEach((key) => {
    const err = (errors as Record<string, unknown>)[key];
    const message = (err as { message?: unknown } | undefined)?.message;
    if (message) {
      const tab = findTabForFieldError(key);
      map[tab] = map[tab] || [];
      map[tab].push(String(message));
    }
  });
  return map;
}

export function collectMessagesByTabFromServerErrors(
  validationErrors: Record<string, unknown> | undefined,
): Record<TabId, string[]> {
  const map = {} as Record<TabId, string[]>;
  if (!validationErrors) return map;
  Object.entries(validationErrors).forEach(([fieldName, errorMessage]) => {
    const msg = Array.isArray(errorMessage)
      ? (errorMessage as unknown[]).join(', ')
      : String(errorMessage ?? '');
    const tab = findTabForFieldError(fieldName);
    map[tab] = map[tab] || [];
    map[tab].push(msg);
  });
  return map;
}

export const DRAFT_STORAGE_KEY = 'projectFormDraft';
export const loadDraftFormDataFromLocalStorage =
  (): ProjectFormValues | null => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Failed to parse project form draft:', error);
      return null;
    }
  };
export const saveDraftFormDataToLocalStorage = (data: ProjectFormValues) => {
  if (data && Object.keys(data).length > 0) {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  }
};
export const clearDraftFormDataFromLocalStorage = () => {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
};
