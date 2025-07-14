import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { faqService, FAQ } from '../../services/faq.service';

const FAQPage: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({ pergunta: '', resposta: '' });
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const user = authService.getCurrentUser();

    const isAdmin = user?.tipo === 'admin';

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            const data = await faqService.buscarFaqs();
            setFaqs(data);
        } catch (error) {
            console.error('Erro ao carregar FAQs:', error);
        }
    };

    const handleOpenDialog = (faq?: FAQ) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({ pergunta: faq.pergunta, resposta: faq.resposta });
        } else {
            setEditingFaq(null);
            setFormData({ pergunta: '', resposta: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingFaq(null);
        setFormData({ pergunta: '', resposta: '' });
    };

    const handleSubmit = async () => {
        try {
            if (editingFaq) {
                await faqService.atualizarFaq(editingFaq.id, formData);
            } else {
                await faqService.criarFaq(formData);
            }
            loadFaqs();
            handleCloseDialog();
        } catch (error) {
            console.error('Erro ao salvar FAQ:', error);
        }
    };

    const handleDelete = async (id: string, pergunta: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a pergunta "${pergunta}"?`)) {
            try {
                await faqService.excluirFaq(id);
                loadFaqs();
            } catch (error) {
                console.error('Erro ao excluir FAQ:', error);
            }
        }
    };

    const toggleFaq = (id: string) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h1>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenDialog()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <span className="mr-2">+</span> Nova Pergunta
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleFaq(faq.id)}
                        >
                            <span className="font-medium text-gray-900">{faq.pergunta}</span>
                            <div className="flex items-center space-x-4">
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDialog(faq);
                                            }}
                                            className="text-primary-600 hover:text-primary-700"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(faq.id, faq.pergunta);
                                            }}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </>
                                )}
                                <span className="text-gray-500">
                                    {expandedFaq === faq.id ? '▼' : '▶'}
                                </span>
                            </div>
                        </div>
                        <div className={`p-4 bg-white ${expandedFaq === faq.id ? 'block' : 'hidden'}`}>
                            <p className="text-gray-600">{faq.resposta}</p>
                        </div>
                    </div>
                ))}
            </div>

            {openDialog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {editingFaq ? 'Editar Pergunta' : 'Nova Pergunta'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700">
                                    Pergunta
                                </label>
                                <input
                                    id="pergunta"
                                    type="text"
                                    value={formData.pergunta}
                                    onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="resposta" className="block text-sm font-medium text-gray-700">
                                    Resposta
                                </label>
                                <textarea
                                    id="resposta"
                                    value={formData.resposta}
                                    onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={handleCloseDialog}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                {editingFaq ? 'Salvar' : 'Criar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQPage; 