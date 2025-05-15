import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Badge, 
  Breadcrumbs,
  Link as MuiLink,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  MailOutline as MailIcon,
  AccountCircle,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [messagesAnchorEl, setMessagesAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);
  const isMessagesMenuOpen = Boolean(messagesAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMessagesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMessagesAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
    setMessagesAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    handleMenuClose();
    navigate('/');
  };

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(part => part);
    
    // Skip the "admin" part since we're already in the admin panel
    const parts = pathParts.length > 0 && pathParts[0] === 'admin' 
      ? pathParts.slice(1) 
      : pathParts;

    if (parts.length === 0) {
      return [{ name: 'Dashboard', path: '/admin' }];
    }

    const breadcrumbs = [{ name: 'Dashboard', path: '/admin' }];
    let currentPath = '/admin';

    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      const formattedName = part
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name: formattedName,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">New order received</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Product stock running low</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">3 new customer reviews</Typography>
      </MenuItem>
    </Menu>
  );

  const renderMessagesMenu = (
    <Menu
      anchorEl={messagesAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMessagesMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Message from John Doe</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Message from Jane Smith</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'background.paper'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="View frontend site">
              <IconButton 
                color="inherit" 
                component={Link}
                to="/"
                size="large"
                target="_blank"
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Help">
              <IconButton color="inherit" size="large">
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Messages">
              <IconButton
                color="inherit"
                onClick={handleMessagesMenuOpen}
                size="large"
              >
                <Badge badgeContent={2} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsMenuOpen}
                size="large"
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
                size="large"
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    backgroundColor: 'primary.main'
                  }}
                >
                  A
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ mt: 2, mb: 3, px: 1 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography color="text.primary" key={index}>
                {breadcrumb.name}
              </Typography>
            ) : (
              <MuiLink
                underline="hover"
                color="inherit"
                component={Link}
                to={breadcrumb.path}
                key={index}
              >
                {breadcrumb.name}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      </Box>
      
      {renderMenu}
      {renderNotificationsMenu}
      {renderMessagesMenu}
    </Box>
  );
};

export default AdminHeader; 