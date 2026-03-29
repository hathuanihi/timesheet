import { ICreateEditProjectType } from '@/types/project.type';
import { ITaskResponse } from '@/types/task.type';
import { IUserResponse } from '@/types/user.type';
import { ProjectFormValues } from '@/validations/project.schema';

export function mapFormDataToApiPayload(
  data: ProjectFormValues,
): ICreateEditProjectType {
  return {
    name: data.projectName,
    code: data.projectCode,
    status: 0,
    timeStart: new Date(data.timeStart).toISOString(),
    timeEnd: data.timeEnd ? new Date(data.timeEnd).toISOString() : '',
    note: data.note ?? '',
    projectType: data.projectType,
    customerId: data.clientId || null,
    isAllUserBelongTo: data.autoAddUser,
    tasks: data.taskSelections.map((t) => ({
      taskId: t.id,
      billable: true,
      id: 0,
    })),
    users: data.teamSelections.map((u) => ({
      userId: u.id,
      type: u.role,
      isTemp: u.tempType,
      id: 0,
    })),
    projectTargetUsers: data.teamSelections.map((u) => ({
      userId: u.id,
      roleName: u.roleName ?? '',
      id: 0,
    })),
    komuChannelId: data.notifications.komuChannelId ?? '',
    isNotifyToKomu: data.notifications.isNotifyToKomu,
    isNoticeKMSubmitTS: data.notifications.isNoticeKMSubmitTS,
    isNoticeKMRequestOffDate: data.notifications.isNoticeKMRequestOffDate,
    isNoticeKMApproveRequestOffDate:
      data.notifications.isNoticeKMApproveRequestOffDate,
    isNoticeKMRequestChangeWorkingTime:
      data.notifications.isNoticeKMRequestChangeWorkingTime,
    isNoticeKMApproveChangeWorkingTime:
      data.notifications.isNoticeKMApproveChangeWorkingTime,
  };
}

export function mapApiResponseToFormData(
  data: ICreateEditProjectType,
  allTasks: ITaskResponse[],
  allUsers: IUserResponse[],
): ProjectFormValues {
  const userMap = new Map(allUsers.map((u) => [u.id, u]));
  const taskMap = new Map(allTasks.map((t) => [t.id, t]));

  const teamSelections = (data.users || []).map((projUser) => {
    const fullUser = userMap.get(projUser.userId);
    const targetInfo = data.projectTargetUsers?.find(
      (t) => t.userId === projUser.userId,
    );

    const base = fullUser ?? {
      id: projUser.userId,
      name: 'Unknown User',
      emailAddress: '',
      isActive: true,
      type: projUser.type,
      jobTitle: '',
      level: '',
      userCode: '',
      avatarPath: '',
      avatarFullPath: '',
      branch: '',
      branchColor: '',
      branchDisplayName: '',
      branchId: 0,
      positionId: null,
      positionName: null,
    };

    return {
      id: Number(base.id),
      name: String(base.name ?? ''),
      emailAddress: String(base.emailAddress ?? ''),
      isActive: Boolean(base.isActive),
      type: Number(base.type ?? projUser.type ?? 0),
      jobTitle: base.jobTitle ?? '',
      level: base.level ?? '',
      userCode: base.userCode ?? '',
      avatarPath: base.avatarPath ?? '',
      avatarFullPath: base.avatarFullPath ?? '',
      branch:
        base.branch === null || base.branch === undefined
          ? ''
          : String(base.branch),
      branchColor: base.branchColor ?? '',
      branchDisplayName: base.branchDisplayName ?? '',
      branchId:
        typeof base.branchId === 'number'
          ? base.branchId
          : Number(base.branchId ?? 0),
      positionId:
        base.positionId === undefined
          ? null
          : (base.positionId as number | null),
      positionName: base.positionName ?? null,
      role: projUser.type ?? 0,
      tempType: Boolean(projUser.isTemp),
      roleName: targetInfo?.roleName ?? '',
    };
  });

  const taskSelections = (data.tasks || []).map((projTask) => {
    const fullTask = taskMap.get(projTask.taskId);
    return (
      fullTask ?? {
        id: projTask.taskId,
        name: 'Unknown Task',
        type: 1,
        isDeleted: false,
      }
    );
  });

  return {
    clientId: data.customerId ?? 0,
    projectName: data.name,
    projectCode: data.code,
    projectType: data.projectType,
    timeStart: data.timeStart,
    timeEnd: data.timeEnd ?? '',
    note: data.note,
    autoAddUser: data.isAllUserBelongTo,
    teamSelections,
    taskSelections,
    notifications: {
      isNotifyToKomu: data.isNotifyToKomu ?? false,
      komuChannelId: data.komuChannelId ?? '',
      isNoticeKMSubmitTS: data.isNoticeKMSubmitTS ?? false,
      isNoticeKMRequestOffDate: data.isNoticeKMRequestOffDate ?? false,
      isNoticeKMApproveRequestOffDate: data.isNoticeKMApproveRequestOffDate ?? false,
      isNoticeKMRequestChangeWorkingTime:
        data.isNoticeKMRequestChangeWorkingTime ?? false,
      isNoticeKMApproveChangeWorkingTime:
        data.isNoticeKMApproveChangeWorkingTime ?? false,
    },
  };
}
