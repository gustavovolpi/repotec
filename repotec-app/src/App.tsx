import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { router } from './routes';
import { useEffect } from 'react';
import './App.css'

function App() {
  // useEffect(() => {
  //   localStorage.clear();
  // }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
