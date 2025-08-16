import React, { useState, useRef } from 'react';

export function RecipeInput({ onSubmit }) {
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
    if (!inputValue.trim() && !audioFile && !imageFile) return;
    
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
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile({ file, url: imageUrl });
      setInputMode('image');
    }
  };

  // Eliminar archivo
  const removeFile = () => {
    if (audioFile?.url) URL.revokeObjectURL(audioFile.url);
    if (imageFile?.url) URL.revokeObjectURL(imageFile.url);
    
    setAudioFile(null);
    setImageFile(null);
    setInputMode('text');
    setInputValue('');
  };

  // Cambiar a modo texto
  const switchToText = () => {
    if (audioFile || imageFile) {
      removeFile();
    }
    setInputMode('text');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Preview de archivos */}
      {(audioFile || imageFile) && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {audioFile && (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Audio grabado</p>
                    <audio controls className="mt-2 w-full">
                      <source src={audioFile.url} type="audio/wav" />
                    </audio>
                  </div>
                </div>
              )}
              
              {imageFile && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={imageFile.url} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Imagen subida</p>
                    <p className="text-xs text-slate-500 mt-1">{imageFile.file.name}</p>
                    <button
                      onClick={() => window.open(imageFile.url, '_blank')}
                      className="text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                    >
                      Ver imagen completa
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={removeFile}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input principal */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-2 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          {/* Campo de texto */}
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                inputMode === 'audio' ? 'Audio grabado - opcional: añade texto adicional' :
                inputMode === 'image' ? 'Imagen subida - opcional: añade descripción' :
                'Describe los ingredientes que tienes disponibles...'
              }
              disabled={inputMode !== 'text' && (audioFile || imageFile)}
              className="w-full resize-none border-0 focus:ring-0 p-0 text-slate-800 placeholder-slate-400 disabled:bg-transparent"
              rows="1"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-2">
            {/* Botón de imagen */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={inputMode !== 'text'}
              className={`p-2 rounded-lg transition-colors ${
                inputMode === 'text' 
                  ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' 
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Botón de audio */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={inputMode !== 'text' && !isRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : inputMode === 'text'
                    ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                    : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              {isRecording ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!inputValue.trim() && !audioFile && !imageFile}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
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

      {/* Indicador de grabación */}
      {isRecording && (
        <div className="mt-2 flex items-center justify-center text-red-600 text-sm">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
          Grabando... Haz clic en stop para finalizar
        </div>
      )}
    </div>
  );
}
