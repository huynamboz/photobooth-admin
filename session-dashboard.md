# Admin Dashboard Requirements

## Overview
Tài liệu chi tiết để AI khác code trang admin cho hệ thống Photobooth. Bao gồm UI/UX requirements, API integration, và technical specifications.

## Technology Stack Recommendations
- **Frontend Framework**: React.js với TypeScript
- **State Management**: Redux Toolkit hoặc Zustand
- **UI Library**: Material-UI (MUI) hoặc Ant Design
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Charts**: Chart.js hoặc Recharts
- **Date/Time**: date-fns hoặc dayjs

## Page Structure

### 1. Dashboard Overview
**Route:** `/admin/dashboard`

**Purpose:** Tổng quan hệ thống và thống kê real-time

**Components:**
- **System Status Cards** (4 cards):
  - Total Photobooths
  - Available Photobooths
  - Active Sessions
  - Total Photos Today

- **Real-time Charts**:
  - Sessions per hour (line chart)
  - Photobooth utilization (bar chart)
  - Photo processing status (pie chart)

- **Recent Activity Feed**:
  - Latest sessions created/completed
  - Photobooth status changes
  - System alerts

**API Calls:**
```typescript
// Get system statistics
GET /api/v1/admin/photobooth/stats

// Get recent sessions (last 10)
GET /api/v1/admin/photobooth/sessions?limit=10&page=1

// Get system status
GET /api/v1/photobooth/status
```

### 2. Photobooth Management
**Route:** `/admin/photobooths`

**Purpose:** Quản lý các máy chụp hình

**Components:**
- **Photobooth List Table**:
  - Columns: Name, Location, Status, Current Session, Last Activity, Actions
  - Pagination
  - Search/Filter
  - Sort by status, name, last activity

- **Photobooth Actions**:
  - Create new photobooth
  - Edit photobooth details
  - Change status (Available/Busy/Maintenance/Offline)
  - Delete photobooth
  - View session history

- **Status Indicators**:
  - Color-coded status badges
  - Real-time status updates
  - Current session info

**API Calls:**
```typescript
// Get all photobooths with pagination
GET /api/v1/admin/photobooth/photobooths?page=1&limit=10&search=query

// Create photobooth
POST /api/v1/admin/photobooth/photobooths

// Update photobooth
PUT /api/v1/admin/photobooth/photobooths/{id}

// Update status
PUT /api/v1/admin/photobooth/photobooths/{id}/status

// Delete photobooth
DELETE /api/v1/admin/photobooth/photobooths/{id}
```

### 3. Session Management
**Route:** `/admin/sessions`

**Purpose:** Quản lý các phiên chụp hình

**Components:**
- **Session List Table**:
  - Columns: ID, User, Photobooth, Status, Photos Count, Started At, Completed At, Actions
  - Pagination
  - Filter by status, photobooth, date range
  - Search in notes

- **Session Details Modal**:
  - Session information
  - Photo gallery
  - Timeline of events
  - Actions (Cancel, Complete, Update notes)

- **Session Actions**:
  - View session details
  - Cancel session
  - Update session notes
  - Delete session
  - View photos

**API Calls:**
```typescript
// Get all sessions with pagination
GET /api/v1/admin/photobooth/sessions?page=1&limit=10&search=query

// Get session details
GET /api/v1/photobooth/sessions/{id}

// Update session
PUT /api/v1/admin/photobooth/sessions/{id}

// Cancel session
PUT /api/v1/photobooth/sessions/{id}/cancel

// Delete session
DELETE /api/v1/admin/photobooth/sessions/{id}
```

### 4. Photo Management
**Route:** `/admin/photos`

**Purpose:** Quản lý tất cả ảnh trong hệ thống

**Components:**
- **Photo Grid/List**:
  - Thumbnail view với metadata
  - Filter by session, processing status, date
  - Search in captions
  - Bulk actions

- **Photo Details Modal**:
  - Full-size image
  - Metadata (session, order, processing status)
  - Edit caption
  - Mark as processed
  - Delete photo

