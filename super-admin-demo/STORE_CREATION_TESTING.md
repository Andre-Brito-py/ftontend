# Store Creation with Google Sign-in - Testing Guide

## Overview
This guide explains how to test the store creation functionality with Google Sign-in integration in the Super Admin Demo.

## Prerequisites
1. Backend API running on `http://localhost:4002`
2. Google OAuth credentials configured
3. Super admin authentication working

## Configuration

### 1. Environment Setup
Copy the `.env.example` file to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `VITE_BACKEND_URL`: Your backend API URL
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins: `http://localhost:5180`
6. Copy the Client ID to your `.env` file

## Testing Steps

### 1. Basic Store Creation (Without Google)
1. Navigate to the Stores page
2. Click "Nova Loja" button
3. Fill out the 4-step form:
   - **Step 1**: Basic store information (name, email, phone)
   - **Step 2**: Address details
   - **Step 3**: Admin information
   - **Step 4**: Plan selection and payment method
4. Submit the form
5. Verify the new store appears in the list

### 2. Store Creation with Google Sign-in
1. Navigate to the Stores page
2. Click "Nova Loja" button
3. In Step 3 (Admin), click "Usar Google" button
4. Complete Google authentication
5. Verify admin fields are auto-filled with Google account data
6. Complete Steps 3 and 4
7. Submit the form
8. Verify the new store appears in the list

### 3. Error Handling Testing
Test the following error scenarios:
- Invalid email formats
- Missing required fields
- Google authentication failure
- Backend API errors
- Network connectivity issues

## API Integration

### Endpoints Used
- `POST /api/system/stores` - Create store (regular)
- `POST /api/system/stores/google` - Create store with Google
- `GET /api/system/stores` - List stores
- `GET /api/system/stores/:id` - Get store details

### Request Format
```json
{
  "name": "Store Name",
  "slug": "store-slug",
  "email": "store@example.com",
  "phone": "(11) 1234-5678",
  "address": "Store Address",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "country": "Brasil",
  "admin": {
    "name": "Admin Name",
    "email": "admin@example.com",
    "phone": "(11) 9876-5432"
  },
  "plan": "basic",
  "paymentMethod": "monthly",
  "autoRenew": true,
  "googleSignIn": false,
  "googleAccount": null
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": "store-id",
    "name": "Store Name",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Common Issues

1. **Google Sign-in Button Not Appearing**
   - Check browser console for errors
   - Verify Google Client ID is correct
   - Ensure Google script loaded successfully

2. **Backend API Errors**
   - Check backend server is running
   - Verify API endpoints are correct
   - Check authentication tokens

3. **Form Validation Errors**
   - Ensure all required fields are filled
   - Check email format validation
   - Verify phone number format

4. **Modal Not Closing**
   - Check for JavaScript errors
   - Verify onClose callback is working
   - Check for unhandled promise rejections

### Debug Mode
Enable debug mode by adding to browser console:
```javascript
localStorage.setItem('debug', 'true')
```

This will enable detailed logging for:
- Google Sign-in flow
- API requests and responses
- Form validation
- Error handling

## Security Considerations

1. **Google OAuth**
   - Never expose Google Client Secret
   - Use HTTPS in production
   - Validate Google tokens on backend

2. **Data Validation**
   - All inputs are validated client-side
   - Backend should re-validate all data
   - Sanitize user inputs

3. **Authentication**
   - Use secure token storage
   - Implement token refresh
   - Handle session expiration

## Performance Optimization

1. **Lazy Loading**
   - Google Sign-in script loads only when modal opens
   - Modal components use React.lazy

2. **Caching**
   - Store data in localStorage when appropriate
   - Implement request caching for repeated API calls

3. **Debouncing**
   - Search inputs are debounced
   - Form validation is debounced

## Next Steps

After successful testing:
1. Deploy to staging environment
2. Test with real Google OAuth credentials
3. Test with production backend API
4. Monitor error rates and performance
5. Collect user feedback
6. Plan rollout to production