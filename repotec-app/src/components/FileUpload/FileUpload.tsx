import { useState, useRef } from 'react';
import { XMarkIcon, DocumentIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { arquivosService } from '../../services/arquivos.service';
import { FileItem } from '../../types/file-item';

interface FileUploadProps {
  files: FileItem[];
  onFilesAdded: (files: FileItem[]) => void;
  onFileRemoved: (file: FileItem) => void;
  className?: string;
}

export default function FileUpload({ files, onFilesAdded, onFileRemoved, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFilesAdded(droppedFiles);
    }
  };

  const handleFilesAdded = (newFiles: FileList) => {
    const fileItems: FileItem[] = Array.from(newFiles).map(file => ({
      nome: file.name,
      file: file
    }));
    onFilesAdded(fileItems);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFilesAdded(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (file: FileItem) => {
    if (!file.id) return;

    setIsDownloading(true);
    try {
      await arquivosService.downloadArquivo(file.id, file.nome);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const removeFile = async (index: number) => {
    const file = files[index];
    setIsDeleting(true);
    try {
      if (file.id) {
        await arquivosService.excluirArquivo(file.id);
      }
      onFileRemoved(file);
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={className}>
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-4 text-center ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPointerDown={handlePointerDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Arraste arquivos aqui ou clique para selecionar
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-200">
          {files.map((file, index) => (
            <li key={index} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {file.nome}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {file.id && (
                  <button
                    type="button"
                    onClick={() => handleDownload(file)}
                    disabled={isDownloading}
                    className="text-primary-600 hover:text-primary-500 disabled:opacity-50"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 