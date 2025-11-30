from fastapi import APIRouter, Depends

from utils.auth_utils import get_current_user
from ai.orchestrator import orchestrate_message
from schemas.ai_schema import McpMetadata

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("")
async def handle_message(content: McpMetadata, user = Depends(get_current_user)):
    return await orchestrate_message(content, user.id)