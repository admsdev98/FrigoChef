import os
import base64
import tempfile

def base64_to_audio_tempfile(base64_string, suffix=".wav"):
    audio_data = base64.b64decode(base64_string)
    
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_audio:
        temp_audio.write(audio_data)
        temp_audio.flush()
        return temp_audio.name

def delete_temp_audio_file(file_path):
    try:
        os.remove(file_path)
    except OSError as e:
        print(f"Error deleting temporary audio file: {e}")