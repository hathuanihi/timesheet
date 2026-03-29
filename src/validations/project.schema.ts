import { z } from 'zod';
import { ERole } from '@/constants/constants';
import {
  NOTE_MAX,
  PROJECT_CODE_MAX,
  PROJECT_NAME_MAX,
} from '@/constants/validationRules';

const selectedTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.number(),
  isDeleted: z.boolean().default(false),
});
const selectedTeamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  emailAddress: z.string().email(),
  isActive: z.boolean().default(true),
  type: z.number(),
  jobTitle: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  userCode: z.string().nullable().optional(),
  avatarPath: z.string().nullable().optional(),
  avatarFullPath: z.string().nullable().optional(),
  branch: z
    .union([z.string(), z.number(), z.null()])
    .transform((val) => (val == null ? null : String(val))),
  branchColor: z.string().nullable().optional(),
  branchDisplayName: z.string().nullable().optional(),
  branchId: z.number().nullable().optional(),
  positionId: z.number().nullable(),
  positionName: z.string().nullable(),

  role: z.nativeEnum(ERole),
  tempType: z.boolean().default(false),
  roleName: z.string().optional(),
});

export const projectSchema = z
  .object({
    clientId: z.number().positive({ message: 'Client is required' }),
    projectName: z
      .string()
      .trim()
      .min(1, { message: 'Project name is required' })
      .max(PROJECT_NAME_MAX, `Max ${PROJECT_NAME_MAX} characters`),
    projectCode: z
      .string()
      .trim()
      .min(1, { message: 'Project code is required' })
      .max(PROJECT_CODE_MAX, `Max ${PROJECT_CODE_MAX} characters`),
    projectType: z.number().positive({ message: 'Project type is required' }),
    timeStart: z.string().trim().min(1, { message: 'Start date is required' }),
    timeEnd: z.union([z.string(), z.undefined(), z.null()]).transform((val) => {
      if (val == null) return undefined;
      const s = String(val).trim();
      return s === '' ? undefined : s;
    }),
    note: z.string().max(NOTE_MAX, `Max ${NOTE_MAX} characters`).optional(),
    autoAddUser: z.boolean().default(false),
    teamSelections: z
      .array(selectedTeamMemberSchema)
      .nonempty({ message: 'Please add at least one member.' })
      .refine((team) => team.some((u) => u.role === ERole.PM), {
        message: 'Please assign at least one PM to the project.',
      }),
    taskSelections: z.array(selectedTaskSchema).refine(
      (tasks) => {
        if (!tasks || tasks.length === 0) return true;
        const ids = new Set(tasks.map((t) => t.id));
        return ids.size === tasks.length;
      },
      { message: 'Duplicate tasks are not allowed.' },
    ),
    notifications: z
      .object({
        isNotifyToKomu: z.boolean().default(false),
        komuChannelId: z.string().optional(),
        isNoticeKMSubmitTS: z.boolean().default(false),
        isNoticeKMRequestOffDate: z.boolean().default(false),
        isNoticeKMApproveRequestOffDate: z.boolean().default(false),
        isNoticeKMRequestChangeWorkingTime: z.boolean().default(false),
        isNoticeKMApproveChangeWorkingTime: z.boolean().default(false),
      })
      .refine((data) => !data.isNotifyToKomu || !!data.komuChannelId?.trim(), {
        message: 'Komu Channel Id is required when notifications are enabled.',
        path: ['komuChannelId'],
      }),
  })
  .superRefine((obj, ctx) => {
    const { timeStart, timeEnd } = obj as {
      timeStart?: string;
      timeEnd?: string | undefined;
    };
    if (timeEnd !== undefined && timeStart) {
      const s = new Date(timeStart).getTime();
      const e = new Date(timeEnd).getTime();
      if (Number.isNaN(s) || Number.isNaN(e) || e < s) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be earlier than start date',
          path: ['timeEnd'],
        });
      }
    }
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;
