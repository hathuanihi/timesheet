import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { IUserResponse } from '@/types/user.type';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ERole, TEMP_TYPE_OPTIONS } from '@/constants/constants';
import { X, Check } from 'lucide-react';

type Props = {
  user: IUserResponse;
  onSelect?: (user: IUserResponse) => void;
  onUnselect?: (user: IUserResponse) => void;
  selectedMode?: boolean;
  isSelected?: boolean;
  role?: ERole;
  tempType?: boolean;
  onRoleChange?: (userId: number, role: ERole) => void;
  onTempTypeChange?: (userId: number, temp: boolean) => void;
  onRemove?: (userId: number) => void;
  as?: 'li' | 'div';
};

const roleOptions = [
  { value: ERole.Member, label: 'Member' },
  { value: ERole.PM, label: 'PM' },
  { value: ERole.Shadow, label: 'Shadow' },
  { value: ERole.Deactive, label: 'Deactive' },
];

export const MemberItems: React.FC<Props> = React.memo(
  ({
    user,
    onSelect,
    onUnselect,
    selectedMode = false,
    isSelected = false,
    role,
    tempType,
    onRoleChange,
    onTempTypeChange,
    onRemove,
    as: Wrapper = 'li',
  }) => {
    const [imgError, setImgError] = useState(false);
    const clickable = Boolean(onSelect || onUnselect) && !selectedMode;

    const handleClick = useCallback(() => {
      if (!clickable) return;
      if (isSelected) {
        onUnselect?.(user);
      } else {
        onSelect?.(user);
      }
    }, [clickable, isSelected, onSelect, onUnselect, user]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.(user.id);
      },
      [onRemove, user.id],
    );

    const handleImageError = useCallback(() => {
      setImgError(true);
    }, []);

    const handleRoleChange = useCallback(
      (value: string) => {
        onRoleChange?.(user.id, Number(value) as ERole);
      },
      [onRoleChange, user.id],
    );

    const handleTempTypeChange = useCallback(
      (value: string) => {
        onTempTypeChange?.(user.id, value === 'true');
      },
      [onTempTypeChange, user.id],
    );

    const wrapperClassName = useMemo(
      () =>
        cn('flex items-center gap-4 p-3 rounded-md border transition-colors', {
          'bg-sky-50 border-sky-200 hover:bg-sky-100': isSelected,
          'border-gray-200 hover:bg-gray-50': !isSelected,
          'cursor-pointer': clickable,
          'cursor-default': !clickable,
        }),
      [isSelected, clickable],
    );

    return (
      <Wrapper
        className={wrapperClassName}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? handleKeyDown : undefined}
      >
        {isSelected && !selectedMode && (
          <Check className="h-5 w-5 text-green-600 ml-auto shrink-0" />
        )}
        {selectedMode && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleRemove}
            aria-label={`Remove ${user.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {user.avatarFullPath && !imgError ? (
          <img
            src={user.avatarFullPath}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{user.name}</div>
          <div className="text-sm text-gray-500 truncate">
            {user.emailAddress}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.branchDisplayName && (
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              {user.branchDisplayName}
            </span>
          )}
          {user.positionName && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {user.positionName}
            </span>
          )}
        </div>

        {selectedMode && (
          <div className="ml-auto flex items-center gap-6">
            <Select
              value={role !== undefined ? String(role) : undefined}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-[120px] border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={tempType !== undefined ? String(tempType) : undefined}
              onValueChange={handleTempTypeChange}
            >
              <SelectTrigger className="w-[120px] border-0 border-b border-gray-300 rounded-none px-0 text-blue-600 focus:ring-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {TEMP_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={String(t.value)} value={String(t.value)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Wrapper>
    );
  },
);
