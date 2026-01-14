"""Task API endpoints with proper user isolation."""
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func

from src.models.database import get_session
from src.models.task import Task
from src.api.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from src.api.schemas.errors import ValidationError, NotFoundError
from src.api.dependencies.auth import get_current_user, TokenUser

router = APIRouter()


class TaskService:
    """Service class for task operations."""

    def __init__(self, session: Session):
        self.session = session

    def create_task(self, user_id: UUID, task_data: TaskCreate) -> Task:
        """Create a new task for a user."""
        if not task_data.title or not task_data.title.strip():
            raise ValidationError(message="Title is required and cannot be empty")

        task = Task(
            user_id=user_id,
            title=task_data.title.strip(),
            description=task_data.description,
        )
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_tasks(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 20,
    ) -> TaskListResponse:
        """Get all tasks for a user with pagination."""
        offset = (page - 1) * page_size

        query = select(Task).where(Task.user_id == user_id)
        count_statement = select(func.count()).where(Task.user_id == user_id)
        total = self.session.exec(count_statement).one()

        task_instances = self.session.exec(
            query.offset(offset).limit(page_size).order_by(Task.created_at.desc())
        ).all()

        items = [TaskResponse.model_validate(task) for task in task_instances]
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        return TaskListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    def get_task(self, current_user: TokenUser, task_id: UUID) -> Task:
        """Get a single task for the current user."""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        ).first()

        if not task:
            raise NotFoundError(resource="Task", resource_id=str(task_id))

        return task

    def update_task(
        self, current_user: TokenUser, task_id: UUID, task_data: TaskUpdate
    ) -> Task:
        """Update an existing task."""
        task = self.get_task(current_user, task_id)

        if task_data.title is not None:
            if not task_data.title.strip():
                raise ValidationError(message="Title cannot be empty")
            task.title = task_data.title.strip()

        if task_data.description is not None:
            task.description = task_data.description

        if task_data.is_completed is not None:
            task.is_completed = task_data.is_completed

        task.updated_at = datetime.now(timezone.utc)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, current_user: TokenUser, task_id: UUID) -> None:
        """Delete a task."""
        task = self.get_task(current_user, task_id)
        self.session.delete(task)
        self.session.commit()


def get_task_service(session: Session = Depends(get_session)) -> TaskService:
    return TaskService(session)


# ---------------- Endpoints ----------------

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    service: TaskService = Depends(get_task_service),
    current_user: TokenUser = Depends(get_current_user),
):
    return service.create_task(current_user.id, task_data)


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: TaskService = Depends(get_task_service),
    current_user: TokenUser = Depends(get_current_user),
):
    return service.get_tasks(current_user.id, page, page_size)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    service: TaskService = Depends(get_task_service),
    current_user: TokenUser = Depends(get_current_user),
):
    return service.get_task(current_user, task_id)


@router.patch("/{task_id}", response_model=TaskResponse)
async def partial_update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    service: TaskService = Depends(get_task_service),
    current_user: TokenUser = Depends(get_current_user),
):
    return service.update_task(current_user, task_id, task_data)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    service: TaskService = Depends(get_task_service),
    current_user: TokenUser = Depends(get_current_user),
):
    service.delete_task(current_user, task_id)
    return None
