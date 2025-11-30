import os
import base64

from openai import OpenAI
from agents import function_tool

from utils.ai_utils import load_personal_data_file

@function_tool(description_override="Provice step-by-step cooking instructions for the given recipe description.")
async def recipe_instructions_processor_agent(recipe_description: str):
    try:
        client = OpenAI()
        
        recipe_agent_prompt = load_personal_data_file("voice_agent_instructions")
        
        recipe_instructions = client.responses.create(
            model=os.getenv("OPENAI_MODEL"),
            instructions=recipe_agent_prompt,
            input='The recipe description is: ' +  recipe_description
        )

        if not recipe_instructions.output_text:
            raise ValueError("Recipe instruction generation failed or returned empty text")

        return recipe_instructions.output_text
    except Exception as e:
        print(f"Error orchestrating message: {e}")