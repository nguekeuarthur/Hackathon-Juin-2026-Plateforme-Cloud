from sqlalchemy import Column, String, DateTime, Integer, Enum as SAEnum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum, uuid

Base = declarative_base()

class RequestStatus(str, enum.Enum):
    PENDING   = "pending"
    APPROVED  = "approved"
    REJECTED  = "rejected"
    RUNNING   = "running"
    DESTROYED = "destroyed"

class CourseTemplate(str, enum.Enum):
    LINUX_ADMIN  = "linux-admin"
    DEV_WEB      = "dev-web"
    DATA_SCIENCE = "data-science"
    CYBERSEC     = "cybersec"

class VMRequest(Base):
    __tablename__ = "vm_requests"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    requester    = Column(String, nullable=False)
    template     = Column(SAEnum(CourseTemplate), nullable=False)
    group_size   = Column(Integer, default=1)
    starts_at    = Column(DateTime, nullable=False)
    ends_at      = Column(DateTime, nullable=False)  # jamais NULL
    status       = Column(SAEnum(RequestStatus), default=RequestStatus.PENDING)
    vm_ip        = Column(String, nullable=True)
    vm_id        = Column(String, nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    validated_by = Column(String, nullable=True)
    validated_at = Column(DateTime, nullable=True)
