import os
import base64
import tempfile
from pathlib import Path


def load_personal_data_file(file_name):
    routes = os.getenv("AGENT_ROUTES")
    if not routes:
        raise EnvironmentError("AGENT_ROUTES environment variable is not set")

    # Resuelve la ruta desde la raíz del proyecto
    base_dir = Path(__file__).parent.parent  # Desde utils/mcp_utils.py hacia la raíz del backend
    path = base_dir / routes.lstrip('/') / f"{file_name}.md"

    if not path.exists():
        raise FileNotFoundError(f"Agent instructions file not found: {path}")   

    with open(path, "r", encoding="utf-8") as file:
        return file.read()
    
def base64_to_temp_file(base64_string, suffix):
    decoded_data = base64.b64decode(base64_string)
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_file.write(decoded_data)
        temp_file.flush()
        return temp_file.name

def delete_temp_file(file_path):
    try:
        os.remove(file_path)
    except OSError as e:
        print(f"Error deleting temporary file: {e}")