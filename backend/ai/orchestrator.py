import os

from agents import Agent, Runner

from repositories.recipe_repository import insert_recipe, insert_recipe_ingredient, insert_recipe_step, insert_recipe_image

from repositories.schema_repository import get_all_table_schemas
from ai.agents.image_agent import image_reader_agent, image_recipe_generator_agent
from ai.agents.voice_agent import voice_processor_agent
from ai.agents.recipe_agent import recipe_instructions_processor_agent
from utils.ai_utils import load_personal_data_file, base64_to_temp_file, delete_temp_file



async def orchestrate_message(content, user_id):
    temp_file = None
    try:
        orchestrator = Agent(
            name="Master Chief",
            model=os.getenv("OPENAI_MODEL"),
            instructions=load_personal_data_file("orchestrator_instructions"),
            tools=[
                image_reader_agent,
                voice_processor_agent,
                recipe_instructions_processor_agent,
                image_recipe_generator_agent,
                get_all_table_schemas,
                insert_recipe,
                insert_recipe_ingredient,
                insert_recipe_step,
                insert_recipe_image
            ]
        )

        orchestrator_payload, temp_file = generate_runner_payload(content, user_id)

        result = await Runner.run(orchestrator, orchestrator_payload)
        return result.final_output
    except Exception as e:
        print(f"Error orchestrating message: {e}")
    finally:
        if temp_file:
            delete_temp_file(temp_file)
        
def generate_runner_payload(content, user_id):
    if content.tool == 'text':
        return f"The user {user_id} is trying to generate a recipe providing the following ingredients or data: {content.content}", None
    elif content.tool == 'image':
        temp_file_path_image = base64_to_temp_file(content.content, suffix=".jpg")
        return f"The user {user_id} is trying to generate a recipe using image data, that is temporary allowed in: {temp_file_path_image}", temp_file_path_image
    elif content.tool == 'audio':
        temp_file_path_audio = base64_to_temp_file(content.content, suffix=".wav")
        return f"The user {user_id} is trying to generate a recipe using audio data, that is temporary allowed in: {temp_file_path_audio}", temp_file_path_audio