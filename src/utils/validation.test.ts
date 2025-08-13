import {
  validateAadhaar,
  validatePAN,
  validateMobile,
  validateEmail,
  validateName,
  validateOTP,
  validateEnterpriseName,
  getValidationError
} from './validation';

describe('Validation Functions', () => {
  describe('validateAadhaar', () => {
    test('should return true for valid 12-digit Aadhaar', () => {
      expect(validateAadhaar('123456789012')).toBe(true);
    });

    test('should return false for Aadhaar with less than 12 digits', () => {
      expect(validateAadhaar('12345678901')).toBe(false);
    });

    test('should return false for Aadhaar with more than 12 digits', () => {
      expect(validateAadhaar('1234567890123')).toBe(false);
    });

    test('should return false for Aadhaar with non-numeric characters', () => {
      expect(validateAadhaar('12345678901A')).toBe(false);
    });
  });

  describe('validatePAN', () => {
    test('should return true for valid PAN format', () => {
      expect(validatePAN('ABCDE1234F')).toBe(true);
    });

    test('should return true for lowercase PAN (converted to uppercase)', () => {
      expect(validatePAN('abcde1234f')).toBe(true);
    });

    test('should return false for invalid PAN format', () => {
      expect(validatePAN('ABCD1234F')).toBe(false);
      expect(validatePAN('ABCDE12345F')).toBe(false);
      expect(validatePAN('12CDE1234F')).toBe(false);
    });
  });

  describe('validateMobile', () => {
    test('should return true for valid mobile numbers starting with 6-9', () => {
      expect(validateMobile('9876543210')).toBe(true);
      expect(validateMobile('6123456789')).toBe(true);
      expect(validateMobile('7987654321')).toBe(true);
      expect(validateMobile('8765432109')).toBe(true);
    });

    test('should return false for mobile numbers not starting with 6-9', () => {
      expect(validateMobile('5876543210')).toBe(false);
      expect(validateMobile('1234567890')).toBe(false);
    });

    test('should return false for mobile numbers not exactly 10 digits', () => {
      expect(validateMobile('987654321')).toBe(false);
      expect(validateMobile('98765432101')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    test('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@company.co.in')).toBe(true);
      expect(validateEmail('test+tag@email.com')).toBe(true);
    });

    test('should return false for invalid email addresses', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
    });
  });

  describe('validateName', () => {
    test('should return true for valid names', () => {
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('Dr. Jane Smith')).toBe(true);
      expect(validateName('Ram Kumar')).toBe(true);
    });

    test('should return false for names with numbers', () => {
      expect(validateName('John123')).toBe(false);
    });

    test('should return false for names with special characters', () => {
      expect(validateName('John@Doe')).toBe(false);
    });

    test('should return false for single character names', () => {
      expect(validateName('A')).toBe(false);
    });
  });

  describe('validateOTP', () => {
    test('should return true for valid 6-digit OTP', () => {
      expect(validateOTP('123456')).toBe(true);
    });

    test('should return false for OTP with less than 6 digits', () => {
      expect(validateOTP('12345')).toBe(false);
    });

    test('should return false for OTP with more than 6 digits', () => {
      expect(validateOTP('1234567')).toBe(false);
    });

    test('should return false for OTP with non-numeric characters', () => {
      expect(validateOTP('12345A')).toBe(false);
    });
  });

  describe('validateEnterpriseName', () => {
    test('should return true for valid enterprise names', () => {
      expect(validateEnterpriseName('ABC Enterprises')).toBe(true);
      expect(validateEnterpriseName('XYZ')).toBe(true);
    });

    test('should return false for names less than 3 characters', () => {
      expect(validateEnterpriseName('AB')).toBe(false);
    });

    test('should return false for names more than 100 characters', () => {
      const longName = 'A'.repeat(101);
      expect(validateEnterpriseName(longName)).toBe(false);
    });
  });

  describe('getValidationError', () => {
    test('should return appropriate error for invalid Aadhaar', () => {
      expect(getValidationError('aadhaar', '')).toBe('Aadhaar number is required');
      expect(getValidationError('aadhaar', '123')).toBe('Aadhaar number must be exactly 12 digits');
      expect(getValidationError('aadhaar', '123456789012')).toBe(null);
    });

    test('should return appropriate error for invalid PAN', () => {
      expect(getValidationError('pan', '')).toBe('PAN is required');
      expect(getValidationError('pan', 'INVALID')).toBe('PAN format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)');
      expect(getValidationError('pan', 'ABCDE1234F')).toBe(null);
    });

    test('should return appropriate error for invalid mobile', () => {
      expect(getValidationError('mobile', '')).toBe('Mobile number is required');
      expect(getValidationError('mobile', '123')).toBe('Mobile number must be 10 digits starting with 6-9');
      expect(getValidationError('mobile', '9876543210')).toBe(null);
    });

    test('should return appropriate error for invalid email', () => {
      expect(getValidationError('email', '')).toBe('Email is required');
      expect(getValidationError('email', 'invalid')).toBe('Please enter a valid email address');
      expect(getValidationError('email', 'test@example.com')).toBe(null);
    });
  });
});