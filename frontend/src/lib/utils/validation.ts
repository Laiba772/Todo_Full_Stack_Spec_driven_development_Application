// src/lib/utils/validation.ts

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 6) errors.push("Password must be at least 6 characters");
  // Add more rules if needed
  return { valid: errors.length === 0, errors };
};

// ✅ Add this for task title validation
export const validateTaskTitle = (title: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!title || title.trim().length === 0) errors.push("Title is required");
  if (title.length > 255) errors.push("Title cannot exceed 255 characters");
  return { valid: errors.length === 0, errors };
};
