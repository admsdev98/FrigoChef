import os

from openai import OpenAI
from agents import function_tool

from utils.mcp_utils import load_personal_data_file, delete_temp_file


@function_tool(description_override="Process voice input and return parsed ingredients as text")
async def voice_processor_subagent(voice_data_file_path: str):
    try:
        client = OpenAI()
        
        voice_agent_prompt = load_personal_data_file("voice_agent_instructions")

        with open(voice_data_file_path, "rb") as voice_data_file:
                transcription = client.audio.transcriptions.create(
                    model=os.getenv("VOICE_MODEL"),
                    prompt=voice_agent_prompt,
                    file=voice_data_file,
                    response_format="text"
                )

                delete_temp_file(voice_data_file_path)

                if not transcription:
                    raise ValueError("Transcription failed or returned empty text")

                return transcription
    except Exception as e:
        print(f"Error orchestrating message: {e}")
