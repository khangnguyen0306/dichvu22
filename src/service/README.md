# Service Layer Documentation

This directory contains all the API service modules for the DịchVụPro application. Each service is responsible for handling specific API endpoints and business logic.

## Services Overview

### 1. Authentication Service (`authService.js`)
Handles user authentication and authorization:
- Login/Logout
- User registration
- Password reset
- Email verification
- Token management

### 2. Product Service (`productService.js`)
Manages product-related operations for sellers:
- CRUD operations for products
- Product image upload
- Product status management
- Product search and filtering
- Product analytics

### 3. Category Service (`categoryService.js`)
Handles category management for admins:
- CRUD operations for categories
- Category hierarchy management
- Category image upload
- Bulk operations
- Category analytics

### 4. User Service (`userService.js`)
Manages user operations for admins:
- CRUD operations for users
- User role management
- User profile management
- User statistics and analytics
- Bulk user operations

### 5. Booking Service (`bookingService.js`)
Handles service booking operations:
- Create and manage bookings
- Booking status management
- Availability checking
- Booking calendar
- Booking analytics

## API Configuration (`apiConfig.js`)

Shared configuration for all API calls:
- Base URL configuration
- Authentication token handling
- Error handling
- Request/response interceptors
- File upload utilities

## Usage Examples

### Authentication
```javascript
import { authService } from '@/service';

// Login
try {
    const result = await authService.login('user@example.com', 'password');
    console.log('Login successful:', result);
} catch (error) {
    console.error('Login failed:', error.message);
}

// Register
try {
    const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    };
    const result = await authService.register(userData);
    console.log('Registration successful:', result);
} catch (error) {
    console.error('Registration failed:', error.message);
}
```

### Product Management
```javascript
import { productService } from '@/service';

// Get seller's products
try {
    const products = await productService.getSellerProducts({
        page: 1,
        limit: 10,
        status: 'active'
    });
    console.log('Products:', products);
} catch (error) {
    console.error('Failed to fetch products:', error.message);
}

// Create new product
try {
    const productData = {
        name: 'New Service',
        description: 'Service description',
        price: 100,
        categoryId: 'category-id'
    };
    const product = await productService.createProduct(productData);
    console.log('Product created:', product);
} catch (error) {
    console.error('Failed to create product:', error.message);
}
```

### Category Management
```javascript
import { categoryService } from '@/service';

// Get all categories
try {
    const categories = await categoryService.getCategories();
    console.log('Categories:', categories);
} catch (error) {
    console.error('Failed to fetch categories:', error.message);
}

// Create new category
try {
    const categoryData = {
        name: 'New Category',
        description: 'Category description',
        parentId: null
    };
    const category = await categoryService.createCategory(categoryData);
    console.log('Category created:', category);
} catch (error) {
    console.error('Failed to create category:', error.message);
}
```

### User Management
```javascript
import { userService } from '@/service';

// Get all users
try {
    const users = await userService.getUsers({
        page: 1,
        limit: 20,
        role: 'seller'
    });
    console.log('Users:', users);
} catch (error) {
    console.error('Failed to fetch users:', error.message);
}

// Update user role
try {
    await userService.updateUserRole('user-id', 'admin');
    console.log('User role updated successfully');
} catch (error) {
    console.error('Failed to update user role:', error.message);
}
```

### Booking Management
```javascript
import { bookingService } from '@/service';

// Create booking
try {
    const bookingData = {
        serviceId: 'service-id',
        date: '2024-01-15',
        time: '14:00',
        notes: 'Customer notes'
    };
    const booking = await bookingService.createBooking(bookingData);
    console.log('Booking created:', booking);
} catch (error) {
    console.error('Failed to create booking:', error.message);
}

// Get available time slots
try {
    const slots = await bookingService.getAvailableTimeSlots('service-id', '2024-01-15');
    console.log('Available slots:', slots);
} catch (error) {
    console.error('Failed to fetch time slots:', error.message);
}
```

## Error Handling

All services use consistent error handling:
- Network errors are caught and formatted
- API errors return the server's error message
- Authentication errors automatically redirect to login
- All errors are thrown with a consistent format

## Environment Configuration

Set the API base URL in your environment variables:
```env
VITE_API_URL=http://localhost:3000/api
```

## File Upload

For file uploads, use the `uploadFile` utility:
```javascript
import { uploadFile } from '@/service/apiConfig';

try {
    const result = await uploadFile('/upload/avatar', file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
    });
    console.log('Upload successful:', result);
} catch (error) {
    console.error('Upload failed:', error.message);
}
```

## Authentication Flow

1. User logs in → token stored in localStorage
2. All subsequent requests include the token
3. 401 responses automatically redirect to login
4. Token is removed on logout or expiration

## Best Practices

1. Always wrap service calls in try-catch blocks
2. Use the provided error handling utilities
3. Check authentication status before making requests
4. Handle loading states in your components
5. Use the shared API configuration for consistency 