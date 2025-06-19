First, manufacturer signs up (existing endpoint):

```
POST /v1/manufacturer/signup
{
  "email": "factory@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

Then onboard with company details:

```
POST /v1/manufacturer/onboard
Authorization: Bearer <token>
{
  "companyName": "Acme Manufacturing Co.",
  "factoryDetails": "State-of-the-art facility in Mumbai with 50,000 sq ft...",
  "keywords": ["textiles", "garments", "export"],
  "certificates": [
    "https://s3-bucket.com/certificates/iso9001.pdf",
    "https://s3-bucket.com/certificates/export-license.pdf"
  ],
  "gallery": [
    "https://s3-bucket.com/gallery/facility1.jpg",
    "https://s3-bucket.com/gallery/machinery1.jpg"
  ],
  "introVideo": "https://s3-bucket.com/videos/company-intro.mp4"
}
```

Add legal documents:

```
POST /v1/manufacturer/legal-documents
Authorization: Bearer <token>
{
  "title": "Export License",
  "url": "https://s3-bucket.com/legal/export-license-2025.pdf",
  "version": 1
}
```

Update profile later:

```
PUT /v1/manufacturer/profile
Authorization: Bearer <token>
{
  "companyName": "Acme Manufacturing International",
  "keywords": ["textiles", "garments", "export", "international"]
}
```

View full profile:

```
GET /v1/manufacturer/profile
Authorization: Bearer <token>
```
