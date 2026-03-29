import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsersAPI } from '@/services/user.service';
import { IUserResponse } from '@/types/user.type';
import { getErrorMessage } from '@/utils/errorHandler';
import { MemberItems } from './MemberItems';
import { RenderListOfItems } from '@/features/projects/components/RenderListOfItems';

type MemberListProps = {
  emailQuery?: string;
  branchQuery?: string;
  type?: number | null;
  onSelect?: (user: IUserResponse) => void;
  onUnselect?: (user: IUserResponse) => void;
  selectedUsers?: IUserResponse[];
};

export const MemberList: React.FC<MemberListProps> = ({
  emailQuery = '',
  branchQuery = '',
  type = null,
  onSelect,
  onUnselect,
  selectedUsers = [],
}) => {
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllUsersAPI();
        setUsers(res ?? []);
      } catch (e: unknown) {
        setError(getErrorMessage(e, 'Failed to load users'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedUserIds = useMemo(
    () => new Set(selectedUsers.map((u) => u.id)),
    [selectedUsers],
  );
  const filtered = useMemo(() => {
    const query = emailQuery.trim().toLowerCase();
    const branchId = branchQuery ? Number(branchQuery) : null;
    return users.filter((u) => {
      if (
        query &&
        !(
          u.emailAddress?.toLowerCase().includes(query) ||
          u.name?.toLowerCase().includes(query)
        )
      ) {
        return false;
      }
      if (branchId !== null && u.branchId !== branchId) return false;
      if (type !== null && u.positionId !== type) return false;
      return true;
    });
  }, [users, emailQuery, branchQuery, type]);

  return (
    <RenderListOfItems<IUserResponse>
      variant="list"
      loading={loading}
      error={error}
      isPending={false}
      items={filtered}
      itemToValue={(u) => String(u.id)}
      itemToKey={(u) => u.id}
      renderItem={(u) => (
        <MemberItems
          as="div"
          user={u}
          onSelect={onSelect}
          onUnselect={onUnselect}
          isSelected={selectedUserIds.has(u.id)}
        />
      )}
      emptyText="No data"
      errorPrefix="Error"
    />
  );
};

export default MemberList;
