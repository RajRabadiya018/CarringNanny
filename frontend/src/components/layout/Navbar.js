import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Navbar = ({ container }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Reference to container element for the drawer
  const containerRef = container !== undefined ? container : window.document.body;

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }

    // Handle dashboard paths specially to ensure correct highlighting
    if (path.includes('/dashboard')) {
      return location.pathname.includes(path);
    }

    return location.pathname.startsWith(path);
  };

  const getNavItems = useCallback(() => {
    const navItems = [
      {
        name: 'Home',
        path: '/',
        icon: <HomeIcon />,
      },
    ];

    // Only show "Find Nannies" for non-nanny users (parents, admins, or not logged in)
    if (!user || user.role !== 'nanny') {
      navItems.push({
        name: 'Find Nannies',
        path: '/nannies',
        icon: <ChildCareIcon />,
      });
    }

    // Add dashboard based on user role - only add one dashboard entry
    if (user) {
      if (user.role === 'parent') {
        navItems.push({
          name: 'Parent Dashboard',
          path: '/parent/dashboard',
          icon: <DashboardIcon />,
        });
      } else if (user.role === 'nanny') {
        navItems.push({
          name: 'Nanny Dashboard',
          path: '/nanny/dashboard',
          icon: <DashboardIcon />,
        });
      } else if (user.role === 'admin') {
        navItems.push({
          name: 'Admin Dashboard',
          path: '/admin/dashboard',
          icon: <AdminPanelSettingsIcon />,
        });
      }
    }

    return navItems;
  }, [user]);

  // Get navigation items based on current user
  const navItems = getNavItems();

  // Define separate menu items only shown in user menu
  const userMenuItems = isAuthenticated
    ? [
      {
        title: 'Edit Profile',
        path: '/profile/edit',
        onClick: handleCloseUserMenu,
        icon: <PersonIcon fontSize="small" />
      },
      {
        title: 'Logout',
        onClick: handleLogout,
        icon: <LogoutIcon fontSize="small" />
      },
    ]
    : [
      {
        title: 'Login',
        path: '/login',
        onClick: handleCloseUserMenu,
        icon: <PersonIcon fontSize="small" />
      },
      {
        title: 'Register',
        path: '/register',
        onClick: handleCloseUserMenu,
        icon: <PersonIcon fontSize="small" />
      },
    ];

  // Get role-specific styling for indication
  const getRoleStyles = () => {
    if (!isAuthenticated) return {};

    if (user?.role === 'parent') {
      return {
        roleColor: theme.palette.secondary.main,
        roleIcon: <FamilyRestroomIcon fontSize="small" />,
        roleName: 'Parent'
      };
    } else if (user?.role === 'admin') {
      return {
        roleColor: theme.palette.error.main,
        roleIcon: <AdminPanelSettingsIcon fontSize="small" />,
        roleName: 'Admin'
      };
    } else {
      return {
        roleColor: theme.palette.primary.main,
        roleIcon: <ChildCareIcon fontSize="small" />,
        roleName: 'Nanny'
      };
    }
  };

  const roleStyles = getRoleStyles();

  // Drawer component for mobile view
  const drawer = (
    <Box sx={{ width: 250, pt: 2, height: '100%', backgroundColor: '#fcfaff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Logo size={40} withText={true} />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {getNavItems().map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              onClick={() => {
                handleDrawerToggle();
                navigate(item.path);
              }}
              sx={{
                backgroundColor: location.pathname === item.path ? theme.palette.customColors.lightPurple : 'transparent',
                borderRadius: '8px',
                mx: 1,
                '&:hover': {
                  backgroundColor: theme.palette.customColors.lightPurple,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              <ListItemIcon sx={{
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2 }}>
        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 1 }}>
              <Avatar
                src={user.profilePicture}
                alt={user.name}
                sx={{
                  mr: 2,
                  width: 40,
                  height: 40,
                  border: `2px solid ${roleStyles.roleColor}`,
                }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {roleStyles.roleName}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => {
                handleDrawerToggle();
                handleLogout();
              }}
              startIcon={<LogoutIcon />}
              sx={{ mb: 1 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                handleDrawerToggle();
                navigate('/login');
              }}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => {
                handleDrawerToggle();
                navigate('/register');
              }}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 2 : 0}
        sx={{
          bgcolor: scrolled ? 'white' : 'primary.main',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? `1px solid ${theme.palette.grey[200]}` : 'none',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: '56px', md: '70px' },
              minHeight: { xs: '56px', md: '70px' },
              px: { xs: 1, sm: 2 }
            }}
          >
            {/* Mobile Menu Button */}
            <IconButton
              color={scrolled ? "primary" : "inherit"}
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                backgroundColor: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(126, 87, 194, 0.1)' : 'rgba(255, 255, 255, 0.25)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
              <Logo
                size={isMobile ? 'small' : 'medium'}
                withText={!isMobile}
                sx={{
                  color: scrolled ? theme.palette.primary.main : '#fff',
                  display: 'flex',
                  mr: { xs: 0, md: 3 },
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
              {navItems.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    my: 2,
                    mx: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: scrolled ? 'text.primary' : 'white',
                    fontWeight: isActive(page.path) ? 700 : 500,
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '5px',
                      left: '50%',
                      width: isActive(page.path) ? '30%' : '0%',
                      transform: 'translateX(-50%)',
                      borderBottom: `3px solid ${scrolled ? theme.palette.primary.main : '#fff'}`,
                      transition: 'width 0.3s ease'
                    },
                    '&:hover:after': {
                      width: '30%',
                    }
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* User Menu - desktop */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user ? (
                <>
                  <Chip
                    label={roleStyles.roleName}
                    icon={roleStyles.roleIcon}
                    sx={{
                      mr: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontWeight: 'bold',
                      display: { xs: 'none', md: 'flex' },
                      '& .MuiChip-icon': {
                        color: '#fff',
                      },
                    }}
                  />
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={user.name}
                        src={user.profilePicture}
                        sx={{
                          width: { xs: 34, md: 40 },
                          height: { xs: 34, md: 40 },
                          border: '2px solid #fff',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          }
                        }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      mr: 1.5,
                      color: '#fff',
                      borderColor: '#fff',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      background: `linear-gradient(90deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
                      boxShadow: '0 4px 14px rgba(255, 112, 67, 0.4)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(255, 112, 67, 0.6)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer
          container={containerRef}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: '85%', sm: 300 },
              borderRadius: '0 20px 20px 0',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.5)' }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* User Menu popover */}
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            padding: 1,
            minWidth: 220,
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
          <Chip
            label={roleStyles.roleName}
            size="small"
            icon={roleStyles.roleIcon}
            sx={{
              mt: 1,
              bgcolor: 'rgba(126, 87, 194, 0.1)',
              color: roleStyles.roleColor,
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                color: roleStyles.roleColor,
              },
            }}
          />
        </Box>
        <Divider sx={{ my: 1 }} />
        {/* Different menu items */}
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.title}
            onClick={() => {
              handleCloseUserMenu();
              if (item.onClick) item.onClick();
              if (item.path) navigate(item.path);
            }}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.customColors.lightPurple,
                transform: 'translateX(5px)',
              }
            }}
          >
            <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}>
              {item.icon}
            </Box>
            <Typography>{item.title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Navbar;
