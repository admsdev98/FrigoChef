from pydantic import BaseModel

class McpMetadata(BaseModel):
    type: str
    tool: str
    content: str