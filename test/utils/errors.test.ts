import { describe, it, expect } from 'vitest';
import { HatchError, handleSystemError, ErrorCodes } from '../../src/utils/errors';

describe('HatchError', () => {
  it('should create error with message', () => {
    const error = new HatchError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('HatchError');
  });

  it('should create error with code', () => {
    const error = new HatchError('Test error', ErrorCodes.INVALID_PROJECT_NAME);
    expect(error.code).toBe(ErrorCodes.INVALID_PROJECT_NAME);
  });

  it('should create error with details', () => {
    const details = { extra: 'info' };
    const error = new HatchError('Test error', ErrorCodes.GENERATION_FAILED, details);
    expect(error.details).toEqual(details);
  });

  it('should be instanceof Error', () => {
    const error = new HatchError('Test error');
    expect(error instanceof Error).toBe(true);
  });
});

describe('handleSystemError', () => {
  it('should return HatchError as-is', () => {
    const original = new HatchError('Original error', ErrorCodes.PROJECT_EXISTS);
    const result = handleSystemError(original, 'Context');
    expect(result).toBe(original);
  });

  it('should convert EACCES to permission denied error', () => {
    const nodeError = Object.assign(new Error('Permission denied'), {
      code: 'EACCES',
    });
    
    const result = handleSystemError(nodeError, 'Creating directory');
    expect(result.code).toBe(ErrorCodes.PERMISSION_DENIED);
    expect(result.message).toContain('Permission denied');
    expect(result.message).toContain('Creating directory');
  });

  it('should convert EPERM to permission denied error', () => {
    const nodeError = Object.assign(new Error('Operation not permitted'), {
      code: 'EPERM',
    });
    
    const result = handleSystemError(nodeError, 'Writing file');
    expect(result.code).toBe(ErrorCodes.PERMISSION_DENIED);
  });

  it('should convert ENOSPC to disk full error', () => {
    const nodeError = Object.assign(new Error('No space left'), {
      code: 'ENOSPC',
    });
    
    const result = handleSystemError(nodeError, 'Installing dependencies');
    expect(result.code).toBe(ErrorCodes.DISK_FULL);
    expect(result.message).toContain('disk space');
  });

  it('should convert EEXIST to project exists error', () => {
    const nodeError = Object.assign(new Error('File exists'), {
      code: 'EEXIST',
    });
    
    const result = handleSystemError(nodeError, 'Project creation');
    expect(result.code).toBe(ErrorCodes.PROJECT_EXISTS);
  });

  it('should convert ENOENT to template not found error', () => {
    const nodeError = Object.assign(new Error('Not found'), {
      code: 'ENOENT',
    });
    
    const result = handleSystemError(nodeError, 'Reading template');
    expect(result.code).toBe(ErrorCodes.TEMPLATE_NOT_FOUND);
  });

  it('should handle unknown error codes as generation failed', () => {
    const nodeError = Object.assign(new Error('Random error'), {
      code: 'UNKNOWN',
    });
    
    const result = handleSystemError(nodeError, 'Some operation');
    expect(result.code).toBe(ErrorCodes.GENERATION_FAILED);
    expect(result.message).toContain('Some operation');
  });

  it('should handle non-Error objects', () => {
    const error = 'String error';
    const result = handleSystemError(error, 'Context');
    expect(result.code).toBe(ErrorCodes.GENERATION_FAILED);
    expect(result.message).toContain('Context');
  });
});

describe('ErrorCodes', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCodes.INVALID_PROJECT_NAME).toBe('INVALID_PROJECT_NAME');
    expect(ErrorCodes.PROJECT_EXISTS).toBe('PROJECT_EXISTS');
    expect(ErrorCodes.PERMISSION_DENIED).toBe('PERMISSION_DENIED');
    expect(ErrorCodes.DISK_FULL).toBe('DISK_FULL');
    expect(ErrorCodes.TEMPLATE_NOT_FOUND).toBe('TEMPLATE_NOT_FOUND');
    expect(ErrorCodes.GENERATION_FAILED).toBe('GENERATION_FAILED');
    expect(ErrorCodes.INSTALL_FAILED).toBe('INSTALL_FAILED');
    expect(ErrorCodes.GIT_INIT_FAILED).toBe('GIT_INIT_FAILED');
    expect(ErrorCodes.INVALID_CONFIG).toBe('INVALID_CONFIG');
  });
});
