import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotificationCheckbox } from './components/NotificationCheckbox';
import { NOTIFICATION_OPTIONS } from '@/constants/constants';
import { useOutletContext } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '@/validations/project.schema';

export const Notifications: React.FC = () => {
  const { form } = useOutletContext<{
    form: UseFormReturn<ProjectFormValues>;
  }>();
  const notifications =
    form.watch('notifications') || ({} as ProjectFormValues['notifications']);

  const handleCheckedChange = (
    id: keyof ProjectFormValues['notifications'],
    checked: boolean,
  ) => {
    form.setValue(
      'notifications',
      { ...notifications, [id]: checked },
      { shouldValidate: true, shouldDirty: true },
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="komuChannelId" className="text-sm">
          Komu Channel Id
        </Label>
        <Input
          id="komuChannelId"
          value={notifications.komuChannelId ?? ''}
          onChange={(e) =>
            form.setValue(
              'notifications',
              { ...notifications, komuChannelId: e.target.value },
              { shouldValidate: true, shouldDirty: true },
            )
          }
          placeholder="Enter Komu channel id"
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        {NOTIFICATION_OPTIONS.map(({ id, label }) => (
          <NotificationCheckbox
            key={id}
            id={id}
            label={label}
            checked={!!notifications[id]}
            onCheckedChange={(checked) => handleCheckedChange(id, checked)}
          />
        ))}
      </div>
    </div>
  );
};