- **Bulk Operations**:
  - Select multiple photos
  - Bulk mark as processed
  - Bulk delete
  - Export selected photos

**API Calls:**
```typescript
// Get all photos with pagination
GET /api/v1/admin/photobooth/photos?page=1&limit=20&search=query

// Get photo details
GET /api/v1/photobooth/photos/{id}

// Update photo
PUT /api/v1/admin/photobooth/photos/{id}

// Delete photo
DELETE /api/v1/admin/photobooth/photos/{id}
```

### 5. System Settings
**Route:** `/admin/settings`

**Purpose:** Cấu hình hệ thống

**Components:**
- **General Settings**:
  - Default max photos per session
  - Session timeout duration
  - Photo processing settings
  - System maintenance mode

- **Photobooth Settings**:
  - Default photobooth status
  - Maintenance schedules
  - Location management

- **User Management**:
  - Admin user list
  - Role assignments
  - Access permissions

## UI/UX Requirements

### Design System
- **Color Scheme**:
  - Primary: #1976d2 (Blue)
  - Success: #2e7d32 (Green)
  - Warning: #f57c00 (Orange)
  - Error: #d32f2f (Red)
  - Info: #0288d1 (Light Blue)

- **Status Colors**:
  - Available: #4caf50 (Green)
  - Busy: #ff9800 (Orange)
  - Maintenance: #9c27b0 (Purple)
  - Offline: #f44336 (Red)

