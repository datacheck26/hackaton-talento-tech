'use client';

import { useState, useRef } from 'react';
import { useStorage } from '../../../lib/storage/useStorage';
import { useEmpresa } from '../../../lib/empresa/useEmpresa';

interface EvidenciaUploaderProps {
  preguntaId: string;
  onUploadSuccess: (url: string) => void;
}

export default function EvidenciaUploader({ preguntaId, onUploadSuccess }: EvidenciaUploaderProps) {
  const { uploadFile, uploading } = useStorage();
  const { empresa, empresaId } = useEmpresa();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !empresaId) return;

    // Límite de 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('El archivo excede el límite de 5MB.');
      return;
    }

    setErrorMsg(null);
    const result = await uploadFile(empresaId, preguntaId, file);
    
    if (result.success && result.url) {
      setFileUrl(result.url);
      onUploadSuccess(result.url);
    } else {
      setErrorMsg('Error al subir la evidencia. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#0F172A]">
          📄 Evidencia Documental (Opcional)
        </label>
        {fileUrl && (
          <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-1 rounded-full">
            ✓ Subido
          </span>
        )}
      </div>

      {!fileUrl ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
            uploading ? 'bg-[#F1F5F9] border-[#E2E8F0] opacity-70 cursor-not-allowed' : 'border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC]'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            disabled={uploading}
          />
          <div className="text-2xl mb-2">📤</div>
          <p className="text-xs text-[#64748B] font-medium">
            {uploading ? 'Subiendo evidencia...' : 'Haz clic para adjuntar soporte (PDF, DOCX, IMG)'}
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-1">Máx. 5MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#2563EB] hover:underline truncate max-w-[80%] font-medium">
            Ver documento adjunto
          </a>
          <button 
            type="button" 
            onClick={() => setFileUrl(null)} 
            className="text-[#EF4444] text-xs hover:bg-[#FEE2E2] px-2 py-1 rounded-md transition-colors"
          >
            Quitar
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-[#EF4444] font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
