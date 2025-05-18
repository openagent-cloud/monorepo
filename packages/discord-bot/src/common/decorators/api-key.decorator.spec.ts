import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import * as decorators from './api-key.decorator';

// Extract the factory functions directly from the decorators
const extractApiKey = (decorators as any).extractApiKey;
const extractAdminKey = (decorators as any).extractAdminKey;

describe('API Key Decorators', () => {
  describe('extractApiKey function', () => {
    it('should extract API key from x-api-key header', () => {
      const expectedApiKey = 'tnnt_test123';
      const mockRequest = {
        headers: {
          'x-api-key': expectedApiKey
        }
      };
      
      const result = extractApiKey(mockRequest);
      expect(result).toBe(expectedApiKey);
    });

    it('should extract API key from Bearer token', () => {
      const expectedApiKey = 'tnnt_test123';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${expectedApiKey}`
        }
      };
      
      const result = extractApiKey(mockRequest);
      expect(result).toBe(expectedApiKey);
    });

    it('should throw UnauthorizedException if no API key is provided', () => {
      const mockRequest = {
        headers: {}
      };
      
      expect(() => extractApiKey(mockRequest)).toThrow(UnauthorizedException);
    });
  });

  describe('extractAdminKey function', () => {
    it('should extract admin key from x-admin-key header', () => {
      const expectedAdminKey = 'admin_test123';
      const mockRequest = {
        headers: {
          'x-admin-key': expectedAdminKey
        }
      };
      
      const result = extractAdminKey(mockRequest);
      expect(result).toBe(expectedAdminKey);
    });

    it('should throw UnauthorizedException if no admin key is provided', () => {
      const mockRequest = {
        headers: {}
      };
      
      expect(() => extractAdminKey(mockRequest)).toThrow(UnauthorizedException);
    });
  });
});
