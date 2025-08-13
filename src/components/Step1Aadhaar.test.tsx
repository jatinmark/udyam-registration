import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step1Aadhaar from './Step1Aadhaar';

describe('Step1Aadhaar Component', () => {
  const mockOnComplete = jest.fn();
  const initialData = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields correctly', () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    expect(screen.getByLabelText(/Aadhaar Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name as per Aadhaar/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Validate & Proceed/i })).toBeInTheDocument();
  });

  test('validates Aadhaar number format', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Test invalid Aadhaar (less than 12 digits)
    fireEvent.change(aadhaarInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Aadhaar number must be exactly 12 digits/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('validates name field', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const nameInput = screen.getByLabelText(/Name as per Aadhaar/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Test empty name
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Name as per Aadhaar is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('validates disclaimer checkbox', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i);
    const nameInput = screen.getByLabelText(/Name as per Aadhaar/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Fill valid data but don't check disclaimer
    fireEvent.change(aadhaarInput, { target: { value: '123456789012' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/You must accept the declaration/i)).toBeInTheDocument();
    });
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('successfully validates and proceeds to next step', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i);
    const nameInput = screen.getByLabelText(/Name as per Aadhaar/i);
    const disclaimerCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Fill valid data
    fireEvent.change(aadhaarInput, { target: { value: '123456789012' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(disclaimerCheckbox);
    fireEvent.click(submitButton);
    
    // Wait for validation
    await waitFor(() => {
      expect(screen.getByText(/Validating.../i)).toBeInTheDocument();
    });
    
    // Wait for completion
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        aadhaar: '123456789012',
        nameAsPerAadhaar: 'John Doe',
        disclaimer: true
      });
    }, { timeout: 2000 });
  });

  test('only accepts numeric input for Aadhaar', () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i) as HTMLInputElement;
    
    // Try to input non-numeric characters
    fireEvent.change(aadhaarInput, { target: { value: '123abc456789' } });
    
    // Should only keep numeric characters
    expect(aadhaarInput.value).toBe('123456789');
  });

  test('loads initial data correctly', () => {
    const prefilledData = {
      aadhaar: '987654321098',
      nameAsPerAadhaar: 'Jane Smith',
      disclaimer: true
    };
    
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={prefilledData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/Name as per Aadhaar/i) as HTMLInputElement;
    const disclaimerCheckbox = screen.getByRole('checkbox') as HTMLInputElement;
    
    expect(aadhaarInput.value).toBe('987654321098');
    expect(nameInput.value).toBe('Jane Smith');
    expect(disclaimerCheckbox.checked).toBe(true);
  });

  test('clears error messages when user starts typing', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i);
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Trigger validation error
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Aadhaar number is required/i)).toBeInTheDocument();
    });
    
    // Start typing to clear error
    fireEvent.change(aadhaarInput, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Aadhaar number is required/i)).not.toBeInTheDocument();
    });
  });

  test('shows loading state during validation', async () => {
    render(<Step1Aadhaar onComplete={mockOnComplete} initialData={initialData} />);
    
    const aadhaarInput = screen.getByLabelText(/Aadhaar Number/i);
    const nameInput = screen.getByLabelText(/Name as per Aadhaar/i);
    const disclaimerCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Validate & Proceed/i });
    
    // Fill valid data
    fireEvent.change(aadhaarInput, { target: { value: '123456789012' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(disclaimerCheckbox);
    fireEvent.click(submitButton);
    
    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/Validating.../i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });
});