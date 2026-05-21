import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { store } from './app/store';
import { router } from './router';
import { AuthProvider } from './auth/context';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        
          <RouterProvider router={router} />
       
      </AuthProvider>
    </Provider>
  );
}
