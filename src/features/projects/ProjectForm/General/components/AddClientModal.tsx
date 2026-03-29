import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createCustomerAPI } from '@/services/customer.service';
import { getErrorMessage } from '@/utils/errorHandler';
import {
  addClientSchema,
  type AddClientValues,
} from '@/validations/customer.schema';
import { toast } from 'sonner';

type AddClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onOpenChange,
  onCreated,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<AddClientValues>({
    resolver: zodResolver(addClientSchema),
    mode: 'onBlur',
    defaultValues: { name: '', code: '', address: '' },
  });

  const handleClose = () => onOpenChange(false);

  const onSubmit = async (values: AddClientValues) => {
    setSubmitting(true);
    try {
      await createCustomerAPI({
        name: values.name.trim(),
        code: values.code.trim(),
        address: values.address?.trim() || '',
      });
      toast.success('Client created');
      form.reset({ name: '', code: '', address: '' });
      if (open) handleClose();
      onCreated?.();
    } catch (e) {
      const msg = getErrorMessage(e, 'Failed to create customer');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o !== open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 items-start gap-3">
            <label className="col-span-3 text-sm">Name*</label>
            <div className="col-span-9 space-y-1">
              <Input placeholder="Client name" {...form.register('name')} />
            </div>
          </div>

          <div className="grid grid-cols-12 items-start gap-3">
            <label className="col-span-3 text-sm">Code*</label>
            <div className="col-span-9 space-y-1">
              <Input placeholder="Client code" {...form.register('code')} />
            </div>
          </div>

          <div className="grid grid-cols-12 items-start gap-3">
            <label className="col-span-3 text-sm">Address</label>
            <div className="col-span-9 space-y-1">
              <Textarea
                rows={3}
                placeholder="Client address"
                {...form.register('address')}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || submitting}
              >
                {submitting ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
