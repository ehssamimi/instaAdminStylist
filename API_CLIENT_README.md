# API Client with Automatic Authorization

This project now includes an axios-based API client that automatically adds authorization headers from `localStorage.token` to all API requests.

## Files Created

### 1. `src/lib/api-client.ts`
- Main axios instance with request/response interceptors
- Automatically adds `Authorization: Bearer {token}` header to all requests
- Handles common HTTP errors (401, 403, 500+)
- Logs API requests and responses for debugging

### 2. `src/lib/api.ts`
- Wrapper functions for common HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Pre-built API functions for authentication and dashboard operations
- Type-safe interfaces

## How It Works

### Automatic Authorization
```typescript
// The token from localStorage is automatically added to every request
const data = await api.get('/dashboard')
// Request will include: Authorization: Bearer {token}
```

### Login Flow
```typescript
import { authApi } from '@/lib/api'

// Login and store token
const response = await authApi.login({ email, password })
if (response?.token) {
  localStorage.setItem('token', response.token)
  // All subsequent API calls will now include this token
}
```

### Making API Calls
```typescript
import { api, dashboardApi } from '@/lib/api'

// Using pre-built functions
const dashboardData = await dashboardApi.getDashboardData()
const categories = await dashboardApi.getCategories()

// Using generic API methods
const userProfile = await api.get('/users/123')
const updatedUser = await api.put('/users/123', { name: 'New Name' })
```

### Error Handling
The interceptor automatically handles:
- **401 Unauthorized**: Clears token and redirects to `/login`
- **403 Forbidden**: Logs permission warning
- **500+ Server Errors**: Logs server error details

## Usage in Components

### Login Form (Updated)
The login form (`src/components/login-form.tsx`) has been updated to use the new API client:

```typescript
const response = await authApi.login({ email, password })
if (response?.token) {
  localStorage.setItem('token', response.token)
  router.push('/dashboard')
}
```

### Dashboard Components
```typescript
// Example usage in a dashboard component
import { dashboardApi } from '@/lib/api'

const DashboardPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token is automatically included
        const data = await dashboardApi.getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }
    fetchData()
  }, [])

  // ... rest of component
}
```

## Environment Variables

Add your API base URL to `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

If not provided, it defaults to `/api` for relative URLs.

## Features

✅ **Automatic Authorization**: Token automatically added to all requests  
✅ **Error Handling**: Common HTTP errors handled globally  
✅ **TypeScript Support**: Fully typed API functions  
✅ **Request/Response Logging**: Debug information in console  
✅ **SSR Safe**: Checks for `window` object before accessing localStorage  
✅ **Modular**: Separate files for different API domains (auth, dashboard, etc.)

## Next Steps

1. Replace the mock API endpoints in `src/lib/api.ts` with your actual API endpoints
2. Add your API base URL to environment variables
3. Customize error handling in the interceptors as needed
4. Add more API functions for your specific use cases
5. Consider adding refresh token logic if your API supports it
