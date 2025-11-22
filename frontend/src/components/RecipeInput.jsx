import React, { useState, useRef } from 'react';

export function RecipeInput({ onSubmit, isGenerating = false }) {
  const [inputValue, setInputValue] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // 'text', 'audio', 'image'
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Manejar envío
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isGenerating || (!inputValue.trim() && !audioFile && !imageFile)) return;
    
    onSubmit({
      text: inputValue,
      audio: audioFile,
      image: imageFile,
      mode: inputMode
    });
    
    // Reset
    setInputValue('');
    setAudioFile(null);
    setImageFile(null);
    setInputMode('text');
  };

  // Manejar grabación de audio
  const startRecording = async () => {
    if (isGenerating) return; // Evitar grabación durante generación
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioFile({ blob: audioBlob, url: audioUrl });
        setInputMode('audio');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Manejar subida de imagen
  const handleImageUpload = (e) => {
    if (isGenerating) return; // Evitar subida durante generación
    
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile({ file, url: imageUrl });
      setInputMode('image');
    }
  };

  // Eliminar archivo
  const removeFile = () => {
    if (isGenerating) return; // Evitar eliminación durante generación
    
    if (audioFile?.url) URL.revokeObjectURL(audioFile.url);
    if (imageFile?.url) URL.revokeObjectURL(imageFile.url);
    
    setAudioFile(null);
    setImageFile(null);
    setInputMode('text');
    setInputValue('');
  };

  // Cambiar a modo texto
  const switchToText = () => {
    if (isGenerating) return; // Evitar cambio de modo durante generación
    
    if (audioFile || imageFile) {
      removeFile();
    }
    setInputMode('text');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Preview de archivos - Simplificado */}
      {(audioFile || imageFile) && (
        <div className="mb-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {audioFile && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Audio grabado</span>
                    </div>
                    <audio controls className="w-full h-8">
                      <source src={audioFile.url} type="audio/wav" />
                    </audio>
                  </div>
                )}
                
                {imageFile && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                      <img 
                        src={imageFile.url} 
                        alt="Preview"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => window.open(imageFile.url, '_blank')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 block truncate">Imagen subida</span>
                      <span className="text-xs text-gray-500 truncate">{imageFile.file.name}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={removeFile}
                disabled={isGenerating}
                className="w-6 h-6 text-gray-400 hover:text-red-500 disabled:text-gray-300"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado de generación - Simplificado */}
      {isGenerating ? (
        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-emerald-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Generando receta...</p>
          <p className="text-xs text-gray-500">Esto puede tardar unos segundos</p>
        </div>
      ) : (
        <>
      {/* Formulario principal - Simplificado */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-3 p-3 bg-white rounded-lg border border-gray-200">
          {/* Campo de texto */}
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                isGenerating ? 'Generando receta...' :
                inputMode === 'audio' ? 'Audio grabado - opcional: añade texto adicional' :
                inputMode === 'image' ? 'Imagen subida - opcional: añade descripción' :
                'Describe los ingredientes que tienes disponibles...'
              }
              disabled={isGenerating || (inputMode !== 'text' && (audioFile || imageFile))}
              className="w-full resize-none border-0 focus:ring-0 focus:outline-none p-0 text-slate-800 placeholder-slate-400 disabled:bg-transparent"
              rows="1"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Botones de acción - Simplificados */}
          <div className="flex items-center gap-2">
            {/* Botón imagen */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating || inputMode !== 'text'}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                !isGenerating && inputMode === 'text' 
                  ? 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Botón audio */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isGenerating || (inputMode !== 'text' && !isRecording)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isRecording
                  ? 'text-red-600 bg-red-50'
                  : !isGenerating && inputMode === 'text'
                    ? 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              {isRecording ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isGenerating || (!inputValue.trim() && !audioFile && !imageFile)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isGenerating || (!inputValue.trim() && !audioFile && !imageFile)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Input oculto para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Indicador de grabación - Simple */}
      {isRecording && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 text-sm font-medium">Grabando...</span>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