### Layout Structure
```
┌─────────────────────────────────────────┐
│ Header (Logo, User Menu, Notifications) │
├─────────────────────────────────────────┤
│ Sidebar Navigation                      │
├─────────────────────────────────────────┤
│ Main Content Area                       │
│ ┌─────────────────────────────────────┐ │
│ │ Page Header (Title, Breadcrumbs)    │ │
│ ├─────────────────────────────────────┤ │
│ │ Page Content                        │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Responsive Design
- **Desktop**: Full sidebar, multi-column layouts
- **Tablet**: Collapsible sidebar, adjusted grid
- **Mobile**: Bottom navigation, single column

### Accessibility
- **WCAG 2.1 AA Compliance**
- **Keyboard Navigation**
- **Screen Reader Support**
- **High Contrast Mode**
- **Focus Indicators**

## Data Models (TypeScript)

### Photobooth Interface
```typescript
interface Photobooth {
  id: string;
  name: string;
  description?: string;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  location?: string;
  isActive: boolean;
  currentSessionId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Session Interface
```typescript
interface Session {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  userId?: string;
  user?: User;
  photoboothId: string;
  photobooth: Photobooth;
  photos: Photo[];
  photoCount: number;
  maxPhotos: number;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Photo Interface
```typescript
interface Photo {
  id: string;
  sessionId: string;
  session: Session;
  imageUrl: string;
  publicId?: string;
  thumbnailUrl?: string;
  order: number;
  caption?: string;
  isProcessed: boolean;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### System Stats Interface
```typescript
interface SystemStats {
  photobooths: {
    total: number;
    available: number;
    busy: number;
    maintenance: number;
    offline: number;
  };
  sessions: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
  photos: {
    total: number;
    processed: number;
    unprocessed: number;
    bySession: Record<string, number>;
  };
}
```

## API Integration

### HTTP Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Functions
```typescript
// api/photobooth.ts
export const photoboothApi = {
  // Get all photobooths
  getPhotobooths: (params: PaginationParams) =>
    apiClient.get('/admin/photobooth/photobooths', { params }),

  // Create photobooth
  createPhotobooth: (data: CreatePhotoboothDto) =>
    apiClient.post('/admin/photobooth/photobooths', data),

  // Update photobooth
  updatePhotobooth: (id: string, data: UpdatePhotoboothDto) =>
    apiClient.put(`/admin/photobooth/photobooths/${id}`, data),

  // Update status
  updateStatus: (id: string, status: PhotoboothStatus) =>
    apiClient.put(`/admin/photobooth/photobooths/${id}/status`, { status }),

  // Delete photobooth
  deletePhotobooth: (id: string) =>
    apiClient.delete(`/admin/photobooth/photobooths/${id}`),
};

// api/session.ts
export const sessionApi = {
  // Get all sessions
  getSessions: (params: PaginationParams) =>
    apiClient.get('/admin/photobooth/sessions', { params }),

  // Get session details
  getSession: (id: string) =>
    apiClient.get(`/photobooth/sessions/${id}`),

  // Update session
  updateSession: (id: string, data: UpdateSessionDto) =>
    apiClient.put(`/admin/photobooth/sessions/${id}`, data),

  // Cancel session
  cancelSession: (id: string) =>
    apiClient.put(`/photobooth/sessions/${id}/cancel`),

  // Delete session
  deleteSession: (id: string) =>
    apiClient.delete(`/admin/photobooth/sessions/${id}`),
};

// api/photo.ts
export const photoApi = {
  // Get all photos
  getPhotos: (params: PaginationParams) =>
    apiClient.get('/admin/photobooth/photos', { params }),

  // Get photo details
  getPhoto: (id: string) =>
    apiClient.get(`/photobooth/photos/${id}`),

  // Update photo
  updatePhoto: (id: string, data: UpdatePhotoDto) =>
    apiClient.put(`/admin/photobooth/photos/${id}`, data),

  // Delete photo
  deletePhoto: (id: string) =>
    apiClient.delete(`/admin/photobooth/photos/${id}`),
};

// api/stats.ts
export const statsApi = {
  // Get system stats
  getSystemStats: () =>
    apiClient.get('/admin/photobooth/stats'),

  // Get system status
  getSystemStatus: () =>
    apiClient.get('/photobooth/status'),

  // Cleanup expired sessions
  cleanupExpiredSessions: () =>
    apiClient.post('/admin/photobooth/cleanup/expired-sessions'),
};
```

## State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  photobooth: PhotoboothState;
  session: SessionState;
  photo: PhotoState;
  stats: StatsState;
  ui: UIState;
}

interface PhotoboothState {
  photobooths: Photobooth[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: PhotoboothFilters;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: SessionFilters;
}

interface StatsState {
  systemStats: SystemStats | null;
  realtimeStats: RealtimeStats | null;
  loading: boolean;
  error: string | null;
}
```

### Redux Slices
```typescript
// photoboothSlice.ts
export const photoboothSlice = createSlice({
  name: 'photobooth',
  initialState,
  reducers: {
    setPhotobooths: (state, action) => {
      state.photobooths = action.payload.data;
      state.pagination = action.payload.meta;
    },
    addPhotobooth: (state, action) => {
      state.photobooths.unshift(action.payload);
    },
    updatePhotobooth: (state, action) => {
      const index = state.photobooths.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.photobooths[index] = action.payload;
      }
    },
    removePhotobooth: (state, action) => {
      state.photobooths = state.photobooths.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});
```

## Real-time Updates

### WebSocket Integration
```typescript
// websocket.ts
import io from 'socket.io-client';

class WebSocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000');
  }

  // Listen for photobooth status changes
  onPhotoboothStatusChange(callback: (data: PhotoboothStatusUpdate) => void) {
    this.socket.on('photobooth:status:changed', callback);
  }

  // Listen for session updates
  onSessionUpdate(callback: (data: SessionUpdate) => void) {
    this.socket.on('session:updated', callback);
  }

