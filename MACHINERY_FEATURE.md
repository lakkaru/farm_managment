# Agricultural Machinery Service Feature

## Overview
This feature enables agricultural machinery owners/operators to list their equipment and services, while farmers can search for and request machinery services for their farms.

## User Roles

### Machinery Operator (`machinery_operator`)
- List and manage agricultural machinery
- View and respond to service requests
- Update machinery availability status
- Set pricing and service areas

### Farmer (`farm_owner`)
- Search for machinery by type, location, and price
- Request machinery services for their farms
- View request status and history
- Rate completed services

## Features Implemented

### Backend

#### Models
1. **Machinery Model** (`backend/src/models/Machinery.js`)
   - Machinery details (type, brand, model, specifications)
   - Owner information
   - Service areas (districts, radius)
   - Pricing information
   - Availability status
   - Rating and review system
   - Geospatial indexing for location-based searches

2. **MachineryRequest Model** (`backend/src/models/MachineryRequest.js`)
   - Service request details
   - Status tracking (Pending, Accepted, In Progress, Completed, etc.)
   - Cost estimation
   - Rating and review after completion

3. **User Model Update** (`backend/src/models/User.js`)
   - Added `machinery_operator` role

#### API Endpoints (`backend/src/routes/machineryRoutes.js`)

**Public Routes:**
- `GET /api/machinery` - Search all machinery with filters
- `GET /api/machinery/nearby` - Find nearby machinery (geospatial)
- `GET /api/machinery/:id` - Get machinery details

**Operator Routes:**
- `POST /api/machinery` - Create new machinery listing
- `GET /api/machinery/my/listings` - Get operator's machinery
- `PUT /api/machinery/:id` - Update machinery
- `DELETE /api/machinery/:id` - Delete machinery
- `GET /api/machinery/:id/requests` - View requests for machinery
- `PUT /api/machinery/requests/:id/status` - Update request status

**Farmer Routes:**
- `POST /api/machinery/requests` - Create service request
- `GET /api/machinery/requests/my` - View my requests
- `POST /api/machinery/requests/:id/rate` - Rate completed service
- `GET /api/machinery/search-by-farm/:farmId` - Search by farm location

### Frontend

#### Pages
1. **My Machinery** (`/machinery/my-machinery`)
   - List and manage machinery for operators
   - Add/edit/delete machinery
   - View service requests

2. **Search Machinery** (`/machinery/search`)
   - Search machinery by filters
   - View machinery details
   - Request services
   - Search by farm location

3. **My Requests** (`/machinery/my-requests`)
   - View all service requests
   - Track request status
   - Contact information

## Machinery Types Supported
- Tractor
- Harvester
- Plough
- Rotavator
- Cultivator
- Seeder
- Sprayer
- Thresher
- Rice Transplanter
- Combine Harvester
- Water Pump
- Weeder
- Other

## Availability Status
- **Available** - Ready for booking
- **Busy** - Currently in use
- **Under Maintenance** - Not available

## Pricing Types
- Per Hour
- Per Day
- Per Acre
- Per Service
- Negotiable

## Request Status Flow
1. **Pending** - Request submitted by farmer
2. **Accepted** - Operator accepts the request
3. **In Progress** - Service is being provided
4. **Completed** - Service finished
5. **Cancelled** - Cancelled by farmer
6. **Rejected** - Rejected by operator

## Search Capabilities
- Filter by machinery type
- Filter by district/location
- Filter by price range
- Filter by availability
- Search by text (brand, model, description)
- Geospatial search (nearby machinery)
- Farm-based search (machinery available in farm's district)

## Rating System
- Farmers can rate completed services (1-5 stars)
- Ratings affect machinery visibility in search results
- Track total services completed
- Display average rating

## API Service Methods

```javascript
// Import
import { machineryAPI } from '../services/api';

// Operator methods
await machineryAPI.createMachinery(data);
await machineryAPI.getMyMachinery();
await machineryAPI.updateMachinery(id, data);
await machineryAPI.deleteMachinery(id);
await machineryAPI.getMachineryRequests(machineryId);
await machineryAPI.updateRequestStatus(requestId, data);

// Farmer methods
await machineryAPI.searchMachinery(filters);
await machineryAPI.getMachinery(id);
await machineryAPI.searchByFarm(farmId);
await machineryAPI.createRequest(data);
await machineryAPI.getMyRequests();
await machineryAPI.rateService(requestId, data);

// Location-based
await machineryAPI.getNearbyMachinery({ longitude, latitude, maxDistance });
```

## Usage Examples

### For Machinery Operators

1. **Register as machinery operator** with role `machinery_operator`
2. **Navigate to** `/machinery/my-machinery`
3. **Add machinery** - Fill in details, pricing, service areas
4. **Manage availability** - Update status as needed
5. **View and respond to requests** - Accept/reject farmer requests

### For Farmers

1. **Register or login** as a farmer (`farm_owner`)
2. **Navigate to** `/machinery/search`
3. **Search machinery** - Use filters or search by your farm
4. **View details** - Check specifications, pricing, ratings
5. **Request service** - Select farm, date, and submit request
6. **Track requests** - View status at `/machinery/my-requests`
7. **Rate service** - After completion, rate the service

## Database Indexes
- Geospatial index on `location.coordinates` for proximity searches
- Compound index on `machineryType` and `serviceArea.districts`
- Index on `owner` for fast operator queries
- Index on `farmer` and `status` for request queries

## Future Enhancements
- Image uploads for machinery
- Real-time availability calendar
- Booking system with time slots
- Payment integration
- Chat/messaging between farmer and operator
- GPS tracking during service
- Service history and maintenance logs
- Machinery insurance tracking
- Multi-language support for machinery types

## Testing

### Manual Testing Checklist
- [ ] Create machinery operator account
- [ ] Add machinery with all details
- [ ] Edit machinery information
- [ ] Update availability status
- [ ] Search machinery as farmer
- [ ] Filter by district and type
- [ ] Create service request
- [ ] View requests as operator
- [ ] Update request status
- [ ] Complete service and rate
- [ ] Check rating updates
- [ ] Test geospatial search
- [ ] Test farm-based search

## Security Considerations
- Role-based access control (RBAC)
- Operators can only edit their own machinery
- Farmers can only create requests for their own farms
- Protected routes require authentication
- Request status can only be updated by machinery owner
- Rating can only be done by requester on completed services

## Dependencies
- MongoDB with geospatial support
- Mongoose for data modeling
- Express.js for routing
- React for frontend
- Material-UI for components
- React i18next for translations

## Migration Notes
If deploying to existing system:
1. Update User model to include `machinery_operator` role
2. Create indexes on Machinery model
3. Add machinery routes to server.js
4. Update frontend navigation for new pages
5. Add translations for machinery features
