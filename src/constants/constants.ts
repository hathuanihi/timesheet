import { ProjectFormValues } from '@/validations/project.schema';
const APP_NAME = 'NCC Timesheet';
const MAX_ITEMS = 100;

const TABS_PROJECT_EDIT = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notification', label: 'Notification' },
] as const;

const TABS_PROJECT_VIEW = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'team', label: 'Team' },
] as const;

const PROJECT_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
} as const;

type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  [PROJECT_STATUS.ACTIVE]: {
    label: 'Active',
    className: 'bg-green-100 text-green-800',
  },
  [PROJECT_STATUS.INACTIVE]: {
    label: 'Inactive',
    className: 'bg-gray-200 text-gray-800',
  },
} as const;

const PROJECT_TYPE_CONFIG: Record<
  number,
  { name: string; code: string; className: string }
> = {
  0: { name: 'T&M', code: 'T&M', className: 'bg-orange-100 text-orange-800' },
  1: {
    name: 'Fixed Price',
    code: 'FF',
    className: 'bg-blue-100 text-blue-800',
  },
  2: {
    name: 'Non-Billable',
    code: 'NB',
    className: 'bg-amber-100 text-amber-800',
  },
  3: { name: 'ODC', code: 'ODC', className: 'bg-violet-100 text-violet-800' },
  4: {
    name: 'Product',
    code: 'PD',
    className: 'bg-emerald-100 text-emerald-800',
  },
  5: { name: 'Training', code: 'TR', className: 'bg-cyan-100 text-cyan-800' },
  6: { name: 'NoSalary', code: 'NS', className: 'bg-pink-100 text-pink-800' },
};

const BADGE_FALLBACK_CLASS = 'bg-gray-100 text-gray-800';

const PROJECT_ACTIONS = [
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'toggle-status', label: 'Deactive' },
  { key: 'delete', label: 'Delete' },
] as const;

type ProjectActionKey = (typeof PROJECT_ACTIONS)[number]['key'];

const FILTER_STATUS = [
  { key: 'all', label: 'All' },
  { key: PROJECT_STATUS.ACTIVE, label: 'Active' },
  { key: PROJECT_STATUS.INACTIVE, label: 'Inactive' },
] as const;

type FilterStatusKey = (typeof FILTER_STATUS)[number]['key'];

const DATE_LABEL_PATTERN = 'MMM dd, yyyy';
const ISO_DATE_LENGTH = 10;
const WEEK_STARTS_ON = 1;
const DEFAULT_RANGE_DAYS = 7;

const TIME_RANGE_OPTIONS = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom Time' },
];

enum ERole {
  Member,
  PM,
  Shadow,
  Deactive,
}

const TEMP_TYPE_OPTIONS = [
  { value: true, label: 'Temp' },
  { value: false, label: 'Official' },
] as const;

const TASK_STATUS = {
  ACTIVE: false,
  INACTIVE: true,
} as const;

type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

const TASK_STATUS_CONFIG: Record<string, { label: string; className: string }> =
  {
    [String(TASK_STATUS.ACTIVE)]: {
      label: 'Active',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    [String(TASK_STATUS.INACTIVE)]: {
      label: 'Inactive',
      className: 'bg-gray-200 text-gray-600 border-gray-300',
    },
  };

const TASK_FILTER_STATUS = [
  { key: 'all', label: 'All Status' },
  { key: TASK_STATUS.ACTIVE, label: 'Active' },
  { key: TASK_STATUS.INACTIVE, label: 'Inactive' },
] as const;

type TaskFilterStatusKey = (typeof TASK_FILTER_STATUS)[number]['key'];

const NOTIFICATION_OPTIONS: {
  id: keyof ProjectFormValues['notifications'];
  label: string;
}[] = [
  { id: 'isNoticeKMSubmitTS', label: 'Submit timesheet' },
  {
    id: 'isNoticeKMRequestOffDate',
    label: 'Request Off/Remote/Onsite/Đi muộn, về sớm',
  },
  {
    id: 'isNoticeKMApproveRequestOffDate',
    label: 'Approve/Reject Request Off/Remote/Onsite/Đi muộn, về sớm',
  },
  {
    id: 'isNoticeKMRequestChangeWorkingTime',
    label: 'Request Change Working Time',
  },
  {
    id: 'isNoticeKMApproveChangeWorkingTime',
    label: 'Approve/Reject Change Working Time',
  },
];

export {
  APP_NAME,
  MAX_ITEMS,
  TABS_PROJECT_EDIT,
  TABS_PROJECT_VIEW,
  PROJECT_STATUS,
  PROJECT_STATUS_CONFIG,
  PROJECT_TYPE_CONFIG,
  BADGE_FALLBACK_CLASS,
  PROJECT_ACTIONS,
  FILTER_STATUS,
  DATE_LABEL_PATTERN,
  ISO_DATE_LENGTH,
  WEEK_STARTS_ON,
  DEFAULT_RANGE_DAYS,
  TIME_RANGE_OPTIONS,
  ERole,
  TEMP_TYPE_OPTIONS,
  TASK_STATUS,
  TASK_STATUS_CONFIG,
  TASK_FILTER_STATUS,
  NOTIFICATION_OPTIONS,
};

export type { ProjectStatus };
export type { ProjectActionKey };
export type { FilterStatusKey };
export type { TaskStatus };
export type { TaskFilterStatusKey };
