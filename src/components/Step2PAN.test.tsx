import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step2PAN from './Step2PAN';

// Mock fetch API
global.fetch = jest.fn();

describe('Step2PAN Component', () => {
  const mockOnComplete = jest.fn();
  const mockOnBack = jest.fn();
  const step1Data = {
    aadhaar: '123456789012',
    nameAsPerAadhaar: 'John Doe',
    disclaimer: true
  };
  const initialData = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test('renders all form fields correctly', () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    expect(screen.getByLabelText(/Type of Organisation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PAN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Social Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name of Enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Specially Abled/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Validate & Save/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Type of Organisation is required/i)).toBeInTheDocument();
      expect(screen.getByText(/PAN is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Mobile number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('validates PAN format', async () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const panInput = screen.getByLabelText(/PAN/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    
    fireEvent.change(panInput, { target: { value: 'INVALID123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid PAN format/i)).toBeInTheDocument();
    });
    
    expect(fetch).not.toHaveBeenCalled();
  });

  test('validates mobile number format', async () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    
    fireEvent.change(mobileInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Mobile number must be 10 digits/i)).toBeInTheDocument();
    });
    
    expect(fetch).not.toHaveBeenCalled();
  });

  test('successfully saves registration to database', async () => {
    const mockResponse = {
      success: true,
      data: {
        registrationNumber: 'UDYAM-2024-123456',
        registrationDate: '2024-01-01T00:00:00Z',
        id: 1
      }
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Type of Organisation/i), { 
      target: { value: 'proprietorship' } 
    });
    fireEvent.change(screen.getByLabelText(/PAN/i), { 
      target: { value: 'ABCDE1234F' } 
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { 
      target: { value: '9876543210' } 
    });
    fireEvent.change(screen.getByLabelText(/Email ID/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Social Category/i), { 
      target: { value: 'general' } 
    });
    fireEvent.change(screen.getByLabelText(/Major Activity/i), { 
      target: { value: 'manufacturing' } 
    });
    fireEvent.change(screen.getByLabelText(/Name of Enterprise/i), { 
      target: { value: 'Test Enterprise' } 
    });
    
    // Select gender
    const maleRadio = screen.getByLabelText(/Male/i);
    fireEvent.click(maleRadio);
    
    // Select specially abled
    const noRadio = screen.getByLabelText(/No/i);
    fireEvent.click(noRadio);
    
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/udyam-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...step1Data,
          typeOfOrganisation: 'proprietorship',
          pan: 'ABCDE1234F',
          mobile: '9876543210',
          email: 'test@example.com',
          socialCategory: 'general',
          gender: 'male',
          speciallyAbled: 'no',
          nameOfEnterprise: 'Test Enterprise',
          majorActivity: 'manufacturing'
        })
      });
    });
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        typeOfOrganisation: 'proprietorship',
        pan: 'ABCDE1234F',
        mobile: '9876543210',
        email: 'test@example.com',
        socialCategory: 'general',
        gender: 'male',
        speciallyAbled: 'no',
        nameOfEnterprise: 'Test Enterprise',
        majorActivity: 'manufacturing',
        registrationNumber: 'UDYAM-2024-123456',
        registrationDate: '2024-01-01T00:00:00Z',
        registrationId: 1
      });
    });
  });

  test('handles API error for duplicate registration', async () => {
    const mockResponse = {
      success: false,
      error: 'This PAN is already registered'
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockResponse
    });
    
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Type of Organisation/i), { 
      target: { value: 'proprietorship' } 
    });
    fireEvent.change(screen.getByLabelText(/PAN/i), { 
      target: { value: 'ABCDE1234F' } 
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { 
      target: { value: '9876543210' } 
    });
    fireEvent.change(screen.getByLabelText(/Email ID/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Social Category/i), { 
      target: { value: 'general' } 
    });
    fireEvent.change(screen.getByLabelText(/Major Activity/i), { 
      target: { value: 'manufacturing' } 
    });
    fireEvent.change(screen.getByLabelText(/Name of Enterprise/i), { 
      target: { value: 'Test Enterprise' } 
    });
    
    const maleRadio = screen.getByLabelText(/Male/i);
    fireEvent.click(maleRadio);
    
    const noRadio = screen.getByLabelText(/No/i);
    fireEvent.click(noRadio);
    
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/This PAN is already registered/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('handles network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Type of Organisation/i), { 
      target: { value: 'proprietorship' } 
    });
    fireEvent.change(screen.getByLabelText(/PAN/i), { 
      target: { value: 'ABCDE1234F' } 
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { 
      target: { value: '9876543210' } 
    });
    fireEvent.change(screen.getByLabelText(/Email ID/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Social Category/i), { 
      target: { value: 'general' } 
    });
    fireEvent.change(screen.getByLabelText(/Major Activity/i), { 
      target: { value: 'manufacturing' } 
    });
    fireEvent.change(screen.getByLabelText(/Name of Enterprise/i), { 
      target: { value: 'Test Enterprise' } 
    });
    
    const maleRadio = screen.getByLabelText(/Male/i);
    fireEvent.click(maleRadio);
    
    const noRadio = screen.getByLabelText(/No/i);
    fireEvent.click(noRadio);
    
    const submitButton = screen.getByRole('button', { name: /Validate & Save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Network error. Please check your connection/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('reset button clears all fields', () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    // Fill some fields
    fireEvent.change(screen.getByLabelText(/PAN/i), { 
      target: { value: 'ABCDE1234F' } 
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { 
      target: { value: '9876543210' } 
    });
    
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);
    
    const panInput = screen.getByLabelText(/PAN/i) as HTMLInputElement;
    const mobileInput = screen.getByLabelText(/Mobile Number/i) as HTMLInputElement;
    
    expect(panInput.value).toBe('');
    expect(mobileInput.value).toBe('');
  });

  test('back button calls onBack callback', () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('converts PAN input to uppercase', () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const panInput = screen.getByLabelText(/PAN/i) as HTMLInputElement;
    
    fireEvent.change(panInput, { target: { value: 'abcde1234f' } });
    
    expect(panInput.value).toBe('ABCDE1234F');
  });

  test('only accepts numeric input for mobile', () => {
    render(
      <Step2PAN 
        onComplete={mockOnComplete} 
        onBack={mockOnBack} 
        initialData={initialData}
        step1Data={step1Data}
      />
    );
    
    const mobileInput = screen.getByLabelText(/Mobile Number/i) as HTMLInputElement;
    
    fireEvent.change(mobileInput, { target: { value: '98abc76543' } });
    
    expect(mobileInput.value).toBe('9876543');
  });
});