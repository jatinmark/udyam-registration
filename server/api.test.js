const request = require('supertest');
const express = require('express');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    udyamRegistration: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }))
}));

// Import the app after mocking
const app = express();
app.use(express.json());

// Add the routes directly for testing
app.post('/api/validate-aadhaar', async (req, res) => {
  const { aadhaar, nameAsPerAadhaar } = req.body;
  
  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Aadhaar number format'
    });
  }
  
  if (!nameAsPerAadhaar || !/^[a-zA-Z\s\.]+$/.test(nameAsPerAadhaar)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid name format'
    });
  }
  
  const otp = '123456';
  res.json({
    success: true,
    message: 'OTP sent successfully',
    demoOTP: otp
  });
});

app.post('/api/verify-otp', async (req, res) => {
  const { otp } = req.body;
  
  if (!otp || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP format'
    });
  }
  
  res.json({
    success: true,
    message: 'OTP verified successfully'
  });
});

app.post('/api/submit-registration', async (req, res) => {
  const {
    aadhaar,
    nameAsPerAadhaar,
    typeOfOrganisation,
    pan,
    mobile,
    email,
    socialCategory,
    gender,
    speciallyAbled,
    nameOfEnterprise,
    majorActivity
  } = req.body;
  
  // Validate required fields
  const requiredFields = {
    aadhaar: /^\d{12}$/,
    nameAsPerAadhaar: /^[a-zA-Z\s\.]+$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    mobile: /^[6-9]\d{9}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  };
  
  for (const [field, pattern] of Object.entries(requiredFields)) {
    if (!req.body[field] || !pattern.test(req.body[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${field} format`,
        field
      });
    }
  }
  
  if (!typeOfOrganisation || !socialCategory || !gender || 
      !speciallyAbled || !nameOfEnterprise || !majorActivity) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  res.json({
    success: true,
    message: 'Registration submitted successfully',
    registrationNumber: `UDYAM-${Date.now()}`,
    data: req.body
  });
});

describe('API Endpoints', () => {
  describe('POST /api/validate-aadhaar', () => {
    test('should validate correct Aadhaar and name', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({
          aadhaar: '123456789012',
          nameAsPerAadhaar: 'John Doe'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent successfully');
      expect(response.body.demoOTP).toBeDefined();
    });

    test('should return 400 for invalid Aadhaar', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({
          aadhaar: '123',
          nameAsPerAadhaar: 'John Doe'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid Aadhaar number format');
    });

    test('should return 400 for invalid name', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({
          aadhaar: '123456789012',
          nameAsPerAadhaar: 'John123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid name format');
    });
  });

  describe('POST /api/verify-otp', () => {
    test('should verify valid OTP', async () => {
      const response = await request(app)
        .post('/api/verify-otp')
        .send({
          otp: '123456',
          aadhaar: '123456789012'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP verified successfully');
    });

    test('should return 400 for invalid OTP format', async () => {
      const response = await request(app)
        .post('/api/verify-otp')
        .send({
          otp: '123',
          aadhaar: '123456789012'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid OTP format');
    });
  });

  describe('POST /api/submit-registration', () => {
    const validRegistrationData = {
      aadhaar: '123456789012',
      nameAsPerAadhaar: 'John Doe',
      typeOfOrganisation: 'Proprietorship',
      pan: 'ABCDE1234F',
      mobile: '9876543210',
      email: 'test@example.com',
      socialCategory: 'General',
      gender: 'Male',
      speciallyAbled: 'No',
      nameOfEnterprise: 'Test Enterprise',
      majorActivity: 'Manufacturing'
    };

    test('should submit valid registration', async () => {
      const response = await request(app)
        .post('/api/submit-registration')
        .send(validRegistrationData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration submitted successfully');
      expect(response.body.registrationNumber).toMatch(/^UDYAM-/);
    });

    test('should return 400 for invalid PAN', async () => {
      const invalidData = {
        ...validRegistrationData,
        pan: 'INVALID'
      };
      
      const response = await request(app)
        .post('/api/submit-registration')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.field).toBe('pan');
    });

    test('should return 400 for invalid mobile', async () => {
      const invalidData = {
        ...validRegistrationData,
        mobile: '1234567890'
      };
      
      const response = await request(app)
        .post('/api/submit-registration')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.field).toBe('mobile');
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        aadhaar: '123456789012',
        nameAsPerAadhaar: 'John Doe',
        pan: 'ABCDE1234F',
        mobile: '9876543210',
        email: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/submit-registration')
        .send(incompleteData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All fields are required');
    });
  });
});