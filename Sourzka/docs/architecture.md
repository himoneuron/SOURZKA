# Server Architecture Documentation

## Overview

The server follows a layered architecture pattern with clear separation of concerns:

```
Request Flow: v1 API → Routes → Controllers → Services → Database
```

## Core Architecture Components

### 1. API Versioning

- Located in `src/versions/v1Api.ts`
- All routes are versioned (e.g., `/api/v1/...`)
- Allows multiple API versions to coexist

### 2. Routes

- Location: `src/routes/`
- Handle request routing and basic middleware attachment
- Each domain has its own route file (e.g., `manufacturer.routes.ts`, `buyer.routes.ts`)
- Input validation using Zod schemas handled by a middleware

### 3. Controllers

- Location: `src/controllers/`
- Handle HTTP request/response
- Delegate business logic to services

### 4. Services

- Location: `src/services/`
- Implement business logic
- Follow OOP principles with inheritance
- Base `UserService` with specialized services inheriting from it:
  - `ManufacturerService`
  - `BuyerService`

### 5. Database Layer

- Uses Prisma ORM
- Schema defined in `prisma/schema.prisma`
- Generated client in `generated/prisma/`

## Error Handling

### Custom Error Classes

Location: `src/lib/errors.ts`

```typescript
- BaseError          - Base class for all custom errors
- NotFoundError      - Resource not found (404)
- UnauthorizedError  - Authentication failed (401)
- ForbiddenError    - Authorization failed (403)
- ValidationError   - Input validation failed (400)
- EntityConflict    - Resource already exists (409)
```

### Error Middleware

Location: `src/middlewares/error.middleware.ts`

- Centralizes error handling
- Transforms errors into consistent API responses
- Handles both custom and system errors

## Authentication & Authorization

### Auth Middleware

Location: `src/middlewares/auth.middleware.ts`

- JWT-based authentication
- Token validation and verification
- Role-based access control

### User Roles

- BUYER
- MANUFACTURER
- Defined in Prisma schema
- Role-specific business logic in respective services

## Rate Limiting

Location: `src/lib/limiter.ts`

- Uses Express Rate Limit
- Configurable limits per route
- Prevents abuse and DOS attacks

## Security Features

1. CORS configuration
2. Helmet middleware for security headers
3. Input validation using Zod
4. Password hashing using bcrypt
5. JWT for stateless authentication

## Logging & Monitoring

Location: Various files

- Request logging
- Error logging
- Audit logging for important operations
- Stored in database via `AuditLog` model

## Data Models

Key models in Prisma schema:

```prisma
- User           - Base user information
- Buyer          - Buyer-specific data
- Manufacturer   - Manufacturer-specific data
- Product        - Product listings
- Order          - Purchase orders
- Invoice        - Payment records
- Message        - Communication
- AuditLog       - System audit trail
```

## Environment Configuration

- Configuration management in `src/config.ts`
- Environment variables loaded from `.env`
- Different configs for development/production

## API Response Format

Standard response format:

```typescript
{
  success: boolean,
  data?: any,
  error?: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Testing Strategy (not yet implemented)

- Unit tests for services
- Integration tests for API endpoints
- Separate test database
- Jest as testing framework

## Future Improvements

1. Implement caching layer
2. Add request validation middleware
3. Enhance logging with correlation IDs
4. Add API documentation using Swagger
5. Implement refresh tokens

## The Architecture of the Server

v1 => route => controller => service

following OOP design pattern

### Authentication Flow

1. User registration:

   - Validate input with Zod
   - Hash password with bcrypt
   - Create user record
   - Generate JWT token

2. User login:

   - Validate credentials
   - Check user role
   - Generate fresh JWT token

3. Request authentication:
   - Validate JWT token
   - Check user permissions
   - Attach user to request

### Role-Based Access Control

We implement RBAC through middleware:

```typescript
const checkRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }
    next();
  };
};
```

### Environment Variables

Required environment variables:

```bash
DATABASE_URL=            # Prisma database connection
JWT_SECRET=             # JWT signing secret
SALT_ROUNDS=            # Password hashing rounds
NODE_ENV=               # development/production
```

### API Endpoints Structure

We follow RESTful conventions:

```
POST   /api/v1/auth/register    # User registration
POST   /api/v1/auth/login       # User login
GET    /api/v1/profile          # Get user profile
PUT    /api/v1/profile          # Update profile
DELETE /api/v1/profile          # Delete account
```

### Database Transactions

We use Prisma transactions for operations that require multiple updates:

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Multiple database operations
  // Automatically rolled back if any operation fails
});
```
