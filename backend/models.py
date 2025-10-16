# Frame data models

from pydantic import BaseModel
from typing import Optional


class Frame(BaseModel):
    frame_number: str
    frame_tone: str = "Informative"
    content: str = ""
    frame_type: str = "Live Footage"
    voice_over_required: bool = False
    editing_required: bool = False
    facilitator_costume_props: str = ""
    scene_description: str = ""
    camera_notes: str = ""
    editing_notes: str = ""
    suggestions: str = ""