  // Listen for system stats updates
  onStatsUpdate(callback: (data: SystemStats) => void) {
    this.socket.on('stats:updated', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
```

## Component Examples

### Photobooth List Component
```typescript
// components/PhotoboothList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Settings } from '@mui/icons-material';

const PhotoboothList: React.FC = () => {
  const dispatch = useDispatch();
  const { photobooths, loading, pagination } = useSelector((state: RootState) => state.photobooth);

  useEffect(() => {
    dispatch(fetchPhotobooths({ page: 1, limit: 10 }));
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { field: 'currentSessionId', headerName: 'Current Session', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton onClick={() => handleSettings(params.row.id)}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={photobooths}
      columns={columns}
      loading={loading}
      pagination
      pageSize={pagination.limit}
      rowCount={pagination.total}
      onPageChange={(page) => dispatch(fetchPhotobooths({ page: page + 1, limit: 10 }))}
    />
  );
};
```

### System Stats Dashboard
```typescript
// components/StatsDashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StatsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { systemStats, loading } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchSystemStats());
    // Set up real-time updates
    const interval = setInterval(() => {
      dispatch(fetchSystemStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Photobooths</Typography>
            <Typography variant="h4">{systemStats?.photobooths.total || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Available</Typography>
            <Typography variant="h4" color="success.main">
              {systemStats?.photobooths.available || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Sessions</Typography>
            <Typography variant="h4" color="warning.main">
              {systemStats?.sessions.active || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Photos</Typography>
            <Typography variant="h4" color="info.main">
              {systemStats?.photos.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Photobooth Status</Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={[
                  { name: 'Available', value: systemStats?.photobooths.available || 0 },
                  { name: 'Busy', value: systemStats?.photobooths.busy || 0 },
                  { name: 'Maintenance', value: systemStats?.photobooths.maintenance || 0 },
                  { name: 'Offline', value: systemStats?.photobooths.offline || 0 },
                ]}
                cx={200}
                cy={150}
                outerRadius={80}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
```

## Testing Requirements

### Unit Tests
- Component rendering
- API service functions
- Redux actions và reducers
- Utility functions

### Integration Tests
- API integration
- User workflows
- Error handling
- Real-time updates

### E2E Tests
- Complete user journeys
- Admin workflows
- Cross-browser compatibility
- Mobile responsiveness

## Deployment Considerations

### Environment Variables
```bash
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_WS_URL=http://localhost:3000
REACT_APP_ENV=development
```

### Build Configuration
- **Production Build**: Optimized bundle size
- **Code Splitting**: Lazy loading cho routes
- **Asset Optimization**: Image compression, minification
- **PWA Support**: Service worker, offline capability

### Security
- **HTTPS**: Secure API communication
- **Token Management**: Secure storage và refresh
- **Input Validation**: Client-side validation
- **XSS Protection**: Sanitize user inputs

## Performance Optimization

### Code Splitting
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Photobooths = lazy(() => import('./pages/Photobooths'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Photos = lazy(() => import('./pages/Photos'));
```

### Caching Strategy
- **API Response Caching**: Cache static data
- **Image Caching**: Optimize photo loading
- **Local Storage**: Cache user preferences
- **Service Worker**: Offline functionality

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Load components on demand
- **Asset Optimization**: Compress images và fonts
- **CDN Integration**: Serve static assets from CDN

## Monitoring và Analytics

### Error Tracking
- **Sentry**: Error monitoring
- **Console Logging**: Development debugging
- **User Feedback**: Error reporting system

### Performance Monitoring
- **Web Vitals**: Core web vitals tracking
- **API Performance**: Response time monitoring
- **User Analytics**: Usage patterns

### Business Metrics
- **Session Analytics**: Session completion rates
- **Photobooth Utilization**: Usage statistics
- **User Engagement**: Admin activity tracking

## Conclusion

Tài liệu này cung cấp đầy đủ thông tin để AI khác có thể code trang admin cho hệ thống Photobooth. Bao gồm:

1. **API Documentation**: Chi tiết về tất cả endpoints
2. **UI/UX Requirements**: Design system và layout
3. **Technical Specifications**: Code examples và patterns
4. **Integration Guidelines**: API integration và state management
5. **Testing Requirements**: Unit, integration, và E2E tests
6. **Deployment Considerations**: Production deployment

AI có thể sử dụng tài liệu này để tạo ra một admin dashboard hoàn chỉnh, responsive, và production-ready.
