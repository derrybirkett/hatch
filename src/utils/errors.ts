/**
 * Custom error class for Hatch CLI errors
 */
export class HatchError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'HatchError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes for different failure scenarios
 */
export const ErrorCodes = {
  INVALID_PROJECT_NAME: 'INVALID_PROJECT_NAME',
  PROJECT_EXISTS: 'PROJECT_EXISTS',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DISK_FULL: 'DISK_FULL',
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  GENERATION_FAILED: 'GENERATION_FAILED',
  INSTALL_FAILED: 'INSTALL_FAILED',
  GIT_INIT_FAILED: 'GIT_INIT_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const;

/**
 * Convert Node.js system errors to Hatch errors with better messages
 */
export function handleSystemError(error: unknown, context: string): HatchError {
  if (error instanceof HatchError) {
    return error;
  }

  const nodeError = error as NodeJS.ErrnoException;
  
  switch (nodeError.code) {
    case 'EACCES':
    case 'EPERM':
      return new HatchError(
        `Permission denied: ${context}. Check your file permissions.`,
        ErrorCodes.PERMISSION_DENIED,
        error
      );
    
    case 'ENOSPC':
      return new HatchError(
        `Not enough disk space: ${context}`,
        ErrorCodes.DISK_FULL,
        error
      );
    
    case 'EEXIST':
      return new HatchError(
        `File or directory already exists: ${context}`,
        ErrorCodes.PROJECT_EXISTS,
        error
      );
    
    case 'ENOENT':
      return new HatchError(
        `File or directory not found: ${context}`,
        ErrorCodes.TEMPLATE_NOT_FOUND,
        error
      );
    
    default:
      return new HatchError(
        `${context}: ${error instanceof Error ? error.message : String(error)}`,
        ErrorCodes.GENERATION_FAILED,
        error
      );
  }
}
