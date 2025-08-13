export const validationPatterns = {
  aadhaar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  mobile: /^[6-9]\d{9}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[a-zA-Z\s\.]+$/,
  otp: /^\d{6}$/
};

export const validateAadhaar = (aadhaar: string): boolean => {
  return validationPatterns.aadhaar.test(aadhaar);
};

export const validatePAN = (pan: string): boolean => {
  return validationPatterns.pan.test(pan.toUpperCase());
};

export const validateMobile = (mobile: string): boolean => {
  return validationPatterns.mobile.test(mobile);
};

export const validateEmail = (email: string): boolean => {
  return validationPatterns.email.test(email);
};

export const validateName = (name: string): boolean => {
  return validationPatterns.name.test(name) && name.length >= 2;
};

export const validateOTP = (otp: string): boolean => {
  return validationPatterns.otp.test(otp);
};

export const validateEnterpriseName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

export const getValidationError = (field: string, value: string): string | null => {
  switch (field) {
    case 'aadhaar':
      if (!value) return 'Aadhaar number is required';
      if (!validateAadhaar(value)) return 'Aadhaar number must be exactly 12 digits';
      return null;
      
    case 'pan':
      if (!value) return 'PAN is required';
      if (!validatePAN(value)) return 'PAN format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)';
      return null;
      
    case 'mobile':
      if (!value) return 'Mobile number is required';
      if (!validateMobile(value)) return 'Mobile number must be 10 digits starting with 6-9';
      return null;
      
    case 'email':
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;
      
    case 'nameAsPerAadhaar':
      if (!value) return 'Name is required';
      if (!validateName(value)) return 'Name should contain only letters, spaces and dots';
      return null;
      
    case 'otp':
      if (!value) return 'OTP is required';
      if (!validateOTP(value)) return 'OTP must be exactly 6 digits';
      return null;
      
    case 'nameOfEnterprise':
      if (!value) return 'Enterprise name is required';
      if (!validateEnterpriseName(value)) return 'Enterprise name should be between 3 to 100 characters';
      return null;
      
    default:
      if (!value) return `${field} is required`;
      return null;
  }
};