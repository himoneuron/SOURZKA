## SUPERADMIN (Highest Privileges)

```
This role has full system control, typically only a few trusted users.
Manage all admin accounts (create, delete, update roles)
```

- Full access to user data (view, edit, delete)
- Full access to manufacturer & product data
- Can delete any record (orders, messages, invoices, etc.)
- Manage CMS content and settings
- View and manage audit logs
- Override system restrictions (e.g., approve unverified manufacturers manually)
- Manage legal documents, financial records
- Impersonate other users for debugging

## STAFF (Mid-Level Operational Admin)

```
This is your core operations/admin team — e.g., trust & safety, support.
```

- View user, buyer, and manufacturer profiles
- Approve/verify manufacturers
- Moderate product listings
- Handle user inquiries/issues
- Manage CMS content
- View audit logs

- Cannot delete other admins
- Cannot change roles of admins
- Cannot override SUPERADMIN permissions

## MODERATOR (Lightweight/Community Role)

```
This role is for content moderators, support, or limited access helpers.
```

- View users and products
- Moderate messages and content (e.g., flag inappropriate content)
- View inquiries and reports

- Cannot create/update/delete users, admins, or products
- No financial/invoice access
- Cannot view sensitive data (e.g., docs, payments)
- No access to audit logs
