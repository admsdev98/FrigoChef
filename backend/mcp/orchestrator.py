import os

from agents import Agent, Runner

from repositories.recipe_repository import insert_recipe, insert_recipe_ingredient
from repositories.schema_repository import get_all_table_schemas
from mcp.agents.image_agent import image_processor_subagent
from mcp.agents.voice_agent import voice_processor_subagent
from utils.mcp_utils import load_personal_data_file, base64_to_temp_file



async def orchestrate_message(content, user_id):
    try:
        orchestrator = Agent(
            name="Master Chief",
            model=os.getenv("OPENAI_MODEL"),
            instructions=load_personal_data_file("orchestrator_instructions"),
            tools=[
                image_processor_subagent,
                voice_processor_subagent,
                get_all_table_schemas,
                insert_recipe,
                insert_recipe_ingredient
            ]
        )

        orchestrator_payload = generate_runner_payload(content, user_id)

        result = await Runner.run(orchestrator, orchestrator_payload)
        return result.final_output
    except Exception as e:
        print(f"Error orchestrating message: {e}")
        
def generate_runner_payload(content, user_id):
    if content.tool == 'text':
        return f"The user {user_id} is trying to generate a recipe providing the following ingredients or data: {content.content}"
    elif content.tool == 'image':
        temp_file_path_image = base64_to_temp_file(content.content, suffix=".jpg")
        return f"The user {user_id} is trying to generate a recipe using image data, that is temporary allowed in: {temp_file_path_image}"
    elif content.tool == 'audio':
        temp_file_path_audio = base64_to_temp_file(content.content, suffix=".wav")
        return f"The user {user_id} is trying to generate a recipe using audio data, that is temporary allowed in: {temp_file_path_audio}"