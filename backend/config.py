import os
import sys
from dotenv import load_dotenv, find_dotenv

class EnvironmentConfig:
    def __init__(self):
        self._detect_environment()
        self._load_environment_file()
    
    def _detect_environment(self):
        self.is_local = "--local" in sys.argv or os.getenv("ENVIRONMENT") == "local"
    
    def _load_environment_file(self):
        env_file = ".env.local" if self.is_local else ".env"
        load_dotenv(find_dotenv(env_file))

config = EnvironmentConfig() 