import {
  createBrowserRouter,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import ProjetoDetalhe from '../pages/Projetos/ProjetoDetalhe';
import Usuarios from '../pages/Usuarios/Usuarios';
import Perfil from '../pages/Perfil/Perfil';
import EditarPerfil from '../pages/Perfil/EditarPerfil';
import Register from '../pages/Register/Register';
import ProjetoNovo from '../pages/Projetos/ProjetoNovo';
import Favoritos from '../pages/Favoritos/Favoritos';
import FAQ from '../pages/FAQ/FAQ';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import Dominios from '../pages/Dominios/Dominios';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/recuperar-senha',
    element: <ForgotPassword />,
  },
  {
    path: '/redefinir-senha',
    element: <ResetPassword />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/projetos/novo',
    element: (
      <PrivateRoute>
        <ProjetoNovo />
      </PrivateRoute>
    ),
  },
  {
    path: '/projetos/:id',
    element: (
      <PrivateRoute>
        <ProjetoDetalhe />
      </PrivateRoute>
    ),
  },
  {
    path: '/usuarios',
    element: (
      <PrivateRoute>
        <Usuarios />
      </PrivateRoute>
    ),
  },
  {
    path: '/dominios',
    element: (
      <PrivateRoute>
        <Dominios />
      </PrivateRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <PrivateRoute>
        <Perfil />
      </PrivateRoute>
    ),
  },
  {
    path: '/perfil/editar',
    element: (
      <PrivateRoute>
        <EditarPerfil />
      </PrivateRoute>
    ),
  },
  {
    path: '/favoritos',
    element: (
      <PrivateRoute>
        <Favoritos />
      </PrivateRoute>
    ),
  },
  {
    path: '/faq',
    element: (
      <PrivateRoute>
        <FAQ />
      </PrivateRoute>
    ),
  },
]); 