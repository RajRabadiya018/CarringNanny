import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Fade,
    Grid,
    Grow,
    Paper,
    Stack,
    Typography,
    useTheme,
    Zoom,
} from '@mui/material';
import { keyframes } from '@mui/system';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const sparkle = keyframes`
  0% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(0); }
`;

const Home = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Find the Perfect Nanny',
      description: 'Search through our database of professional nannies based on your specific needs and preferences.'
    },
    {
      icon: <CalendarMonthIcon fontSize="large" color="primary" />,
      title: 'Easy Scheduling',
      description: 'View nanny availability and book appointments directly through our integrated calendar system.'
    },
    {
      icon: <VerifiedIcon fontSize="large" color="primary" />,
      title: 'Verified Professionals',
      description: 'All nannies undergo thorough background checks and verification processes for your peace of mind.'
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Platform',
      description: 'Your data and communications are protected with industry-standard security measures.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
      text: 'CarringNanny has been a lifesaver for our family. We found an amazing nanny who has become like family to us. The platform is so easy to use!'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Parent',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      text: 'As a busy professional, finding reliable childcare was always a challenge until I discovered CarringNanny. The booking system is seamless and the nannies are top-notch.'
    },
    {
      name: 'Emily Chen',
      role: 'Nanny',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      text: 'Being a nanny on this platform has connected me with wonderful families. The calendar system makes scheduling so much easier, and I love the professional interface.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%, #5E35B1 100%)`,
          color: 'white',
          pt: { xs: 3, sm: 5, md: 7 },
          pb: { xs: 6, sm: 8, md: 12 },
          mt: { xs: 0, sm: 0, md: 0 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { md: '0 0 2.5rem 2.5rem' },
          boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Colorful floating bubbles for a playful atmosphere */}
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            top: '-100px',
            right: '-100px',
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            bottom: '-50px',
            left: '10%',
            animation: `${float} 8s ease-in-out infinite 1s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,183,77,0.2) 0%, rgba(255,183,77,0) 70%)',
            top: '20%',
            left: '15%',
            animation: `${float} 7s ease-in-out infinite 0.5s`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(130,177,255,0.3) 0%, rgba(130,177,255,0) 70%)',
            top: '60%',
            right: '15%',
            animation: `${float} 5s ease-in-out infinite 1.5s`,
          }}
        />
        
        {/* Small playful elements scattered around */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              borderRadius: '50%',
              backgroundColor: i % 2 ? theme.palette.secondary.light : '#FFD54F',
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              opacity: 0.7,
              animation: `${sparkle} ${Math.random() * 3 + 3}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                      mb: 2,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: 0,
                        width: '40%',
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}, rgba(255,255,255,0))`,
                        borderRadius: '2px',
                      }
                    }}
                  >
                    Find Your Perfect <Box 
                      component="span" 
                      sx={{ 
                        color: 'white',
                        position: 'relative',
                        fontWeight: 'bold',
                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -10,
                          right: -15,
                          width: 20,
                          height: 20,
                          backgroundImage: 'radial-gradient(circle, #FFD54F 20%, rgba(255,255,255,0) 70%)',
                          borderRadius: '50%',
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }
                      }}
                    >
                      Nanny
                    </Box> Match
                  </Typography>
                  <Typography 
                    variant="h6" 
                    paragraph 
                    sx={{ 
                      mb: 4, 
                      opacity: 0.95, 
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      lineHeight: 1.6,
                      maxWidth: '90%',
                      textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Connect with professional, verified nannies who match your family's unique needs. 
                    Book appointments, manage schedules, and find the perfect childcare solution.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* Only show Find Nannies button for parents or non-authenticated users */}
                    {(!isAuthenticated || (isAuthenticated && user?.role !== 'nanny')) && (
                      <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          component={RouterLink} 
                          to="/nannies"
                          sx={{ 
                            bgcolor: 'white', 
                            color: 'primary.main',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                            '&:hover': { 
                              bgcolor: 'grey.100',
                              transform: 'translateY(-5px)',
                              boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.3)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          }}
                          startIcon={<SearchIcon />}
                        >
                          Find Nannies
                        </Button>
                      </Zoom>
                    )}
                    
                    {/* Show Dashboard button for nannies */}
                    {isAuthenticated && user?.role === 'nanny' && (
                      <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          component={RouterLink} 
                          to="/nanny/dashboard"
                          sx={{ 
                            bgcolor: 'white', 
                            color: 'primary.main',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
                            '&:hover': { 
                              bgcolor: 'grey.100',
                              transform: 'translateY(-5px)',
                              boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.3)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          }}
                        >
                          Nanny Dashboard
                        </Button>
                      </Zoom>
                    )}
                    
                    {/* Only show Register button for non-authenticated users */}
                    {!isAuthenticated && (
                      <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                        <Button 
                          variant="outlined" 
                          size="large" 
                          component={RouterLink} 
                          to="/register"
                          sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            borderWidth: '2px',
                            '&:hover': { 
                              borderColor: 'white', 
                              bgcolor: 'rgba(255,255,255,0.1)',
                              transform: 'translateY(-5px)',
                              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          }}
                        >
                          Register Now
                        </Button>
                      </Zoom>
                    )}
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Zoom in={true} style={{ transitionDelay: '700ms' }}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -15,
                      left: -15,
                      right: 15,
                      bottom: 15,
                      background: 'linear-gradient(135deg, rgba(255,112,67,0.2) 0%, rgba(255,183,77,0.2) 100%)',
                      borderRadius: 5,
                      zIndex: -1,
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                    alt="Nanny with children"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 4,
                      boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      }
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      animation: `${float} 3s ease-in-out infinite`,
                    }}
                  >
                    <ChildCareIcon sx={{ color: theme.palette.primary.main, fontSize: 35 }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -15,
                      left: 25,
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.secondary.main,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      animation: `${float} 4s ease-in-out infinite 1s`,
                    }}
                  >
                    <FavoriteIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.customColors.lightPurple} 0%, rgba(255,255,255,0) 70%)`,
            opacity: 0.7,
            zIndex: -1,
          }}
        />
        
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  position: 'relative',
                  display: 'inline-block',
                  mb: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    borderRadius: '2px'
                  }
                }}
              >
                Why Choose CarringNanny
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                Our platform makes finding and managing childcare simple, secure, and seamless for families.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in={true} style={{ transformOrigin: '0 0 0', transitionDelay: `${index * 200}ms` }}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      background: index % 2 === 0 
                        ? `linear-gradient(135deg, ${theme.palette.customColors.lightPurple} 0%, #F5F0FF 100%)`
                        : `linear-gradient(135deg, ${theme.palette.customColors.pastelPink} 0%, #FFF5F0 100%)`,
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: theme.shadows[4],
                        '& .feature-icon-container': {
                          transform: 'scale(1.1)',
                        }
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                        opacity: 0.5,
                      }
                    }}
                  >
                    <Box 
                      className="feature-icon-container"
                      sx={{ 
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        margin: '0 auto 20px',
                        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                        border: `1px solid ${theme.palette.primary.lighter}`,
                      }}
                    >
                      {React.cloneElement(feature.icon, { 
                        fontSize: 'large',
                        sx: { fontSize: '36px' }
                      })}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      fontWeight="600"
                      sx={{
                        color: theme.palette.primary.dark,
                        position: 'relative',
                        display: 'inline-block',
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: `linear-gradient(to bottom, #fff 0%, ${theme.palette.customColors.softGray} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.customColors.lightPurple} 0%, rgba(255,255,255,0))`,
            top: '-200px',
            left: '-200px',
            opacity: 0.6,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.customColors.pastelPink} 0%, rgba(255,255,255,0))`,
            bottom: '-150px',
            right: '-150px',
            opacity: 0.6,
          }}
        />
        
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 8, position: 'relative', zIndex: 2 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  position: 'relative',
                  display: 'inline-block',
                  mb: 4,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: '2px'
                  }
                }}
              >
                What Families Are Saying <EmojiEmotionsIcon sx={{ ml: 1, verticalAlign: 'middle', color: theme.palette.warning.main }} />
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                Don't just take our word for it. Hear from the parents and nannies who use our platform every day.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'visible',
                      position: 'relative',
                      p: 3,
                      pt: 7,
                      background: 'linear-gradient(135deg, #ffffff 0%, #F8F9FA 100%)',
                      transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-15px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                        '& .testimonial-avatar': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                        }
                      }
                    }}
                  >
                    <Box
                      className="testimonial-avatar"
                      sx={{
                        position: 'absolute',
                        top: -40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: '4px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        zIndex: 5,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={testimonial.image}
                        alt={testimonial.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1, pt: 2 }}>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" color="primary.dark">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="subtitle2" color="primary.main" gutterBottom>
                        {testimonial.role}
                      </Typography>
                      <Box 
                        sx={{ 
                          mb: 2, 
                          display: 'flex', 
                          justifyContent: 'center',
                          color: theme.palette.warning.main
                        }}
                      >
                        {"★★★★★"}
                      </Box>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          position: 'relative',
                          '&:before': { content: '"\\201C"', marginRight: '4px', fontSize: '1.4em', color: theme.palette.primary.light },
                          '&:after': { content: '"\\201D"', marginLeft: '4px', fontSize: '1.4em', color: theme.palette.primary.light }
                        }}
                      >
                        {testimonial.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 8, md: 10 },
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        textAlign: 'center',
        borderRadius: { md: '2rem 2rem 0 0' },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            animation: `${float} 7s ease-in-out infinite 1s`,
          }}
        />
        
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                Ready to Find Your Perfect Nanny?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5, 
                  opacity: 0.95,
                  maxWidth: '700px',
                  mx: 'auto'
                }}
              >
                Join thousands of families who have found reliable, professional childcare through CarringNanny.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3}
                justifyContent="center"
              >
                {/* Sign Up button only for non-authenticated users */}
                {!isAuthenticated && (
                  <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={RouterLink} 
                      to="/register"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        fontWeight: 'bold',
                        px: 5,
                        py: 1.8,
                        fontSize: '1.1rem',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                        '&:hover': { 
                          bgcolor: 'grey.100',
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 12px 25px rgba(0,0,0,0.25)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      Sign Up Today
                    </Button>
                  </Zoom>
                )}
                
                {/* Browse Nannies button for everyone except nannies */}
                {(!isAuthenticated || (isAuthenticated && user?.role !== 'nanny')) && (
                  <Zoom in={true} style={{ transitionDelay: '400ms' }}>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      component={RouterLink} 
                      to="/nannies"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white',
                        borderWidth: '2px',
                        fontWeight: 'bold',
                        px: 5,
                        py: 1.8,
                        fontSize: '1.1rem',
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white',
                          borderWidth: '2px',
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 8px 15px rgba(0,0,0,0.15)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      Browse Nannies
                    </Button>
                  </Zoom>
                )}
                
                {/* Dashboard button for authenticated nannies */}
                {isAuthenticated && user?.role === 'nanny' && (
                  <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={RouterLink} 
                      to="/nanny/dashboard"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        fontWeight: 'bold',
                        px: 5,
                        py: 1.8,
                        fontSize: '1.1rem',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                        '&:hover': { 
                          bgcolor: 'grey.100',
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 12px 25px rgba(0,0,0,0.25)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </Zoom>
                )}
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
