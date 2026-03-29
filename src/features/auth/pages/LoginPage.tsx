import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ShieldUser } from 'lucide-react';
import { AppDispatch } from '@/stores/store';
import { login } from '@/stores/slices/authSlice';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { removeItem } from '@/utils/localStorage';
import { getErrorMessage } from '@/utils/errorHandler';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [generalError, setGeneralError] = useState<string | null>(null);

  type FormValues = {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      userNameOrEmailAddress: '',
      password: '',
      rememberClient: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setGeneralError(null);
    try {
      const token = await authService.loginAPI({
        userNameOrEmailAddress: values.userNameOrEmailAddress,
        password: values.password,
        rememberClient: values.rememberClient,
      });

      const user = await authService.fetchCurrentUserAPI();

      dispatch(login({ token, user, rememberClient: values.rememberClient }));
      const redirectParam = searchParams.get('redirectTo');
      const redirectTo = redirectParam
        ? decodeURIComponent(redirectParam)
        : '/';
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      removeItem('access_token');
      setGeneralError(getErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <main className="bg-gradient-to-r from-emerald-400 to-cyan-400 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 border rounded-md bg-white shadow-md">
        <div className="flex justify-center mb-4">
          <ShieldUser className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-semibold">Username</label>
            <Input
              aria-invalid={!!errors.userNameOrEmailAddress || undefined}
              placeholder="Username"
              {...register('userNameOrEmailAddress', {
                required: 'Please enter username',
              })}
            />
            {errors.userNameOrEmailAddress && (
              <p className="text-red-600 text-xs mt-1">
                {errors.userNameOrEmailAddress.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Password</label>
            <Input
              type="password"
              aria-invalid={!!errors.password || undefined}
              placeholder="Password"
              {...register('password', {
                required: 'Please enter password',
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {generalError && (
            <Alert
              variant="destructive"
              className="border-red-600/50 text-red-600"
            >
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Controller
                name="rememberClient"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    checked={value}
                    onCheckedChange={(v) => onChange(Boolean(v))}
                  />
                )}
              />
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            className="w-full p-4 mt-5"
            disabled={isSubmitting}
          >
            <span className="font-bold text-xl">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </span>
          </Button>
        </form>
      </div>
    </main>
  );
};