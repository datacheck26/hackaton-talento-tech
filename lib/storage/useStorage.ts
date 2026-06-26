import { supabase } from '../supabaseClient';
import { useState } from 'react';

export function useStorage() {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (empresaId: string, preguntaId: string, file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${empresaId}/${preguntaId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('evidencias')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obtener URL firmada para poder visualizar el archivo privado
      const { data: signedData, error: signedError } = await supabase.storage
        .from('evidencias')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 año

      if (signedError) throw signedError;

      return { success: true, url: signedData?.signedUrl, path: filePath };
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
}
