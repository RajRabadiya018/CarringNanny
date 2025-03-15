import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  Typography
} from '@mui/material';
import React from 'react';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const TermsAndConditions = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center', 
        gap: 1 
      }}>
        <GavelIcon />
        <Typography variant="h6" component="div">
          Terms & Conditions - Child Care Professional Agreement
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* Platform Disclaimer Alert */}
        <Alert 
          severity="warning" 
          variant="filled"
          sx={{ mb: 3 }}
          icon={<InfoIcon />}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            PLATFORM DISCLAIMER
          </Typography>
          <Typography variant="body2">
            CarringNanny is solely a platform connecting parents with childcare providers. We are NOT the employer of any nanny and are NOT responsible for the actions, conduct, or violations performed by nannies during care services. Parents are advised to conduct their own due diligence.
          </Typography>
        </Alert>

        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <VerifiedUserIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              Professional Child Care Provider Agreement
            </Typography>
          </Box>
          <Typography variant="body2">
            By registering as a Nanny on CarringNanny, you are accepting a position of significant trust and responsibility for the care of children. 
            These terms and conditions constitute a legally binding agreement that establishes the standards and requirements for providing professional childcare services through our platform.
          </Typography>
        </Paper>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <PolicyIcon color="primary" />
            1. Child Care Specific Responsibilities
          </Box>
        </SectionTitle>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Age-Appropriate Care" 
              secondary="Provide care suitable for the child's developmental stage, including appropriate activities, nutrition, and sleep routines."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Child Safety Priority" 
              secondary="The physical and emotional safety of children under your care must be your paramount concern at all times."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Infant-Specific Protocols" 
              secondary="Follow safe sleep practices for infants, proper feeding techniques, and diapering hygiene protocols."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Family Communication" 
              secondary="Maintain clear communication with parents regarding the child's daily activities, meals, naps, and any incidents."
            />
          </ListItem>
        </List>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <GavelIcon color="primary" />
            2. Indian Legal Framework for Child Care Providers
          </Box>
        </SectionTitle>
        <Typography variant="body2" paragraph>
          As a childcare provider in India, you are subject to the following legal frameworks specifically related to child care:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <GavelIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Protection of Children from Sexual Offences Act, 2012 (POCSO Act)" 
              secondary="Establishes comprehensive provisions to protect children from sexual offenses, sexual harassment, and pornography."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GavelIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Juvenile Justice (Care and Protection of Children) Act, 2015" 
              secondary="Mandates reporting of any known or suspected abuse, neglect, or harm to children."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GavelIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="The Commissions for Protection of Child Rights Act, 2005" 
              secondary="Establishes National and State Commissions for protecting child rights and ensuring proper development."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GavelIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="The Right of Children to Free and Compulsory Education Act, 2009" 
              secondary="Guarantees free and compulsory education to all children aged 6-14 years."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GavelIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="The Infant Milk Substitutes, Feeding Bottles and Infant Foods Act, 1992" 
              secondary="Regulates the production, supply and distribution of infant milk substitutes, feeding bottles and infant foods."
            />
          </ListItem>
        </List>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberIcon color="warning" />
            3. Child Care Safety Standards
          </Box>
        </SectionTitle>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Constant Age-Appropriate Supervision" 
              secondary="Maintain appropriate supervision levels based on the child's age: direct supervision for infants and toddlers, regular check-ins for older children."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Infant and Child Health Emergencies" 
              secondary="Know infant/child CPR, choking response, emergency protocols, and maintain emergency contact information."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Child-Proofed Environment" 
              secondary="Ensure environments are free from choking hazards, unsafe toys, toxic substances, and potential fall or injury risks."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Hygienic Practices" 
              secondary="Maintain proper hand washing, food preparation, diaper changing, and sanitization procedures to prevent illness."
            />
          </ListItem>
        </List>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <PolicyIcon color="primary" />
            4. CarringNanny Platform Policies
          </Box>
        </SectionTitle>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Independent Contractor Status" 
              secondary="You understand that you are an independent contractor and not an employee of CarringNanny. The platform only facilitates connections between you and parents."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Booking Management" 
              secondary="Respond to booking requests within 24 hours, and honor all confirmed bookings. Cancellations should only occur in exceptional circumstances."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Background Verification" 
              secondary="Consent to background verification processes which may include identity verification, reference checks, and/or background screening."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Review System" 
              secondary="Accept that your services will be subject to reviews from parents, which will be displayed on your profile."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Platform Communication" 
              secondary="Conduct all booking arrangements through the platform to ensure proper documentation and protection for all parties."
            />
          </ListItem>
        </List>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="info" />
            5. Platform Disclaimer and Liability
          </Box>
        </SectionTitle>
        <Paper elevation={0} sx={{ p: 2, my: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
          <Typography variant="body2" paragraph>
            <strong>CarringNanny is a CONNECTION PLATFORM ONLY.</strong> We are not an employer, agency, or representative of any nanny. Our role is limited to:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Providing a platform for parents and nannies to connect"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Facilitating profile creation and booking processes"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Enabling ratings and reviews between users"
              />
            </ListItem>
          </List>
          <Typography variant="body2" fontWeight="bold" paragraph>
            CarringNanny is NOT responsible for:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <WarningAmberIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="The actions, negligence, or misconduct of any nanny during care services"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningAmberIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Any violations of laws, regulations, or standards by nannies"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningAmberIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="The quality or safety of care provided by individual nannies"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningAmberIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Disputes arising between parents and nannies beyond facilitating communication"
              />
            </ListItem>
          </List>
        </Paper>

        <SectionTitle variant="h6">
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberIcon color="error" />
            6. Violations and Termination
          </Box>
        </SectionTitle>
        <Typography variant="body2" paragraph>
          Violation of these terms, especially those related to child safety or legal compliance, may result in:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <WarningAmberIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Immediate suspension or termination of your account"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningAmberIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Reporting to relevant authorities as required by law"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningAmberIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Possible legal action if violations result in harm or liability"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" align="center" fontStyle="italic">
          By accepting these terms, you acknowledge your understanding of the crucial role you play in children's lives,
          commit to maintaining the highest standards of professionalism and child care safety, and understand that 
          CarringNanny is solely a platform connecting you with parents and not responsible for your individual conduct or services.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained">
          I Understand and Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditions; 