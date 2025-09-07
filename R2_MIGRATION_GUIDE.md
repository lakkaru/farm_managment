# 🚀 Cloudflare R2 Migration Guide

## Overview
This update migrates image storage from local filesystem to Cloudflare R2, providing:
- ✅ **Cost-effective storage** (much cheaper than AWS S3)
- ✅ **Zero egress fees** (free data transfer)
- ✅ **Global CDN** built-in for fast image loading
- ✅ **Scalable storage** without server disk limitations
- ✅ **S3-compatible API** for easy management

## 🔧 Setup Instructions

### 1. Create Cloudflare R2 Bucket

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **R2 Object Storage** from the sidebar

2. **Create Bucket**
   ```
   Bucket Name: farm-management-images
   Location: Auto (recommended)
   ```

3. **Configure Public Access (Optional)**
   - Go to your bucket → Settings → Public Access
   - Allow public access if you want direct image URLs
   - Or set up a custom domain for better branding

### 2. Create R2 API Token

1. **Generate API Token**
   - Go to **Manage R2 API tokens**
   - Click **Create API token**

2. **Token Permissions**
   ```
   Token name: farm-management-api
   Permissions: Object Read & Write
   Bucket: farm-management-images (or All buckets)
   ```

3. **Save Credentials**
   - Copy the **Access Key ID** and **Secret Access Key**
   - ⚠️ Save these securely - they won't be shown again!

### 3. Configure Environment Variables

Add these to your `backend/.env` file:

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=farm-management-images
R2_ACCOUNT_ID=your_cloudflare_account_id

# Optional: Custom domain (if configured)
# R2_PUBLIC_URL=https://images.yourdomain.com
```

**How to find your Account ID:**
- Go to Cloudflare Dashboard → Right sidebar → Account ID

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

You should see: `✓ Cloudflare R2 storage configured successfully`

## 📁 File Organization

Images are stored in R2 with this structure:
```
farm-management-images/
└── daily-remarks/
    ├── 1693934400000-uuid-v4-abc123.jpg
    ├── 1693934500000-uuid-v4-def456.png
    └── ...
```

## 🔄 Migration Notes

### For New Installations
- Just configure R2 credentials and you're ready!
- All new image uploads will go directly to R2

### For Existing Installations
- **Old images**: Remain on local server and continue to work
- **New images**: Automatically stored in R2
- **Mixed support**: The system handles both local and R2 images seamlessly

### Optional: Migrate Existing Images
If you want to migrate existing local images to R2:

1. **Manual Migration** (recommended for small datasets)
   - Download existing images from server
   - Re-upload them through the application

2. **Batch Migration Script** (for large datasets)
   - We can provide a migration script if needed
   - Contact support for assistance

## 💰 Cost Estimation

**Cloudflare R2 Pricing:**
- Storage: $0.015/GB/month
- Class A operations (PUT, POST): $4.50/million
- Class B operations (GET, HEAD): $0.36/million
- **Zero egress fees** (unlimited free downloads)

**Example for 1000 images:**
- Storage (1000 × 2MB = 2GB): ~$0.03/month
- Upload operations: ~$0.005 one-time
- Download operations: $0 (free!)

**Total: ~$0.035/month for 1000 images!**

## 🚀 Benefits

### Before (Local Storage)
- ❌ Limited by server disk space
- ❌ Slow image loading for remote users
- ❌ Manual backup/restoration needed
- ❌ Server resources used for file serving

### After (Cloudflare R2)
- ✅ Virtually unlimited storage
- ✅ Global CDN for fast worldwide access
- ✅ Automatic redundancy and backups
- ✅ No server resource usage for images
- ✅ Professional cloud infrastructure

## 🔧 Troubleshooting

### Common Issues:

1. **"R2 not configured" warning**
   - Check all R2_* environment variables are set
   - Verify credentials are correct
   - Ensure bucket exists and is accessible

2. **Upload failures**
   - Check API token permissions
   - Verify bucket name is correct
   - Check network connectivity

3. **Images not loading**
   - Verify bucket public access settings
   - Check browser console for CORS errors
   - Ensure R2_PUBLIC_URL is correct (if using custom domain)

### Test Configuration:

```bash
# Check if R2 is properly configured
curl -X POST http://localhost:5000/api/season-plans/test-r2
```

## 📞 Support

For help with R2 setup or migration:
- Create an issue in the repository
- Check the troubleshooting section above
- Review Cloudflare R2 documentation

---

**Ready to enjoy faster, cheaper, and more reliable image storage! 🎉**
