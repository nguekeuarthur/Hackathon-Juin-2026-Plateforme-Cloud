from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from app.models.request import CourseTemplate, RequestStatus

class RequestCreate(BaseModel):
    template: CourseTemplate
    starts_at: datetime
    ends_at: datetime
    group_size: int = Field(default=1, ge=1)

class RequestValidate(BaseModel):
    approved: bool
    comment: str = ""
    flavor_name: Optional[str] = "a1-ram2-disk20-perf1"
    template_id: Optional[str] = "1cb0a6a2-2dc2-46cd-bb23-1070d7f0e9d6"

class RequestResponse(BaseModel):
    id: str
    requester: str
    template: CourseTemplate
    group_size: int
    starts_at: datetime
    ends_at: datetime
    status: RequestStatus
    vm_ip: Optional[str] = None
    vm_id: Optional[str] = None
    created_at: datetime
    validated_by: Optional[str] = None
    validated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
