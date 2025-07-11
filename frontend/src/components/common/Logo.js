import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo component that displays the CarringNanny logo
 * @param {Object} props - Component props
 * @param {string|number} props.size - Size of the logo (small, medium, large, or custom size in px)
 * @param {Object} props.sx - Additional styles to apply to the logo container
 * @param {boolean} props.withText - Whether to display the text "CarringNanny"
 */
const Logo = ({ size = 'medium', withText = false, sx = {} }) => {
  const theme = useTheme();
  
  // Determine logo dimensions based on size prop
  let dimensions = { width: '40px', height: '40px' };
  let fontSize = '1.2rem';
  
  switch (size) {
    case 'small':
      dimensions = { width: '30px', height: '30px' };
      fontSize = '0.9rem';
      break;
    case 'medium':
      dimensions = { width: '40px', height: '40px' };
      fontSize = '1.2rem';
      break;
    case 'large':
      dimensions = { width: '60px', height: '60px' };
      fontSize = '1.5rem';
      break;
    default:
      if (typeof size === 'number') {
        dimensions = { width: `${size}px`, height: `${size}px` };
        fontSize = `${size * 0.3}px`;
      }
  }
  
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: sx.color ? 'transparent' : theme.palette.primary.main,
          color: sx.color || '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...dimensions,
          ...sx,
          transition: 'all 0.3s ease',
          fontWeight: 800,
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Typography 
          variant="h6" 
          component="span" 
          sx={{ 
            fontSize, 
            fontWeight: 800, 
            fontFamily: 'Nunito, sans-serif',
            lineHeight: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          CN
        </Typography>
      </Box>
      
      {withText && (
        <Typography
          variant="h6"
          sx={{
            ml: 1.5,
            fontWeight: 700,
            color: sx.color || theme.palette.primary.main,
            fontSize: fontSize,
            display: { xs: 'none', sm: 'block' },
            '@media (max-width: 600px)': {
              display: sx.forceShowText ? 'block' : 'none',
            },
          }}
        >
          CarringNanny
        </Typography>
      )}
    </Link>
  );
};

export default Logo; 