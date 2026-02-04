// Normalized application error type
export interface AppError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // For 422 validation errors
  code?: string;
}

// Convert various error types to AppError
export const normalizeError = (error: any): AppError => {
  // Network error
  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    };
  }

  // API error response
  const status = error.response?.status;
  const data = error.response?.data;

  return {
    message: data?.message || 'An error occurred. Please try again.',
    status,
    errors: data?.errors,
    code: error.code,
  };
};

// Check if error is validation error (422)
export const isValidationError = (error: AppError): boolean => {
  return error.status === 422 && !!error.errors;
};

// Check if error is unauthorized (401)
export const isUnauthorizedError = (error: AppError): boolean => {
  return error.status === 401;
};

// Get field error from validation errors
export const getFieldError = (
  errors: Record<string, string[]> | undefined,
  field: string
): string | undefined => {
  if (!errors || !errors[field]) return undefined;
  return errors[field][0]; // Return first error message
};
