import { mapApiResponseToFormData, mapFormDataToApiPayload } from './projectSliceHelpers';
type ProjectFormValues = any;

describe('projectSliceHelpers', () => {
  const baseForm: ProjectFormValues = {
    clientId: 12,
    projectName: 'My Project',
    projectCode: 'MP-01',
    projectType: 2,
    timeStart: '2025-10-01T00:00:00.000Z',
    timeEnd: '2025-10-31T00:00:00.000Z',
    note: 'notes',
    autoAddUser: true,
    teamSelections: [
      { id: 1, name: 'HaThu', emailAddress: 'hathu@x.com', isActive: true, type: 0, jobTitle: '', level: '', userCode: '', avatarPath: '', avatarFullPath: '', branch: '', branchColor: '', branchDisplayName: '', branchId: 0, positionId: null, positionName: null, role: 1, tempType: false, roleName: 'Dev' },
    ],
    taskSelections: [
      { id: 10, name: 'Task A', type: 1, isDeleted: false },
    ],
    notifications: {
      isNotifyToKomu: true,
      komuChannelId: 'chan-1',
      isNoticeKMSubmitTS: true,
      isNoticeKMRequestOffDate: false,
      isNoticeKMApproveRequestOffDate: false,
      isNoticeKMRequestChangeWorkingTime: false,
      isNoticeKMApproveChangeWorkingTime: true,
    },
    projectCodeReadonly: false,
    taskSelectionReadonly: false,
  } as unknown as ProjectFormValues;

  it('mapFormDataToApiPayload should map form values to API payload correctly', () => {
    const payload = mapFormDataToApiPayload(baseForm);

    expect(payload.name).toBe(baseForm.projectName);
    expect(payload.code).toBe(baseForm.projectCode);
    expect(payload.customerId).toBe(baseForm.clientId);
    expect(new Date(payload.timeStart).toISOString()).toBe(new Date(baseForm.timeStart).toISOString());
    expect(new Date(payload.timeEnd as string).toISOString()).toBe(new Date(baseForm.timeEnd as string).toISOString());
    expect(payload.tasks).toHaveLength(1);
    expect(payload.tasks[0].taskId).toBe(10);
    expect(payload.users).toHaveLength(1);
    expect(payload.users[0].userId).toBe(1);
    expect(payload.komuChannelId).toBe('chan-1');
    expect(payload.isNotifyToKomu).toBe(true);
  });

  it('mapApiResponseToFormData should map api response to form values and fallback unknowns', () => {
    const apiData: any = {
      name: 'API Project',
      code: 'API-1',
      projectType: 3,
      timeStart: '2025-09-01T00:00:00.000Z',
      timeEnd: null,
      note: 'from api',
      isAllUserBelongTo: false,
      customerId: 99,
      tasks: [{ taskId: 20 }],
      users: [{ userId: 2, type: 5, isTemp: true }],
      projectTargetUsers: [{ userId: 2, roleName: 'QA' }],
      komuChannelId: '',
      isNotifyToKomu: false,
    };

    const allTasks: any[] = [{ id: 10, name: 'Task A', type: 1, isDeleted: false }];
    const allUsers: any[] = [{ id: 1, name: 'HaThu' }];

    const form = mapApiResponseToFormData(apiData, allTasks, allUsers);

    expect(form.clientId).toBe(99);
    expect(form.projectName).toBe('API Project');
    expect(form.timeStart).toBe(apiData.timeStart);
    expect(form.timeEnd).toBe('');
    expect(form.taskSelections).toHaveLength(1);
    expect(form.taskSelections[0].id).toBe(20);
    expect(form.teamSelections).toHaveLength(1);
    expect(form.teamSelections[0].id).toBe(2);
    expect(form.teamSelections[0].roleName).toBe('QA');
  });
});
