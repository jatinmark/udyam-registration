import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    udyamRegistration: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('Udyam Registration API', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('POST /api/udyam-registration', () => {
    const validRegistrationData = {
      aadhaar: '123456789012',
      nameAsPerAadhaar: 'John Doe',
      typeOfOrganisation: 'proprietorship',
      pan: 'ABCDE1234F',
      mobile: '9876543210',
      email: 'test@example.com',
      socialCategory: 'general',
      gender: 'male',
      speciallyAbled: 'no',
      nameOfEnterprise: 'Test Enterprise',
      majorActivity: 'manufacturing',
    };

    test('should create a new registration successfully', async () => {
      const mockRegistration = {
        id: 1,
        ...validRegistrationData,
        speciallyAbled: false,
        registrationNumber: 'UDYAM-2024-123456',
        registrationDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      prisma.udyamRegistration.findUnique.mockResolvedValueOnce(null); // No existing Aadhaar
      prisma.udyamRegistration.findUnique.mockResolvedValueOnce(null); // No existing PAN
      prisma.udyamRegistration.findUnique.mockResolvedValueOnce(null); // No existing registration number
      prisma.udyamRegistration.create.mockResolvedValue(mockRegistration);

      const request = new NextRequest('http://localhost:3000/api/udyam-registration', {
        method: 'POST',
        body: JSON.stringify(validRegistrationData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.registrationNumber).toBe('UDYAM-2024-123456');
      expect(prisma.udyamRegistration.create).toHaveBeenCalledTimes(1);
    });

    test('should return error for duplicate Aadhaar', async () => {
      prisma.udyamRegistration.findUnique.mockResolvedValueOnce({
        id: 1,
        aadhaar: validRegistrationData.aadhaar,
      });

      const request = new NextRequest('http://localhost:3000/api/udyam-registration', {
        method: 'POST',
        body: JSON.stringify(validRegistrationData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('This Aadhaar number is already registered');
      expect(prisma.udyamRegistration.create).not.toHaveBeenCalled();
    });

    test('should return error for duplicate PAN', async () => {
      prisma.udyamRegistration.findUnique.mockResolvedValueOnce(null); // No existing Aadhaar
      prisma.udyamRegistration.findUnique.mockResolvedValueOnce({
        id: 1,
        pan: validRegistrationData.pan,
      });

      const request = new NextRequest('http://localhost:3000/api/udyam-registration', {
        method: 'POST',
        body: JSON.stringify(validRegistrationData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('This PAN is already registered');
      expect(prisma.udyamRegistration.create).not.toHaveBeenCalled();
    });

    test('should return error for missing required fields', async () => {
      const incompleteData = {
        aadhaar: '123456789012',
        nameAsPerAadhaar: 'John Doe',
        // Missing other required fields
      };

      const request = new NextRequest('http://localhost:3000/api/udyam-registration', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required field');
      expect(prisma.udyamRegistration.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/udyam-registration', () => {
    test('should retrieve registration by registration number', async () => {
      const mockRegistration = {
        id: 1,
        aadhaar: '123456789012',
        nameAsPerAadhaar: 'John Doe',
        registrationNumber: 'UDYAM-2024-123456',
        registrationDate: new Date('2024-01-01'),
      };

      prisma.udyamRegistration.findUnique.mockResolvedValue(mockRegistration);

      const request = new NextRequest(
        'http://localhost:3000/api/udyam-registration?registrationNumber=UDYAM-2024-123456'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.registrationNumber).toBe('UDYAM-2024-123456');
      expect(prisma.udyamRegistration.findUnique).toHaveBeenCalledWith({
        where: { registrationNumber: 'UDYAM-2024-123456' },
      });
    });

    test('should retrieve registration by Aadhaar', async () => {
      const mockRegistration = {
        id: 1,
        aadhaar: '123456789012',
        nameAsPerAadhaar: 'John Doe',
        registrationNumber: 'UDYAM-2024-123456',
      };

      prisma.udyamRegistration.findUnique.mockResolvedValue(mockRegistration);

      const request = new NextRequest(
        'http://localhost:3000/api/udyam-registration?aadhaar=123456789012'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.aadhaar).toBe('123456789012');
      expect(prisma.udyamRegistration.findUnique).toHaveBeenCalledWith({
        where: { aadhaar: '123456789012' },
      });
    });

    test('should retrieve all registrations when no parameters provided', async () => {
      const mockRegistrations = [
        {
          id: 1,
          aadhaar: '123456789012',
          registrationNumber: 'UDYAM-2024-123456',
        },
        {
          id: 2,
          aadhaar: '987654321098',
          registrationNumber: 'UDYAM-2024-789012',
        },
      ];

      prisma.udyamRegistration.findMany.mockResolvedValue(mockRegistrations);

      const request = new NextRequest('http://localhost:3000/api/udyam-registration');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(prisma.udyamRegistration.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    });

    test('should return 404 for non-existent registration', async () => {
      prisma.udyamRegistration.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost:3000/api/udyam-registration?registrationNumber=INVALID'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Registration not found');
    });
  });
});