import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import logo_register from '../../assets/images/logo-register.png';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await authService.requestPasswordRecovery(email);
            setMessage(response.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err &&
                err.response && typeof err.response === 'object' && 'data' in err.response &&
                err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                const errorMessage = err.response.data.message;
                setError(Array.isArray(errorMessage)
                    ? errorMessage.join(', ')
                    : String(errorMessage));
            } else {
                console.log(err);
                setError('Erro ao solicitar recuperação de senha. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
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
                        Recuperar Senha
                    </h1>
                    <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center drop-shadow">
                        Digite seu email para receber as instruções de recuperação
                    </h1>

                    {message && (
                        <div className="mt-4 p-3 text-sm text-green-700 bg-green-100 rounded-md text-center drop-shadow">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 rounded-md text-center drop-shadow">
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
                                placeholder="Digite seu e-mail"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-red-900 p-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-slate-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-50"
                            >
                                {loading ? 'Enviando...' : 'Enviar Instruções'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                        <p className="drop-shadow">
                            Lembrou sua senha?{' '}
                            <Link to="/login" className="text-black hover:underline drop-shadow-md">
                                Voltar para o login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 