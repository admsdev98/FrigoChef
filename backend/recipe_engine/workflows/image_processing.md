# Image Processing Workflow

## Overview
Workflow for processing images (fridge photos, receipt photos) and extracting ingredients.

## Steps

### 1. Image Analysis
- **Processor**: `image_processor`
- **Action**: `analyze_ingredients`
- **Input**: Base64 image data
- **Output**: List of detected ingredients with confidence scores

### 2. Text Normalization
- **Processor**: `text_processor`
- **Action**: `normalize_ingredients`
- **Input**: Raw ingredient list
- **Output**: Cleaned and standardized ingredient list

### 3. Recipe Generation
- **Processor**: `recipe_processor`
- **Action**: `generate_recipe`
- **Input**: Ingredients + user preferences
- **Output**: Complete recipe with instructions

### 4. Nutritional Analysis
- **Processor**: `nutrition_processor`
- **Action**: `analyze_nutrition`
- **Input**: Generated recipe
- **Output**: Nutritional information

## Error Handling
- If image analysis fails: Ask user to retake photo or provide text input
- If no ingredients detected: Suggest manual ingredient entry
- If recipe generation fails: Provide basic recipe template

## Success Criteria
- At least 3 ingredients detected
- Recipe generated with realistic cooking time
- Nutritional info includes calories and macros
