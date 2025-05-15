import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Divider, 
  Typography, 
  Collapse,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  LocalShipping as LocalShippingIcon,
  Discount as DiscountIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Support as SupportIcon,
  Article as ArticleIcon,
  Security as SecurityIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 250;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleExpand = (text: string) => {
    setExpandedItems({
      ...expandedItems,
      [text]: !expandedItems[text]
    });
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { 
      text: 'User Management', 
      icon: <PeopleIcon />, 
      children: [
        { text: 'All Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Roles & Permissions', icon: <AdminPanelSettingsIcon />, path: '/admin/users/roles' },
        { text: 'Verification Requests', icon: <PeopleIcon />, path: '/admin/users/verification' }
      ]
    },
    { 
      text: 'Product Management', 
      icon: <InventoryIcon />, 
      children: [
        { text: 'All Products', icon: <InventoryIcon />, path: '/admin/products' },
        { text: 'Categories', icon: <InventoryIcon />, path: '/admin/products/categories' },
        { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/products/inventory' }
      ]
    },
    { 
      text: 'Order Management', 
      icon: <ShoppingCartIcon />, 
      children: [
        { text: 'All Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
        { text: 'Pending Orders', icon: <ShoppingCartIcon />, path: '/admin/orders/pending' },
        { text: 'Completed Orders', icon: <ShoppingCartIcon />, path: '/admin/orders/completed' },
        { text: 'Cancelled Orders', icon: <ShoppingCartIcon />, path: '/admin/orders/cancelled' }
      ]
    },
    { 
      text: 'Payment Management', 
      icon: <AttachMoneyIcon />, 
      children: [
        { text: 'All Transactions', icon: <AttachMoneyIcon />, path: '/admin/payments' },
        { text: 'Refunds', icon: <AttachMoneyIcon />, path: '/admin/payments/refunds' },
        { text: 'Payment Settings', icon: <AttachMoneyIcon />, path: '/admin/payments/settings' }
      ]
    },
    { 
      text: 'Shipping Management', 
      icon: <LocalShippingIcon />, 
      children: [
        { text: 'Delivery Zones', icon: <LocalShippingIcon />, path: '/admin/shipping/zones' },
        { text: 'Shipping Methods', icon: <LocalShippingIcon />, path: '/admin/shipping/methods' },
        { text: 'Tracking', icon: <LocalShippingIcon />, path: '/admin/shipping/tracking' }
      ]
    },
    { 
      text: 'Discounts & Offers', 
      icon: <DiscountIcon />, 
      children: [
        { text: 'Coupons', icon: <DiscountIcon />, path: '/admin/discounts/coupons' },
        { text: 'Special Offers', icon: <DiscountIcon />, path: '/admin/discounts/offers' },
        { text: 'Bulk Discounts', icon: <DiscountIcon />, path: '/admin/discounts/bulk' }
      ]
    },
    { text: 'Reviews & Ratings', icon: <StarIcon />, path: '/admin/reviews' },
    { 
      text: 'Reports & Analytics', 
      icon: <AssessmentIcon />, 
      children: [
        { text: 'Sales Reports', icon: <AssessmentIcon />, path: '/admin/reports/sales' },
        { text: 'Customer Analytics', icon: <AssessmentIcon />, path: '/admin/reports/customers' },
        { text: 'Inventory Reports', icon: <AssessmentIcon />, path: '/admin/reports/inventory' },
        { text: 'Tax Reports', icon: <AssessmentIcon />, path: '/admin/reports/tax' }
      ]
    },
    { text: 'Customer Support', icon: <SupportIcon />, path: '/admin/support' },
    { 
      text: 'Content Management', 
      icon: <ArticleIcon />, 
      children: [
        { text: 'Banners', icon: <ArticleIcon />, path: '/admin/content/banners' },
        { text: 'Pages', icon: <ArticleIcon />, path: '/admin/content/pages' },
        { text: 'Blog', icon: <ArticleIcon />, path: '/admin/content/blog' }
      ]
    },
    { 
      text: 'Security & Settings', 
      icon: <SecurityIcon />, 
      children: [
        { text: 'Security Settings', icon: <SecurityIcon />, path: '/admin/settings/security' },
        { text: 'Email Settings', icon: <SecurityIcon />, path: '/admin/settings/email' },
        { text: 'Integrations', icon: <SecurityIcon />, path: '/admin/settings/integrations' },
        { text: 'Backup & Restore', icon: <SecurityIcon />, path: '/admin/settings/backup' }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = item.path === location.pathname;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.text] || false;

    return (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                toggleExpand(item.text);
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            sx={{
              pl: 2,
              py: 1,
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontSize: '0.9rem',
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? 'primary.main' : 'inherit'
              }} 
            />
            {hasChildren && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child, childIndex) => (
                <ListItemButton
                  key={childIndex}
                  onClick={() => child.path && navigate(child.path)}
                  sx={{
                    pl: 4,
                    py: 0.5,
                    backgroundColor: child.path === location.pathname ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: '36px',
                    color: child.path === location.pathname ? 'primary.main' : 'inherit'
                  }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={child.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.85rem',
                      fontWeight: child.path === location.pathname ? 'bold' : 'normal',
                      color: child.path === location.pathname ? 'primary.main' : 'inherit'
                    }} 
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 70,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.2s'
        },
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center',
          padding: 2,
          minHeight: '64px'
        }}
      >
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Kitabey Admin
          </Typography>
        )}
        <Tooltip title={open ? "Close Sidebar" : "Open Sidebar"}>
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 0 }}>
        {menuItems.map(renderMenuItem)}
      </List>
    </Drawer>
  );
};

export default AdminSidebar; 