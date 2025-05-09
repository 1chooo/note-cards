import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse } from 'next/server';
import * as lineServices from '@/services/line-bot-services';
import { dynamic } from '@/app/api/line/expire-products-broadcast/route';
import { POST, GET, PUT, DELETE, PATCH } from '@/app/api/line/expire-products-broadcast/route'; // Adjust the path based on your file structure

// Mock the line-bot-services module
vi.mock('@/services/line-bot-services', () => ({
  getExpireProductsListBroadcast: vi.fn(),
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ data, options })),
  },
}));

describe('Broadcast API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST method', () => {
    it('should return 200 status when broadcast is successful', async () => {
      // Arrange
      const mockBroadcast = vi.mocked(lineServices.getExpireProductsListBroadcast);
      mockBroadcast.mockResolvedValueOnce({});

      // Act
      const response = await POST();

      // Assert
      expect(mockBroadcast).toHaveBeenCalledTimes(1);
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Broadcast successful' },
        { status: 200 }
      );
      expect(response).toEqual({
        data: { message: 'Broadcast successful' },
        options: { status: 200 }
      });
    });

    it('should return 500 status when broadcast fails', async () => {
      // Arrange
      const mockError = new Error('Broadcast failed');
      const mockBroadcast = vi.mocked(lineServices.getExpireProductsListBroadcast);
      mockBroadcast.mockRejectedValueOnce(mockError);
      
      // Mock console.log to prevent error output during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      const response = await POST();

      // Assert
      expect(mockBroadcast).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
      expect(response).toEqual({
        data: { message: 'Internal Server Error' },
        options: { status: 500 }
      });
    });
  });

  describe('Other HTTP methods', () => {
    it('should return 405 status for GET requests', async () => {
      // Act
      const response = await GET();

      // Assert
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Method Not Allowed' },
        { status: 405 }
      );
      expect(response).toEqual({
        data: { message: 'Method Not Allowed' },
        options: { status: 405 }
      });
    });

    it('should return 405 status for PUT requests', async () => {
      // Act
      const response = await PUT();

      // Assert
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Method Not Allowed' },
        { status: 405 }
      );
      expect(response).toEqual({
        data: { message: 'Method Not Allowed' },
        options: { status: 405 }
      });
    });

    it('should return 405 status for DELETE requests', async () => {
      // Act
      const response = await DELETE();

      // Assert
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Method Not Allowed' },
        { status: 405 }
      );
      expect(response).toEqual({
        data: { message: 'Method Not Allowed' },
        options: { status: 405 }
      });
    });

    it('should return 405 status for PATCH requests', async () => {
      // Act
      const response = await PATCH();

      // Assert
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Method Not Allowed' },
        { status: 405 }
      );
      expect(response).toEqual({
        data: { message: 'Method Not Allowed' },
        options: { status: 405 }
      });
    });
  });

  describe('dynamic export', () => {
    it('should have force-dynamic setting', () => {
      // Import the dynamic export from the route file
      // Assert that dynamic is set to force-dynamic
      expect(dynamic).toBe('force-dynamic');
    });
  });
});
