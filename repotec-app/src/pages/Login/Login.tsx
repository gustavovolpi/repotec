import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import logo_register from '../../assets/images/logo-register.png'

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, senha);
      navigate('/');
    } catch (error) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          {/* Logo com sombra suave */}
          <img src={logo_register} alt="Logo" className="w-32 h-32 mx-auto drop-shadow-lg" />
          {/* Títulos com sombra de texto */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900 drop-shadow-md">
            RepoTEC
          </h2>
          <p className="mt-2 text-gray-600 drop-shadow">
            Repositório de Projetos Técnicos
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          {/* Títulos com sombra */}
          <h1 className="text-3xl font-semibold mb-6 text-black text-center drop-shadow-md">
            Login
          </h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center drop-shadow">
            Acesse o repositório de projetos técnicos da sua instituição
          </h1>


          {error && (
            <div className="mt-4 text-sm text-red-600 text-center drop-shadow">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 drop-shadow">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 drop-shadow">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-white text-red-900 p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-slate-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 shadow-md hover:shadow-lg active:shadow-sm"
              >
                Entrar
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600 text-center">
            <p className="drop-shadow">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-black hover:underline drop-shadow-md">
                Registre-se aqui
              </Link>
            </p>
            <p className="drop-shadow mt-2">
              Esqueceu sua senha?{' '}
              <Link to="/recuperar-senha" className="text-black hover:underline drop-shadow-md">
                Recupere aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
