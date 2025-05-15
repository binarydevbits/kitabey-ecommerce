import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Avatar,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  SupportAgent as SupportAgentIcon
} from '@mui/icons-material';
import axios from 'axios';

const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'support', text: string, time: string}[]>([
    {
      sender: 'support',
      text: 'Hi there! How can I help you today?',
      time: '10:30 AM'
    }
  ]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/email/contact', formData);
      setSnackbar({
        open: true,
        message: 'Message sent successfully! We will get back to you soon.',
        severity: 'success'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again later.',
        severity: 'error'
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle chat message send
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([...chatMessages, {
      sender: 'user',
      text: chatMessage,
      time
    }]);
    
    setChatMessage('');
    
    // Simulate response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'support',
        text: 'Thanks for your message! A support representative will be with you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };
  
  // FAQs
  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 day delivery.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Books must be in original condition with no markings or damage. Please include your order number with your return.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. These options are available during checkout.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order in your account dashboard under "My Orders".'
    },
  ];
  
  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      pt: 3,
      pb: 8 
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: { xs: 6, md: 10 },
          color: 'white',
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight={700} 
            sx={{ 
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }
            }}
          >
            Get in Touch
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              maxWidth: 600, 
              opacity: 0.9,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            We're here to help with any questions about our books, orders, or services
          </Typography>
          
          <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Call Us</Typography>
                  <Typography variant="body1" fontWeight={500}>+1 (555) 123-4567</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Email Us</Typography>
                  <Typography variant="body1" fontWeight={500}>support@kitabey.com</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <AccessTimeIcon />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Business Hours</Typography>
                  <Typography variant="body1" fontWeight={500}>Mon-Fri: 9AM - 6PM</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Left Column */}
          <Grid item xs={12} md={7}>
            {/* Form Section */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 5,
                borderRadius: 3,
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transform: 'translateY(-30px)',
                bgcolor: 'background.paper'
              }}
            >
              <Box 
                sx={{ 
                  p: { xs: 3, md: 4 },
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.background.paper} 100%)`
                }}
              >
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Fill out the form below and our team will get back to you within 24 hours.
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        fullWidth
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Subject"
                        fullWidth
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Message"
                        multiline
                        rows={6}
                        fullWidth
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting}
                        size="large"
                        endIcon={<SendIcon />}
                        sx={{ 
                          py: 1.5, 
                          px: 4, 
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: `0 8px 20px ${theme.palette.primary.main}40`
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Card>
            
            {/* FAQ Section */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Frequently Asked Questions
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Find quick answers to common questions about our service and policies.
              </Typography>
              
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index}
                  elevation={0}
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      px: 3,
                      '&:hover': { bgcolor: theme.palette.action.hover }
                    }}
                  >
                    <Typography fontWeight={500}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Typography color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} md={5}>
            {/* Map Card */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}
            >
              <Box 
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215170164073!2d-73.9888191857964!3d40.75740084275287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1678971095566!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kitabey Bookstore Location"
              />
              
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Visit Our Store
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                  <LocationIcon sx={{ mr: 2, color: theme.palette.primary.main, mt: 0.5 }} />
                  <Typography>
                    123 Book Street<br />
                    Literary District<br />
                    Reading, RD 12345
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom fontWeight={500}>
                  Business Hours
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography fontWeight={500}>Monday - Friday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>9:00 AM - 6:00 PM</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography fontWeight={500}>Saturday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>10:00 AM - 4:00 PM</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography fontWeight={500}>Sunday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Closed</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Connect on Social */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Connect With Us
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Follow us on social media for updates, book recommendations, and events.
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<FacebookIcon />} 
                    sx={{ flex: 1, borderRadius: 2, py: 1 }}
                  >
                    Facebook
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<TwitterIcon />} 
                    sx={{ flex: 1, borderRadius: 2, py: 1 }}
                  >
                    Twitter
                  </Button>
                </Stack>
                
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<InstagramIcon />} 
                    sx={{ flex: 1, borderRadius: 2, py: 1 }}
                  >
                    Instagram
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<LinkedInIcon />} 
                    sx={{ flex: 1, borderRadius: 2, py: 1 }}
                  >
                    LinkedIn
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Live Chat Fab */}
      <Fab 
        color="primary" 
        aria-label="chat"
        onClick={() => setChatOpen(!chatOpen)}
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20,
          boxShadow: `0 4px 20px ${theme.palette.primary.main}60`,
          zIndex: 1000
        }}
      >
        {chatOpen ? <CloseIcon /> : <QuestionAnswerIcon />}
      </Fab>
      
      {/* Chat Window */}
      {chatOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: { xs: 'calc(100% - 40px)', sm: 350 },
            height: 450,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main, width: 32, height: 32, mr: 1 }}>
              <SupportAgentIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Live Chat Support
              </Typography>
              <Typography variant="caption">
                We typically reply within minutes
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'white' }} onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: theme.palette.background.default
            }}
          >
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%'
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.grey[100],
                    color: msg.sender === 'user' 
                      ? 'white' 
                      : 'text.primary'
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {msg.time}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              InputProps={{
                sx: { borderRadius: 4 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      color="primary" 
                      onClick={handleSendChatMessage}
                      disabled={!chatMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 