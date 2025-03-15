import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Rating,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const labels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const ReviewDialog = ({ open, onClose, nannyId, nannyName, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide a review comment');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/nannies/${nannyId}/reviews`, {
        rating,
        comment
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Notify parent component that review was submitted
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.review);
      }
      
      // Close dialog after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to submit review. Please try again.'
      );
    }
  };

  const handleClose = () => {
    // Reset form state
    setRating(0);
    setComment('');
    setHover(-1);
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Review {nannyName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Share your experience with this nanny to help other parents
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your review has been submitted successfully!
          </Alert>
        )}
        
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="legend" gutterBottom>
            Rate your experience
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              name="rating"
              value={rating}
              precision={1}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              size="large"
              disabled={loading || success}
            />
            {rating !== null && (
              <Box sx={{ ml: 2, minWidth: 80 }}>
                <Typography variant="body2">
                  {labels[hover !== -1 ? hover : rating] || ''}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading || success}
          placeholder="Share details of your experience with this nanny"
        />
        
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || success || rating === 0 || !comment.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog; 