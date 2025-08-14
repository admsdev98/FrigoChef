# Voice Processing Workflow

## Overview
Workflow for processing voice commands and generating recipes from speech input.

## Steps

### 1. Speech to Text
- **Processor**: `voice_processor`
- **Action**: `speech_to_text`
- **Input**: Audio blob (WAV/MP3)
- **Output**: Transcribed text

### 2. Intent Extraction
- **Processor**: `text_processor`
- **Action**: `extract_intent`
- **Input**: Transcribed text
- **Output**: Structured intent with ingredients and preferences

### 3. Recipe Generation
- **Processor**: `recipe_processor`
- **Action**: `generate_by_intent`
- **Input**: Intent object
- **Output**: Tailored recipe

### 4. Dietary Validation
- **Processor**: `nutrition_processor`
- **Action**: `validate_diet`
- **Input**: Recipe + dietary restrictions
- **Output**: Validated recipe or alternatives

## Voice Commands Examples
- "Create a pasta recipe with tomatoes and basil"
- "I have chicken and rice, make something healthy"
- "Vegetarian dinner for 4 people"

## Error Handling
- If audio unclear: Request repeat or text input
- If intent unclear: Ask clarifying questions
- If dietary conflict: Suggest modifications

## Success Criteria
- Clear transcription with >90% accuracy
- Intent correctly extracted
- Recipe matches voice request
