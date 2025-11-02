import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  School as ExpertIcon,
  Business as ManagerIcon,
  // ArrowBack handled by centralized BackButton
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import Layout from '../../../components/Layout/Layout';
import BackButton from '../../../components/BackButton/BackButton';
import AppProviders from '../../../providers/AppProviders';
import { adminAPI } from '../../../services/api';

const AdminUsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [createDialog, setCreateDialog] = useState({ open: false });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'farm_owner'
  });
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null, deleting: false });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Fetch farmer users from admin API
  const response = await adminAPI.getFarmers({ page: 1, limit: 100, all: true });
      // backend responds with { success, count, total, page, data }
      let fetched = response?.data?.data || [];

      // Sort users so admins, experts and managers appear at the top.
      const rolePriority = {
        admin: 0,
        expert: 1,
        farm_manager: 2,
        farm_owner: 3,
        worker: 4,
        viewer: 5,
      };

      fetched.sort((a, b) => {
        const pa = rolePriority[a.role] ?? 99;
        const pb = rolePriority[b.role] ?? 99;
        if (pa !== pb) return pa - pb;
        // If same priority, show newest users first
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      setUsers(fetched);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminIcon sx={{ fontSize: 18 }} />;
      case 'expert': return <ExpertIcon sx={{ fontSize: 18 }} />;
      case 'farm_manager': return <ManagerIcon sx={{ fontSize: 18 }} />;
      default: return <PersonIcon sx={{ fontSize: 18 }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'expert': return 'info';
      case 'farm_manager': return 'warning';
      case 'farm_owner': return 'success';
      default: return 'default';
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      password: '',
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phone: user.contact?.phone || '',
      role: user.role
    });
    setEditDialog({ open: true, user });
  };

  const handleCreate = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'farm_owner'
    });
    setCreateDialog({ open: true });
  };

  const handleSave = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (createDialog.open && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    setSaving(true);
    try {
      if (editDialog.open) {
        // Update user via admin API
        const payload = {
          email: formData.email,
          role: formData.role,
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          contact: {
            phone: formData.phone,
          }
        };

        await adminAPI.updateFarmer(editDialog.user._id, payload);
        toast.success('User updated successfully');
      } else {
        // Create user (not implemented yet)
        console.log('Creating user:', formData);
        toast.success('User created successfully');
      }

      // Close dialogs and reload
      setEditDialog({ open: false, user: null });
      setCreateDialog({ open: false });
      loadUsers();

    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user) => {
    // Prevent deleting admin users
    if (user.role === 'admin') {
      toast.error('Cannot delete admin users');
      return;
    }

    setDeleteDialog({ open: true, user, deleting: false });
  };

  const confirmDelete = async () => {
    const user = deleteDialog.user;
    if (!user) return;

    setDeleteDialog(prev => ({ ...prev, deleting: true }));
    try {
      await adminAPI.deleteFarmer(user._id);
      toast.success('User deleted successfully');
      setDeleteDialog({ open: false, user: null, deleting: false });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      setDeleteDialog({ open: false, user: null, deleting: false });
    }
  };

  const closeDialogs = () => {
    setEditDialog({ open: false, user: null });
    setCreateDialog({ open: false });
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'farm_owner'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BackButton to="/dashboard" sx={{ mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            User Management
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create User
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Manage system users, their roles, and permissions. Admin users have full system access, 
          while experts can manage disease references and analysis results.
        </Typography>
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRoleIcon(user.role)}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                      {user.profile.firstName} {user.profile.lastName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={formatRole(user.role)}
                    size="small"
                    color={getRoleColor(user.role)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{user.contact?.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={user.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit User">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(user)}
                      disabled={user.role === 'admin'}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user)}
                      disabled={user.role === 'admin'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
              helperText="Leave empty to keep current password"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                fullWidth
                required
              />
            </Box>
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
                <MenuItem value="farm_owner">Farm Owner</MenuItem>
                <MenuItem value="farm_manager">Farm Manager</MenuItem>
                <MenuItem value="worker">Worker</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialog.open} onClose={closeDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                fullWidth
                required
              />
            </Box>
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                label="Role"
              >
                <MenuItem value="expert">Expert</MenuItem>
                <MenuItem value="farm_owner">Farm Owner</MenuItem>
                <MenuItem value="farm_manager">Farm Manager</MenuItem>
                <MenuItem value="worker">Worker</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null, deleting: false })} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.user ? `Are you sure you want to delete ${deleteDialog.user.profile.firstName} ${deleteDialog.user.profile.lastName}? This action cannot be undone.` : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null, deleting: false })}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleteDialog.deleting}
            startIcon={deleteDialog.deleting ? <CircularProgress size={18} /> : null}
          >
            {deleteDialog.deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const AdminUsersPage = () => {
  return (
    <AppProviders>
      <Layout>
        <AdminUsersContent />
      </Layout>
    </AppProviders>
  );
};

export default AdminUsersPage;

export const Head = () => (
  <>
    <title>User Management - Admin | Farm Management System</title>
    <meta name="description" content="Manage system users and their roles" />
  </>
);
