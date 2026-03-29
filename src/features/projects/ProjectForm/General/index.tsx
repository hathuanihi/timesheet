import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { UseFormReturn } from 'react-hook-form';
import type { AppDispatch } from '@/stores/store';
import { ProjectFormValues } from '@/validations/project.schema';
import useModal from '@/hooks/useModal';
import { updateProjectForm } from '@/stores/slices/projectSlice';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DateInputGroup } from '@/components/ui/DateInputGroup';
import { ClientSelector } from './components/ClientSelector';
import ProjectTypeSelect from './components/ProjectTypeSelect';
import { AddClientModal } from './components/AddClientModal';

export const General: React.FC = () => {
  const { isOpen, toggleModal } = useModal();
  const { form } = useOutletContext<{
    form: UseFormReturn<ProjectFormValues>;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const [clientReloadKey, setClientReloadKey] = useState(0);

  useEffect(() => {
    return () => {
      const final = form.getValues();
      dispatch(updateProjectForm(final));
    };
  }, [form, dispatch]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-5 mt-8">
          {/* Client */}
          <Form.Field
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-start gap-3">
                <Form.Label className="col-span-2 text-right">
                  Client*
                </Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <ClientSelector
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      onAddClientClick={toggleModal}
                      reloadKey={clientReloadKey}
                      error={
                        form.formState.errors.clientId?.message as
                          | string
                          | undefined
                      }
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />

          {/* Project Name */}
          <Form.Field
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-start gap-3">
                <Form.Label className="col-span-2 text-right">
                  Project Name*
                </Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <Input
                      placeholder="Project name"
                      error={form.formState.errors.projectName?.message}
                      {...field}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />

          {/* Project Code */}
          <Form.Field
            control={form.control}
            name="projectCode"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-start gap-3">
                <Form.Label className="col-span-2 text-right">
                  Project Code*
                </Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <Input
                      placeholder="Project code"
                      error={form.formState.errors.projectCode?.message}
                      {...field}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />

          {/* Date */}
          <Form.Field
            control={form.control}
            name="timeStart"
            render={() => {
              const startError = form.formState.errors.timeStart?.message as
                | string
                | undefined;
              const endError = form.formState.errors.timeEnd?.message as
                | string
                | undefined;

              return (
                <Form.Item className="grid grid-cols-12 items-start gap-3">
                  <Form.Label
                    className={`col-span-2 text-right ${
                      endError ? 'text-destructive' : ''
                    }`}
                  >
                    Date*
                  </Form.Label>
                  <div className="col-span-10">
                    <Form.Control>
                      <DateInputGroup
                        value={{
                          from: form.watch('timeStart'),
                          to: form.watch('timeEnd'),
                        }}
                        onChange={(range) => {
                          form.setValue('timeStart', range?.from ?? '');
                          form.setValue('timeEnd', range?.to ?? '');
                        }}
                        startError={startError}
                        endError={endError}
                      />
                    </Form.Control>
                  </div>
                </Form.Item>
              );
            }}
          />

          {/* Notes */}
          <Form.Field
            control={form.control}
            name="note"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-start gap-3 pb-3">
                <Form.Label className="col-span-2 text-right">Note</Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <Textarea placeholder="Notes" rows={3} {...field} />
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />

          {/* Auto add user */}
          <Form.Field
            control={form.control}
            name="autoAddUser"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-center gap-3 pb-3">
                <Form.Label className="col-span-2 text-right">
                  All Users
                </Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <label className="inline-flex items-center gap-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                      <span className="text-sm">
                        Auto add user as a member of this project when creating
                        new user
                      </span>
                    </label>
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />

          {/* Project Type */}
          <Form.Field
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <Form.Item className="grid grid-cols-12 items-start gap-3 pb-3">
                <Form.Label className="col-span-2 text-right">
                  Project Type*
                </Form.Label>
                <div className="col-span-10">
                  <Form.Control>
                    <ProjectTypeSelect
                      value={field.value as unknown as number | undefined}
                      onChange={(v) => field.onChange(v)}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )}
          />
        </form>
      </Form>
      <AddClientModal
        open={isOpen}
        onOpenChange={(o) => {
          if (o !== isOpen) toggleModal();
        }}
        onCreated={() => setClientReloadKey((k) => k + 1)}
      />
    </>
  );
};