import './App.css';
import AppRoute from './routes/AppRoute';
import { Toaster } from '@/components/ui/sonner';

function App(): JSX.Element {
  return (
    <>
      <AppRoute />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}

export default App;
