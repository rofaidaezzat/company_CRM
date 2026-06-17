// Auth Validation rules compatible with the backend

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

export interface ValidationError {
  isValid: boolean;
  errors: Record<string, string>;
}

// 1. Login Validation
export interface LoginData {
  email?: string;
  password?: string;
}

export function validateLogin(data: LoginData): ValidationError {
  const errors: Record<string, string> = {};
  
  const email = data.email?.trim() || '';
  const password = data.password || '';

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 2. Forgot Password Validation
export function validateForgotPassword(email?: string): ValidationError {
  const errors: Record<string, string> = {};
  const trimmedEmail = email?.trim() || '';

  if (!trimmedEmail) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Invalid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 3. Reset Password Validation
export interface ResetPasswordData {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateResetPassword(data: ResetPasswordData): ValidationError {
  const errors: Record<string, string> = {};
  
  const email = data.email?.trim() || '';
  const password = data.password || '';
  const confirmPassword = data.confirmPassword || '';

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  }

  if (confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 4. Verify OTP Validation
export function validateOtp(otpCode?: string): ValidationError {
  const errors: Record<string, string> = {};
  const code = otpCode?.trim() || '';

  if (!code) {
    errors.otp = 'OTP is required';
  } else if (code.length !== 6) {
    errors.otp = 'OTP must be exactly 6 characters';
  } else if (isNaN(Number(code))) {
    errors.otp = 'OTP must contain only numbers';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// 5. User Registration Validation
export interface RegisterData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  user_type_id?: number;
  gender?: 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
  tenant?: {
    tenant_name: string;
    description: string;
    industry: string;
    company_size: string;
    contact_email: string;
    contact_phone: string;
    website?: string;
    address?: string;
  };
  sales?: {
    phone: string;
    city: string;
    country?: string;
    address?: string;
    avatar?: string;
  };
}

export function validateRegister(data: RegisterData): ValidationError {
  const errors: Record<string, string> = {};

  const firstName = data.first_name?.trim() || '';
  const lastName = data.last_name?.trim() || '';
  const email = data.email?.trim() || '';
  const password = data.password || '';
  const userTypeId = data.user_type_id;

  if (!firstName) errors.first_name = 'First name is required';
  if (!lastName) errors.last_name = 'Last name is required';
  
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number';
  }

  if (!userTypeId) {
    errors.user_type_id = 'User type is required';
  } else if (![3, 4, 5].includes(userTypeId)) {
    errors.user_type_id = 'Invalid user type selection';
  }

  // Tenant specifics
  if (userTypeId === 3) {
    if (!data.tenant) {
      errors.tenant = 'Tenant information is required';
    } else {
      if (!data.tenant.tenant_name?.trim()) errors['tenant.tenant_name'] = 'Company name is required';
      if (!data.tenant.description?.trim()) errors['tenant.description'] = 'Company description is required';
      if (!data.tenant.industry?.trim()) errors['tenant.industry'] = 'Industry is required';
      if (!data.tenant.company_size?.trim()) errors['tenant.company_size'] = 'Company size is required';
      
      const cEmail = data.tenant.contact_email?.trim() || '';
      if (!cEmail) {
        errors['tenant.contact_email'] = 'Contact email is required';
      } else if (!isValidEmail(cEmail)) {
        errors['tenant.contact_email'] = 'Invalid contact email address';
      }

      if (!data.tenant.contact_phone?.trim()) errors['tenant.contact_phone'] = 'Contact phone is required';
    }
  }

  // Sales specifics
  if (userTypeId === 4 || userTypeId === 5) {
    if (!data.sales) {
      errors.sales = 'Sales Representative details are required';
    } else {
      if (!data.sales.phone?.trim()) errors['sales.phone'] = 'Phone number is required';
      if (!data.sales.city?.trim()) errors['sales.city'] = 'City is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
