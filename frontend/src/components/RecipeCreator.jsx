import React, { useState, useRef } from 'react';

function RecipeCreator({ onCreate }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const audioRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setMode('image');
      setAudio(null);
      setText('');
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudio(file);
      setMode('audio');
      setImage(null);
      setText('');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setMode('text');
    setImage(null);
    setAudio(null);
  };

  const handleRemoveImage = () => setImage(null);
  const handleRemoveAudio = () => setAudio(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'text' && text) onCreate({ type: 'text', content: text });
    if (mode === 'image' && image) onCreate({ type: 'image', content: image });
    if (mode === 'audio' && audio) onCreate({ type: 'audio', content: audio });
  };

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className={`px-3 py-1 rounded-md font-semibold transition ${mode === 'text' ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('text')}
          disabled={!!image || !!audio}
        >
          Texto
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-md font-semibold transition ${mode === 'audio' ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('audio')}
          disabled={!!image || !!text}
        >
          Voz
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-md font-semibold transition ${mode === 'image' ? 'bg-teal-500 text-white shadow' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('image')}
          disabled={!!audio || !!text}
        >
          Imagen
        </button>
      </div>

      {mode === 'text' && (
        <textarea
          className="input textarea border rounded-md p-3 w-full focus:ring-2 focus:ring-teal-200"
          placeholder="Describe tu receta..."
          value={text}
          onChange={handleTextChange}
          disabled={!!image || !!audio}
        />
      )}

      {mode === 'image' && !image && (
        <input className="text-sm text-gray-600" type="file" accept="image/*" onChange={handleImageChange} />
      )}

      {mode === 'image' && image && (
        <div className="relative">
          <img src={URL.createObjectURL(image)} alt="preview" className="w-32 h-32 object-cover rounded-md cursor-pointer shadow-sm" onClick={() => setPreviewOpen(true)} />
          <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full" onClick={handleRemoveImage}>×</button>
          {previewOpen && (
            <div className="preview-overlay" onClick={() => setPreviewOpen(false)}>
              <img src={URL.createObjectURL(image)} alt="ampliada" className="max-w-lg max-h-full rounded-lg shadow-2xl" />
            </div>
          )}
        </div>
      )}

      {mode === 'audio' && !audio && (
        <input className="text-sm text-gray-600" type="file" accept="audio/*" onChange={handleAudioChange} />
      )}

      {mode === 'audio' && audio && (
        <div className="relative flex items-center gap-2">
          <audio controls ref={audioRef} src={URL.createObjectURL(audio)} />
          <button type="button" className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={handleRemoveAudio}>Eliminar</button>
        </div>
      )}

      <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-shadow shadow" type="submit">Crear receta</button>
    </form>
  );
}

export default RecipeCreator;
