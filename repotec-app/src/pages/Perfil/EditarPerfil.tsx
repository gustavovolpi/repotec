import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { perfilService } from '../../services/perfil.service';
import { Usuario } from '../../services/usuarios.service';
import { AxiosError } from 'axios';
import { getImagemUrl } from '../../services/api';

export default function EditarPerfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [previewImagem, setPreviewImagem] = useState<string>('');
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário está autenticado
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const user = authService.getCurrentUser();
        if (user) {
            setUsuario(user);
            setNome(user.nome);
            setEmail(user.email);
            if (user.imagemPerfil?.url) {
                setPreviewImagem(getImagemUrl(user.imagemPerfil.url));
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagem(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImagem(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validarSenhas = () => {
        setErroSenha(null);

        // Verifica se as senhas estão preenchidas
        if (senhaAtual && (!novaSenha || !confirmarSenha)) {
            setErroSenha('Preencha todos os campos de senha');
            return false;
        }

        // Verifica se as senhas novas são iguais
        if (novaSenha !== confirmarSenha) {
            setErroSenha('As senhas não coincidem');
            return false;
        }

        // Verifica se a nova senha tem pelo menos 6 caracteres
        if (novaSenha && novaSenha.length < 6) {
            setErroSenha('A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setMensagem(null);
        setErroSenha(null);

        // Valida as senhas se algum campo de senha estiver preenchido
        if (senhaAtual || novaSenha || confirmarSenha) {
            if (!validarSenhas()) {
                setCarregando(false);
                return;
            }
        }

        try {
            // Verifica se o usuário está autenticado
            if (!authService.isAuthenticated()) {
                setMensagem({ tipo: 'erro', texto: 'Sessão expirada. Por favor, faça login novamente.' });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                return;
            }

            console.log('Atualizando perfil...');
            // Atualizar dados do perfil
            const dadosAtualizados = await perfilService.atualizarPerfil({
                nome,
                email,
            });
            console.log('Perfil atualizado com sucesso!');

            // Se houver nova imagem, fazer upload
            if (imagem) {
                console.log('Fazendo upload da nova imagem...');
                const usuarioComFoto = await perfilService.uploadFotoPerfil(imagem);
                console.log('Foto carregada com sucesso!');
                authService.updateUser(usuarioComFoto);
            } else {
                console.log('Não há nova imagem para upload.');
                authService.updateUser(dadosAtualizados);
            }

            // Se houver alteração de senha, atualizar a senha
            if (senhaAtual && novaSenha) {
                console.log('Atualizando senha...');
                try {
                    await perfilService.alterarSenha(senhaAtual, novaSenha);
                    console.log('Senha atualizada com sucesso!');
                    setMensagem({ tipo: 'sucesso', texto: 'Perfil e senha atualizados com sucesso!' });
                } catch (error) {
                    console.error('Erro ao atualizar senha:', error);
                    if (error instanceof AxiosError && error.response?.status === 401) {
                        setMensagem({ tipo: 'erro', texto: 'Senha atual incorreta.' });
                    } else {
                        setMensagem({
                            tipo: 'erro',
                            texto: error instanceof AxiosError && error.response?.data?.message
                                ? error.response.data.message
                                : 'Erro ao atualizar senha. Tente novamente.'
                        });
                    }
                    setCarregando(false);
                    return;
                }
            } else {
                setMensagem({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
            }

            console.log('Redirecionando para o perfil...');
            setTimeout(() => {
                navigate('/perfil');
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);

            // Verifica se o erro é de autenticação
            if (error instanceof AxiosError && error.response?.status === 401) {
                setMensagem({ tipo: 'erro', texto: 'Sessão expirada. Por favor, faça login novamente.' });
                setTimeout(() => {
                    authService.logout();
                    navigate('/login');
                }, 2000);
            } else {
                setMensagem({
                    tipo: 'erro',
                    texto: error instanceof AxiosError && error.response?.data?.message
                        ? error.response.data.message
                        : 'Erro ao atualizar perfil. Tente novamente.'
                });
            }
        } finally {
            setCarregando(false);
        }
    };

    if (!usuario) return null;

    return (
        <div className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-6 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Editar Perfil
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mensagem && (
                                <div className={`rounded-md p-4 ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {mensagem.texto}
                                </div>
                            )}

                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                    disabled
                                />
                            </div>

                            <div>
                                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                    Foto de Perfil
                                </label>
                                <div className="mt-1 flex items-center">
                                    <div className="h-24 w-24 overflow-hidden rounded-full">
                                        {previewImagem ? (
                                            <img src={previewImagem} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">Sem foto</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="imagem"
                                        accept="image/*"
                                        onChange={handleImagemChange}
                                        className="ml-4 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h4>

                                {erroSenha && (
                                    <div className="rounded-md p-4 bg-red-50 text-red-700 mb-4">
                                        {erroSenha}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">
                                            Senha Atual
                                        </label>
                                        <input
                                            type="password"
                                            id="senhaAtual"
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                                            Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="novaSenha"
                                            value={novaSenha}
                                            onChange={(e) => setNovaSenha(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmarSenha"
                                            value={confirmarSenha}
                                            onChange={(e) => setConfirmarSenha(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/perfil')}
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {carregando ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 