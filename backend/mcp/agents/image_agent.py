import os
import base64

from openai import OpenAI
from agents import function_tool

from utils.mcp_utils import load_personal_data_file

@function_tool(description_override="Process image base64 file and return parsed ingredients as text")
async def image_processor_agent(image_data_temp_file: str, image_type: str = "jpeg"):
    try:
        client = OpenAI()

        image_agent_prompt = load_personal_data_file("image_agent_instructions")

        with open(image_data_temp_file, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode("utf-8")
            image_transcription = client.responses.create(
                model=os.getenv("IMAGE_MODEL"),
                input=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "input_text", "text": image_agent_prompt},
                            {"type": "input_image", "image_url": f"data:image/{image_type};base64,{image_base64}"},
                        ],
                    }
                ],
            )

            if not image_transcription.output_text:
                raise ValueError("Transcription failed or returned empty text")

            return image_transcription.output_text
    except Exception as e:
        print(f"Error orchestrating message: {e}")