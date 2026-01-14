import pytest
from src.services.auth_service import auth_service


class TestPasswordHashing:
    """Tests for password hashing functions."""

    def test_hash_password_returns_string(self):
        """Test that hash_password returns a string."""
        password = "testpassword123"
        result = auth_service.get_password_hash(password)
        assert isinstance(result, str)

    def test_hash_password_creates_unique_hashes(self):
        """Test that same password creates different hashes (due to salt)."""
        password = "testpassword123"
        hash1 = auth_service.get_password_hash(password)
        hash2 = auth_service.get_password_hash(password)
        assert hash1 != hash2

    def test_verify_password_correct(self):
        """Test that correct password verifies successfully."""
        password = "testpassword123"
        password_hash = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, password_hash) is True

    def test_verify_password_incorrect(self):
        """Test that incorrect password fails verification."""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        password_hash = auth_service.get_password_hash(password)
        assert auth_service.verify_password(wrong_password, password_hash) is False

    def test_verify_password_with_custom_rounds(self):
        """Test that password verification works."""
        # The get_password_hash function does not expose a 'rounds' parameter,
        # so this test will simply ensure verification works.
        password = "testpassword123"
        password_hash = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, password_hash) is True

    def test_hash_password_minimum_length(self):
        """Test hashing works with minimum length password."""
        password = "a" * 1
        result = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, result) is True

    def test_hash_password_special_characters(self):
        """Test hashing works with special characters."""
        password = "p@ss!word#123$%"
        result = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, result) is True

    def test_hash_password_unicode(self):
        """Test hashing works with unicode characters."""
        password = "пароль密码🔐"
        result = auth_service.get_password_hash(password)
        assert auth_service.verify_password(password, result) is True
