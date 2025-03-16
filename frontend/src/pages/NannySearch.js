import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Rating,
    Select,
    Slider,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NannySearch = () => {
  const { user, isAuthenticated } = useAuth();
  const [nannies, setNannies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRate: 10,
    maxRate: 50,
    minExperience: 0,
    minRating: 0,
    skills: [],
    languages: [],
    specialNeeds: false,
    ageGroups: [],
    services: [],
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const skillOptions = [
    'First Aid',
    'CPR Certified',
    'Early Childhood Education',
    'Meal Preparation',
    'Homework Help',
    'Potty Training',
    'Newborn Care',
    'Swimming',
    'Music',
    'Arts & Crafts',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'Mandarin',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Arabic',
  ];

  const ageGroupOptions = [
    'Infant',
    'Toddler',
    'Preschool',
    'School-age',
    'Teenager',
  ];

  const serviceOptions = [
    'Babysitting',
    'Full-time care',
    'Part-time care',
    'Overnight care',
    'Homework help',
    'Cooking',
    'Light housekeeping',
    'Transportation',
  ];

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initially fetch all nannies without any filters
        const { data } = await axios.get('/api/nannies');
        console.log('Fetched nannies:', data);
        setNannies(data);
      } catch (error) {
        console.error('Error fetching nannies:', error);
        setError('Failed to fetch nannies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNannies();
  }, []); // Empty dependency array to only fetch once on component mount

  // Separate effect for applying filters
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for all filters
        const params = {};
        
        // Always include rate range filters
        params.minRate = filters.minRate;
        params.maxRate = filters.maxRate;
        
        // Add other filters only if they have values
        if (filters.minExperience > 0) params.minExperience = filters.minExperience;
        if (filters.minRating > 0) params.minRating = filters.minRating;
        
        // Add array filters if they have any selected items
        if (filters.skills.length > 0) params.skills = filters.skills.join(',');
        if (filters.languages.length > 0) params.languages = filters.languages.join(',');
        if (filters.ageGroups.length > 0) params.ageGroups = filters.ageGroups.join(',');
        if (filters.services.length > 0) params.services = filters.services.join(',');
        
        // Add boolean filters
        if (filters.specialNeeds) params.specialNeeds = true;
        
        console.log('Applying filters with params:', params);

        const { data } = await axios.get('/api/nannies', { params });
        console.log('Filtered nannies response:', data);
        setNannies(data);
      } catch (error) {
        console.error('Error applying filters:', error);
        setError('Failed to apply filters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Apply filters on initial load and when filters change
    applyFilters();
  }, [filters]); // This effect runs when filters change

  const handleFilterChange = (filterName, value) => {
    console.log(`Changing filter ${filterName} to:`, value);
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleMultiSelectChange = (filterName, values) => {
    console.log(`Changing multi-select filter ${filterName} to:`, values);
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: values,
    }));
  };

  const handleApplyFilters = () => {
    setLoading(true);
    console.log("Manually applying current filters:", filters);
    // The useEffect will handle the actual API call
    // This is just to provide visual feedback
    
    // Scroll to the top of the results
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleResetFilters = () => {
    console.log("Resetting all filters");
    setFilters({
      minRate: 10,
      maxRate: 50,
      minExperience: 0,
      minRating: 0,
      skills: [],
      languages: [],
      specialNeeds: false,
      ageGroups: [],
      services: [],
    });
    setLoading(true); // Show loading indicator for better UX
  };

  // Filter nannies based on search term
  const filteredNannies = nannies.filter((nanny) => {
    const nannyName = nanny.userId?.name?.toLowerCase() || '';
    const nannyBio = nanny.bio?.toLowerCase() || '';
    const nannySkills = nanny.skills?.join(' ').toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();

    return (
      nannyName.includes(searchLower) ||
      nannyBio.includes(searchLower) ||
      nannySkills.includes(searchLower)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ 
      py: 4,
      pt: { xs: 4, sm: 5, md: 6 }, // Increased top padding
      mt: { xs: 3, sm: 4, md: 5 } // Significantly increased margin top
    }}>
      <Box sx={{ mb: 5 }}> {/* Added a wrapper Box with more bottom margin */}
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
          mb: 2, // Increased space between heading and subheading
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          letterSpacing: '-0.5px' // Added slight letter spacing for cleaner text
        }}>
          Find Your Perfect Nanny
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: "85%" }}>
          Browse through our qualified nannies and find the best match for your family
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        mt: { xs: 2, md: 0 }
      }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<FilterListIcon />}
          sx={{ 
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
            px: 2,
            py: 1,
            borderRadius: '4px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'rgba(0, 0, 0, 0.2)',
            }
          }}
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          {nannies.length} nannies found
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} /> 
              Filters
              {(filters.minRate !== 10 || 
                filters.maxRate !== 50 || 
                filters.minExperience !== 0 || 
                filters.minRating !== 0 || 
                filters.skills.length > 0 || 
                filters.languages.length > 0 || 
                filters.specialNeeds !== false || 
                filters.ageGroups.length > 0 || 
                filters.services.length > 0) && (
                <Chip 
                  size="small" 
                  color="primary" 
                  label="Active" 
                  sx={{ ml: 1 }} 
                />
              )}
            </Typography>

            <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Hourly Rate</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  ${filters.minRate} - ${filters.maxRate} per hour
                </Typography>
                <Slider
                  value={[filters.minRate, filters.maxRate]}
                  onChange={(e, newValue) => {
                    handleFilterChange('minRate', newValue[0]);
                    handleFilterChange('maxRate', newValue[1]);
                  }}
                  min={5}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Experience & Rating</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>Minimum Experience (years)</Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value) || 0)}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" gutterBottom>Minimum Rating</Typography>
                <Rating
                  value={filters.minRating}
                  onChange={(e, newValue) => handleFilterChange('minRating', newValue)}
                  precision={0.5}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Skills & Languages</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Skills</InputLabel>
                  <Select
                    multiple
                    value={filters.skills}
                    onChange={(e) => handleMultiSelectChange('skills', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Skills"
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Languages</InputLabel>
                  <Select
                    multiple
                    value={filters.languages}
                    onChange={(e) => handleMultiSelectChange('languages', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Languages"
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Age Groups & Services</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Age Groups</InputLabel>
                  <Select
                    multiple
                    value={filters.ageGroups}
                    onChange={(e) => handleMultiSelectChange('ageGroups', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Age Groups"
                  >
                    {ageGroupOptions.map((ageGroup) => (
                      <MenuItem key={ageGroup} value={ageGroup}>
                        {ageGroup}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Services</InputLabel>
                  <Select
                    multiple
                    value={filters.services}
                    onChange={(e) => handleMultiSelectChange('services', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Services"
                  >
                    {serviceOptions.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Special Requirements</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label="Special Needs Experience"
                    clickable
                    color={filters.specialNeeds ? "primary" : "default"}
                    onClick={() => handleFilterChange('specialNeeds', !filters.specialNeeds)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {filters.specialNeeds ? "Filtered" : "Click to filter"}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleResetFilters}
              sx={{ mb: 2 }}
            >
              Reset Filters
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </Paper>
        </Grid>

        {/* Nanny List */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {!isAuthenticated && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Please <RouterLink to="/login" style={{ fontWeight: 'bold' }}>login</RouterLink> or <RouterLink to="/register" style={{ fontWeight: 'bold' }}>register</RouterLink> to book a nanny.
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Finding nannies...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : filteredNannies.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No nannies found matching your criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1">
                  Found {filteredNannies.length} nannies
                </Typography>
                {(filters.minRate !== 10 || 
                  filters.maxRate !== 50 || 
                  filters.minExperience !== 0 || 
                  filters.minRating !== 0 || 
                  filters.skills.length > 0 || 
                  filters.languages.length > 0 || 
                  filters.specialNeeds !== false || 
                  filters.ageGroups.length > 0 || 
                  filters.services.length > 0) && (
                  <Chip 
                    size="small" 
                    label="Filtered Results" 
                    color="secondary" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </Box>
              <Grid container spacing={3}>
                {filteredNannies.map((nanny) => (
                  <Grid item xs={12} sm={6} md={4} key={nanny._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={nanny.userId?.profileImage || `https://ui-avatars.com/api/?name=${nanny.userId?.name || 'Nanny'}&background=random&size=256`}
                        alt={nanny.userId?.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="h3" fontWeight="bold">
                            {nanny.userId?.name || 'Nanny'}
                          </Typography>
                          <Typography variant="body1" color="primary" fontWeight="bold">
                            ${nanny.hourlyRate}/hr
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={nanny.averageRating} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({nanny.reviews?.length || 0} reviews)
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {nanny.experience} {nanny.experience === 1 ? 'year' : 'years'} experience
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {nanny.bio.substring(0, 120)}...
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {nanny.skills?.slice(0, 3).map((skill, index) => (
                            <Chip key={index} label={skill} size="small" variant="outlined" />
                          ))}
                          {nanny.skills?.length > 3 && (
                            <Chip label={`+${nanny.skills.length - 3} more`} size="small" variant="outlined" />
                          )}
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          component={RouterLink}
                          to={`/nannies/${nanny._id}`}
                        >
                          View Profile
                        </Button>
                        
                        {isAuthenticated && user.role === 'parent' && (
                          <Button
                            variant="outlined"
                            fullWidth
                            component={RouterLink}
                            to={`/booking/${nanny._id}`}
                            sx={{ mt: 1 }}
                          >
                            Book Now
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default NannySearch;
