# MongoDB Migration Guide

Your backend has been successfully migrated from JSON file storage to MongoDB!

## What Changed

### Files Created:

- `server/models/User.ts` - User schema with indexes
- `server/models/Session.ts` - Session schema with auto-expiry
- `server/models/Booking.ts` - Booking schema with indexes
- `server/db.ts` - MongoDB connection utility

### Files Modified:

- `server/routes/auth.ts` - Now uses MongoDB for user & session management
- `server/routes/bookings.ts` - Now uses MongoDB for booking operations
- `server/index.ts` - Connects to MongoDB on startup
- `.env` - Added MONGODB_URI configuration

## Setup Instructions

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Start MongoDB** (if not using Docker)

3. **Connection String** is already configured in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/smartstay
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free M0 cluster

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update `.env`:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartstay
   ```
   Replace `username`, `password`, and `cluster` with your values

## Benefits of MongoDB Migration

✅ **Performance:** Indexed queries are much faster than JSON file searches
✅ **Scalability:** Handles thousands of users and bookings efficiently
✅ **Concurrency:** No race conditions from simultaneous writes
✅ **Auto-expiry:** Sessions automatically expire via TTL index
✅ **Data Integrity:** ACID transactions and schema validation
✅ **Production Ready:** Industry-standard database solution

## Database Schema

### Users Collection

- Email (unique, indexed)
- Password (hashed)
- First Name, Last Name, Phone
- Timestamps (auto-managed)

### Sessions Collection

- Token (unique, indexed)
- User ID (reference to User)
- Expires At (TTL index for auto-cleanup)
- Timestamps

### Bookings Collection

- User ID (indexed)
- Hotel details
- Check-in/Check-out dates (indexed)
- Guest information
- Status (confirmed/pending/cancelled)
- Timestamps

## Next Steps

1. Start MongoDB (local or Atlas)
2. Update MONGODB_URI in `.env` if needed
3. Run `npm run dev`
4. Test your application - all existing features will work!

## Migration Notes

- Old JSON data in `data/` folder is not migrated automatically
- If you need to migrate existing data, let me know
- The old files can be safely deleted after verifying the new system works
