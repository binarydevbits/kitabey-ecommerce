import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  InputAdornment,
  Menu,
  Alert,
  Snackbar,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  VerifiedUser as VerifiedUserIcon,
  Block as BlockIcon,
  LockOpen as LockOpenIcon,
  Mail as MailIcon
} from '@mui/icons-material';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  orders: number;
  verified: boolean;
}

const roles = ['Admin', 'Customer', 'Seller'];
const statusOptions = ['Active', 'Inactive', 'Banned', 'Pending'];

const UserList: React.FC = () => {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // State for dialogs
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // State for action menu
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Form state for add/edit user
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Customer',
    status: 'Active',
    password: ''
  });

  useEffect(() => {
    // In a real application, fetch data from your API
    // For now, we'll use mock data
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, roleFilter, statusFilter, users]);

  const fetchUsers = () => {
    setLoading(true);
    // Mock data for demonstration
    const mockUsers: User[] = Array.from({ length: 25 }).map((_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 20),
      verified: Math.random() > 0.3
    }));

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setLoading(false);

    // When you have an actual API, use this:
    // axios.get(`${API_URL}/admin/users`)
    //   .then(response => {
    //     setUsers(response.data);
    //     setFilteredUsers(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching users:', error);
    //     setSnackbar({
    //       open: true,
    //       message: 'Failed to load users',
    //       severity: 'error'
    //     });
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const applyFilters = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, userId: number) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleAddUser = () => {
    // Reset form
    setUserForm({
      name: '',
      email: '',
      role: 'Customer',
      status: 'Active',
      password: ''
    });
    setAddUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setEditUserDialogOpen(true);
    handleActionMenuClose();
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmDialogOpen(true);
    handleActionMenuClose();
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      // In a real app, you would call your API here
      // axios.delete(`${API_URL}/admin/users/${selectedUser.id}`)
      
      // For demo, we'll just update the state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setSnackbar({
        open: true,
        message: `User ${selectedUser.name} deleted successfully`,
        severity: 'success'
      });
    }
    setDeleteConfirmDialogOpen(false);
  };

  const handleUserFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserForm({
      ...userForm,
      [name as string]: value
    });
  };

  // Handle Select changes separately
  const handleSelectChange = (event: SelectChangeEvent, fieldName: string) => {
    setUserForm({
      ...userForm,
      [fieldName]: event.target.value
    });
  };

  const handleSaveUser = () => {
    if (addUserDialogOpen) {
      // Add new user logic
      const newUser: User = {
        id: users.length + 1,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: '-',
        orders: 0,
        verified: false
      };
      
      setUsers([...users, newUser]);
      setSnackbar({
        open: true,
        message: `User ${newUser.name} added successfully`,
        severity: 'success'
      });
      setAddUserDialogOpen(false);
    } else if (editUserDialogOpen && selectedUser) {
      // Edit user logic
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id
          ? { 
              ...user, 
              name: userForm.name, 
              email: userForm.email, 
              role: userForm.role,
              status: userForm.status
            }
          : user
      );
      
      setUsers(updatedUsers);
      setSnackbar({
        open: true,
        message: `User ${userForm.name} updated successfully`,
        severity: 'success'
      });
      setEditUserDialogOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredUsers.length - page * rowsPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader title="User Management" />
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
              Users
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 2, width: 250 }}
              />
              
              <FormControl size="small" variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel id="role-filter-label">Role</InputLabel>
                <Select
                  labelId="role-filter-label"
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Tooltip title="Clear Filters">
                <IconButton onClick={clearFilters}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Add User">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </Tooltip>
            </Box>
          </Toolbar>
          
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell align="center">Verified</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell component="th" scope="row">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          size="small"
                          color={
                            user.role === 'Admin' 
                              ? 'primary' 
                              : user.role === 'Seller' 
                                ? 'secondary' 
                                : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          size="small"
                          color={
                            user.status === 'Active' 
                              ? 'success' 
                              : user.status === 'Banned' 
                                ? 'error' 
                                : user.status === 'Pending'
                                  ? 'warning'
                                  : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell align="center">
                        {user.verified ? (
                          <VerifiedUserIcon color="success" />
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="more actions"
                          onClick={(event) => handleActionMenuOpen(event, user.id)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        
        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchorEl}
          open={Boolean(actionMenuAnchorEl)}
          onClose={handleActionMenuClose}
        >
          <MenuItem onClick={() => selectedUserId && handleEditUser(users.find(u => u.id === selectedUserId)!)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => selectedUserId && handleDeleteUser(users.find(u => u.id === selectedUserId)!)}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleActionMenuClose}>
            <MailIcon fontSize="small" sx={{ mr: 1 }} />
            Send Email
          </MenuItem>
          <MenuItem onClick={handleActionMenuClose}>
            {users.find(u => u.id === selectedUserId)?.status === 'Active' ? (
              <>
                <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                Block User
              </>
            ) : (
              <>
                <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
                Activate User
              </>
            )}
          </MenuItem>
        </Menu>
        
        {/* Add User Dialog */}
        <Dialog open={addUserDialogOpen} onClose={() => setAddUserDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Full Name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={userForm.role}
                    onChange={(e) => handleSelectChange(e, "role")}
                    label="Role"
                  >
                    {roles.map(role => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={userForm.status}
                    onChange={(e) => handleSelectChange(e, "status")}
                    label="Status"
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained" color="primary">Add User</Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Full Name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password (leave blank to keep unchanged)"
                  type="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={userForm.role}
                    onChange={(e) => handleSelectChange(e, "role")}
                    label="Role"
                  >
                    {roles.map(role => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={userForm.status}
                    onChange={(e) => handleSelectChange(e, "status")}
                    label="Status"
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmDialogOpen} onClose={() => setDeleteConfirmDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteUser} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default UserList; 