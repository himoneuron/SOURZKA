# Admin Flow Documentation

## Authentication

### Admin Login

```http
POST /v1/admin/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "jwt-token",
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "SUPERADMIN" | "STAFF"
  }
}
```

## Managing Manufacturers

### List All Manufacturers

```http
GET /v1/admin/manufacturers
Authorization: Bearer <admin-token>

Query Parameters:
- verified: boolean (filter by verification status)
- page: number (pagination)
- limit: number (items per page)
- search: string (search in company name, factory details, keywords)
- isViewedByStaff: boolean (filter by staff review status)
```

### Set Manufacturer Verification Status

```http
PATCH /v1/admin/manufacturers/:manufacturerId/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isVerified": boolean
}

State Matrix:
isVerified | isViewedByStaff | Meaning
-----------|-----------------|------------------
false      | false          | Not reviewed yet
false      | true           | Reviewed and rejected
true       | true           | Reviewed and verified
true       | false          | Not possible*

* System ensures isViewedByStaff is always set to true when staff makes a decision
```

### Get Manufacturer Details

```http
GET /v1/admin/manufacturers/:manufacturerId
Authorization: Bearer <admin-token>
```

### SET Manufacturer Verification

```http
PATCH /v1/admin/manufacturers/:manufacturerId/verify
Authorization: Bearer <admin-token>
```

## Admin Review Process

1. **Initial Review**

   - Admin views unverified manufacturers list
   - Reviews manufacturer profile, documents, and facility details - Toggles verification status if approved

2. **Ongoing Monitoring**
   - Reviews manufacturer products and activities
   - Can filter and search by various criteria
   - Updates verification status as needed

## Access Control

- Only authenticated admins can access the endpoints
- Routes are protected using JWT token validation
- Different admin roles (SUPERADMIN, STAFF) have appropriate access levels
- All actions are audit-logged for accountability

2. **Ongoing Monitoring**

   - Review manufacturer activities
   - Check product listings
   - Monitor order fulfillment
   - Handle verification issues

3. **Actions Available**
   - Verify/Unverify manufacturers
   - Add administrative notes
   - View detailed profiles
   - Track verification history through audit logs

## Example Workflow

1. List unverified manufacturers:

```http
GET /v1/admin/manufacturers?verified=false
```

2. Review specific manufacturer:

```http
GET /v1/admin/manufacturers/123
```

3. Approve manufacturer:

```http
PATCH /v1/admin/manufacturers/123/verify
```

## Response Formats

### Manufacturer List Response

```json
{
  "manufacturers": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Manufacturer Detail Response

```json
{
  "id": "123",
  "companyName": "Acme Manufacturing",
  "isVerified": true,
  "factoryDetails": "...",
  "user": {
    "email": "contact@acme.com",
    "name": "John Doe"
  },
  "products": [...],
  "legalDocuments": [...],
  "recentOrders": [...]
}
```
