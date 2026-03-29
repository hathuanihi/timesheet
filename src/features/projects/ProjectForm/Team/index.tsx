import React, { useMemo, useState, useCallback } from 'react';
import { AddMemberModal } from './components/AddMemberModal';
import { Button } from '@/components/ui/button';
import { IUserResponse } from '@/types/user.type';
import { MemberItems } from './components/MemberItems';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ERole } from '@/constants/constants';
import { useOutletContext } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '@/validations/project.schema';
import useModal from '@/hooks/useModal';

type SelectedUser = IUserResponse & { role: ERole; tempType: boolean };

export const Team: React.FC = () => {
  const { isOpen, toggleModal } = useModal();
  const { form } = useOutletContext<{
    form: UseFormReturn<ProjectFormValues>;
  }>();

  const selectedUsers = form.watch('teamSelections') as
    | SelectedUser[]
    | undefined;
  const teamList: SelectedUser[] = useMemo(
    () => (selectedUsers || []) as SelectedUser[],
    [selectedUsers],
  );
  const [activeChecked, setActiveChecked] = useState(false);
  const [inactiveChecked, setInactiveChecked] = useState(false);

  const filteredSelectedUsers = useMemo(() => {
    return teamList.filter((u) => {
      if (!activeChecked && !inactiveChecked) {
        return true;
      } else if (activeChecked && !inactiveChecked) {
        if (!u.isActive) return false;
      } else if (!activeChecked && inactiveChecked) {
        if (u.isActive) return false;
      }
      return true;
    });
  }, [teamList, activeChecked, inactiveChecked]);

  const handleActiveChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      setActiveChecked(checked === true);
    },
    [],
  );

  const handleInactiveChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      setInactiveChecked(checked === true);
    },
    [],
  );

  const handleRoleChange = useCallback(
    (userId: number, role: ERole) => {
      const next = teamList.map((x) => (x.id === userId ? { ...x, role } : x));
      form.setValue('teamSelections', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form, teamList],
  );

  const handleTempTypeChange = useCallback(
    (userId: number, temp: boolean) => {
      const next = teamList.map((x) =>
        x.id === userId ? { ...x, tempType: temp } : x,
      );
      form.setValue('teamSelections', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form, teamList],
  );

  const handleRemoveUser = useCallback(
    (userId: number) => {
      const next = teamList.filter((x) => x.id !== userId);
      form.setValue('teamSelections', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form, teamList],
  );

  const handleSelectUser = useCallback(
    (user: IUserResponse) => {
      const exists = teamList.some((x) => x.id === user.id);
      if (exists) return;
      const isFirst = teamList.length === 0;
      const withMeta: SelectedUser = {
        ...user,
        role: isFirst ? ERole.PM : ERole.Member,
        tempType: false,
      };
      const next = [...teamList, withMeta];
      form.setValue('teamSelections', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form, teamList],
  );

  const handleUnselectUser = useCallback(
    (user: IUserResponse) => {
      const next = teamList.filter((x) => x.id !== user.id);
      form.setValue('teamSelections', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form, teamList],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-active"
              checked={activeChecked}
              onCheckedChange={handleActiveChange}
            />
            <Label htmlFor="filter-active">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-inactive"
              checked={inactiveChecked}
              onCheckedChange={handleInactiveChange}
            />
            <Label htmlFor="filter-inactive">Inactive</Label>
          </div>
        </div>

        <Button onClick={toggleModal}>Add Member</Button>
      </div>
      {filteredSelectedUsers.length > 0 && (
        <div className="rounded-md border bg-background p-3 mb-4">
          <h3 className="text-sm font-medium mb-2">Selected Members</h3>
          <ul className="space-y-2">
            {filteredSelectedUsers.map((u) => (
              <MemberItems
                key={u.id}
                user={u}
                selectedMode
                role={u.role}
                tempType={u.tempType}
                onRoleChange={handleRoleChange}
                onTempTypeChange={handleTempTypeChange}
                onRemove={handleRemoveUser}
              />
            ))}
          </ul>
        </div>
      )}
      <AddMemberModal
        open={isOpen}
        onOpenChange={toggleModal}
        onSelect={handleSelectUser}
        selectedUsers={teamList}
        onUnselect={handleUnselectUser}
      />
    </div>
  );
};
