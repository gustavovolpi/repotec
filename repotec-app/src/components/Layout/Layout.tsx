import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar, toggleMobileMenu, setMobile } from '../../store/slices/uiSlice';
import {
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  QuestionMarkCircleIcon,
  HeartIcon,
  UsersIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import { TipoUsuario, tipoUsuarioLabels } from '../../types/usuario.types';
import { getImagemUrl } from '../../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const { sidebarExpanded, mobileMenuOpen, isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      dispatch(setMobile(window.innerWidth < 1024));
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [dispatch]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Definição da navegação
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Favoritos', href: '/favoritos', icon: HeartIcon },
    { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
    ...(user?.tipo === 'admin' ? [
      { name: 'Usuários', href: '/usuarios', icon: UsersIcon },
      { name: 'Domínios', href: '/dominios', icon: EnvelopeIcon }
    ] : []),
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed top-0 z-40 w-full bg-white shadow transition-all duration-300 ease-in-out ${isMobile ? 'lg:ml-[60px]' : sidebarExpanded ? 'lg:ml-60' : 'lg:ml-[60px]'}`}>
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">RepoTEC</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/perfil" className="flex items-center gap-2">
              {user?.imagemPerfil?.url ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.imagemPerfil.url}
                  alt=""
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.nome}</p>
                <p className="text-xs text-gray-500">{user?.tipo ? tipoUsuarioLabels[user.tipo as TipoUsuario] : ''}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 min-w-[120px]"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar para desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col
          ${mobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full'} 
          ${!isMobile && (sidebarExpanded ? 'w-60' : 'w-[60px]')}`}
      >
        {/* Logo e Toggle */}
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/" className={`${!sidebarExpanded && !mobileMenuOpen && 'hidden'}`}>
            <h1 className="text-xl font-bold text-gray-900">RepoTEC</h1>
          </Link>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
              >
                <ArrowLeftIcon className={`h-5 w-5 transition-transform ${!sidebarExpanded && 'rotate-180'}`} />
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => isMobile && dispatch(toggleMobileMenu())}
              className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${location.pathname === item.href
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon className={`h-5 w-5 ${location.pathname === item.href ? 'text-gray-900' : 'text-gray-400'}`} />
              {(sidebarExpanded || mobileMenuOpen) && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Perfil do Usuário */}
        <div className={`border-t border-gray-200 p-4 ${!sidebarExpanded && !mobileMenuOpen ? 'items-center' : ''}`}>
          <Link to="/perfil" onClick={() => isMobile && dispatch(toggleMobileMenu())} className="flex items-center">
            <div className="flex-shrink-0">
              {user?.imagemPerfil?.url ? (
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.imagemPerfil.url}
                  alt=""
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            {(sidebarExpanded || mobileMenuOpen) && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.nome}</p>
                <p className="text-xs text-gray-500">{user?.tipo ? tipoUsuarioLabels[user.tipo as TipoUsuario] : ''}</p>
              </div>
            )}
          </Link>

          {(sidebarExpanded || mobileMenuOpen) && (
            <div className="mt-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay para mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => dispatch(toggleMobileMenu())}
        />
      )}

      {/* Main content */}
      <main className={`pt-14 transition-all duration-300 ease-in-out ${isMobile ? 'lg:ml-[60px]' : sidebarExpanded ? 'lg:ml-60' : 'lg:ml-[60px]'}`}>
        {children}
      </main>
    </div>
  );
}
