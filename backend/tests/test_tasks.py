import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from uuid import uuid4

from src.models.user import User
from src.services.auth_service import auth_service


@pytest.fixture(name="test_tasks_user")
def test_tasks_user_fixture(session: Session):
    """Create a test user for task operations."""
    user = User(
        email=f"taskuser_{uuid4()}@example.com",
        password_hash=auth_service.get_password_hash("tasktestpassword"),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    access_token = auth_service.create_access_token(
        data={"sub": str(user.id), "email": user.email, "type": "access"}
    )
    return user, access_token


def test_task_operations(client: TestClient, test_tasks_user: tuple[User, str]):
    """Test task operations (create, get, list, update, delete) for a user."""
    user, access_token = test_tasks_user
    user_id = user.id
    auth_headers = {"Authorization": f"Bearer {access_token}"}

    # 1. Create a task
    create_response = client.post(
        f"/users/{user_id}/tasks",
        headers=auth_headers,
        json={"title": "Test Task", "description": "This is a test description"},
    )
    assert create_response.status_code == 201
    task_data = create_response.json()
    task_id = task_data["id"]
    assert task_data["title"] == "Test Task"
    assert task_data["description"] == "This is a test description"
    assert task_data["is_completed"] is False
    assert task_data["user_id"] == str(user_id)

    # 2. Get the created task
    get_response = client.get(
        f"/users/{user_id}/tasks/{task_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["id"] == task_id
    assert get_data["title"] == "Test Task"

    # 3. List tasks for the user
    list_response = client.get(
        f"/users/{user_id}/tasks",
        headers=auth_headers,
    )
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert list_data["total"] == 1
    assert list_data["items"][0]["id"] == task_id

    # 4. Update the task (PATCH)
    update_response = client.patch(
        f"/users/{user_id}/tasks/{task_id}",
        headers=auth_headers,
        json={"title": "Updated Task Title", "is_completed": True},
    )
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["title"] == "Updated Task Title"
    assert updated_data["is_completed"] is True

    # Verify update with GET
    get_updated_response = client.get(
        f"/users/{user_id}/tasks/{task_id}",
        headers=auth_headers,
    )
    assert get_updated_response.status_code == 200
    get_updated_data = get_updated_response.json()
    assert get_updated_data["title"] == "Updated Task Title"
    assert get_updated_data["is_completed"] is True

    # 5. Delete the task
    delete_response = client.delete(
        f"/users/{user_id}/tasks/{task_id}",
        headers=auth_headers,
    )
    assert delete_response.status_code == 204

    # Verify deletion
    get_deleted_response = client.get(
        f"/users/{user_id}/tasks/{task_id}",
        headers=auth_headers,
    )
    assert get_deleted_response.status_code == 404
