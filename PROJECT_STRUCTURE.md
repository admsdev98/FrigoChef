# Estructura del Proyecto FrigoChef - Sistema MCP-Inspired

```
frigochef/
├── backend/
│   ├── main.py                     # FastAPI app principal
│   ├── config.py                   # Configuración y base de datos
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                 # Endpoints autenticación
│   │   ├── recipes.py              # Endpoints CRUD recetas
│   │   └── generation.py           # Endpoints generación IA
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py         # Lógica autenticación + JWT
│   │   ├── recipe_service.py       # Lógica CRUD recetas
│   │   └── generation_service.py   # Coordinador generación IA
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                 # SQLAlchemy User model
│   │   ├── recipe.py               # SQLAlchemy Recipe model
│   │   └── ingredient.py           # SQLAlchemy Ingredient model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                 # Pydantic schemas auth
│   │   ├── recipe.py               # Pydantic schemas recetas
│   │   └── generation.py           # Pydantic schemas generación IA
│   │
│   ├── recipe_engine/              # Sistema orquestación MCP-inspired ⭐
│   │   ├── __init__.py
│   │   ├── orchestrator.py         # Orquestador principal con personalidad
│   │   │
│   │   ├── workflows/              # Archivos markdown con flujos
│   │   │   ├── recipe_generation.md
│   │   │   ├── image_processing.md
│   │   │   ├── dietary_filtering.md
│   │   │   └── nutrition_analysis.md
│   │   │
│   │   ├── processors/             # Herramientas modulares (MCP tools)
│   │   │   ├── __init__.py
│   │   │   ├── image_processor.py  # OCR, visión, análisis imágenes
│   │   │   ├── text_processor.py   # NLP, parsing, filtrado texto
│   │   │   ├── voice_processor.py  # Speech-to-text, procesamiento voz
│   │   │   ├── recipe_processor.py # Generación recetas con LLM
│   │   │   └── nutrition_processor.py # Análisis nutricional
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── llm_client.py       # Cliente OpenAI/Claude unificado
│   │       ├── processor_registry.py # Registro automático de processors
│   │       └── context_manager.py  # Gestión de contexto y personalidad
│   │
│   ├── repositories/               # Acceso a datos (opcional para escalabilidad)
│   │   ├── __init__.py
│   │   ├── user_repository.py      # CRUD usuarios en BD
│   │   └── recipe_repository.py    # CRUD recetas en BD
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py             # JWT, password hashing
│   │   └── dependencies.py         # FastAPI dependency injection
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         # Barra lateral
│   │   │   ├── RecipeForm.jsx      # Formulario crear receta
│   │   │   └── RecipeCard.jsx      # Tarjeta receta
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Página login
│   │   │   ├── Home.jsx            # Dashboard principal
│   │   │   └── Settings.jsx        # Configuraciones
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Llamadas a la API
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── .github/
    └── copilot-instructions.md
```

## Patrón de Arquitectura Final

### 📐 **Clean Architecture + Recipe Engine (MCP-Inspired)**

**Capas principales:**
1. **Router Layer** → Manejo HTTP endpoints
2. **Service Layer** → Lógica de negocio + coordinación 
3. **Repository Layer** → Acceso a datos (opcional, para escalabilidad)
4. **Model Layer** → Entidades de base de datos
5. **Recipe Engine** → Sistema de orquestación inteligente

### 🔄 **Flujo de datos:**
```
HTTP Request → Router → Service → Recipe Engine → Processors → LLM → Response
```

### 🧠 **Recipe Engine (recipe_engine/):**

**Orquestador (`orchestrator.py`):**
- **Personalidad definida** - Comportamiento como chef experto
- **Context manager** - Mantiene estado de conversación
- **Decision making** - Decide qué processors usar
- **Workflow execution** - Ejecuta flujos según archivos .md

**Workflows (`workflows/`):**
- **Definidos en markdown** - Fáciles de modificar sin código
- **Versionables** - Control de cambios en Git
- **Autodocumentados** - Las instrucciones son la documentación

**Processors (`processors/`):**
- **Herramientas MCP-inspired** - Cada una con responsabilidad específica
- **Auto-discovery** - Registro automático al iniciar
- **Modulares** - Fácil añadir nuevos processors
- **Testeable** - Cada processor se prueba independientemente

### 🚀 **Flujo típico de generación:**
```python
# 1. Router recibe request
@router.post("/generate-recipe")
async def generate_recipe(
    request: RecipeGenerationRequest,
    service: GenerationService = Depends()
):
    return await service.generate_recipe(request)

# 2. Service coordina con Recipe Engine
class GenerationService:
    async def generate_recipe(self, request):
        orchestrator = RecipeOrchestrator()
        return await orchestrator.process_request(request)

# 3. Orquestador lee workflow y ejecuta
class RecipeOrchestrator:
    async def process_request(self, request):
        workflow = self.load_workflow("recipe_generation.md")
        context = self.context_manager.create_context(request)
        return await self.execute_workflow(workflow, context)

# 4. Processors ejecutan tareas específicas
# image_processor.analyze() → text_processor.filter() → recipe_processor.generate()
```

### 🎯 **Separación de responsabilidades:**

- **Routers**: Solo HTTP (validación, respuesta)
- **Services**: Lógica de negocio + coordinación
- **Repositories**: Acceso a datos (CRUD)
- **Models**: Estructura de datos
- **Recipe Engine**: Inteligencia artificial + orquestación
- **Processors**: Tareas específicas (imagen, texto, recetas)

### 💡 **Beneficios de esta arquitectura:**

✅ **Aprendizaje MCP real** - Conceptos core sin protocolo  
✅ **Escalable** - Fácil añadir nuevos processors/workflows  
✅ **Mantenible** - Separación clara de responsabilidades  
✅ **Testeable** - Cada capa se prueba independientemente  
✅ **Flexible** - Workflows modificables sin tocar código  
✅ **Comprensible** - Estructura intuitiva y bien documentada
```

## Tecnologías recomendadas:

### Backend:
- **FastAPI** - Framework web rápido y moderno
- **SQLAlchemy** - ORM para base de datos
- **Alembic** - Migraciones de base de datos
- **PostgreSQL** - Base de datos principal
- **JWT** - Autenticación
- **OpenAI API** - Procesamiento IA
- **Pillow** - Procesamiento imágenes
- **SpeechRecognition** - Procesamiento voz

### Frontend:
- **React + Vite** - Framework y build tool
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **React Hook Form** - Manejo formularios
- **React Query** - Manejo estado servidor

### DevOps:
- **Docker** - Containerización
- **Docker Compose** - Desarrollo local
- **GitHub Actions** - CI/CD
