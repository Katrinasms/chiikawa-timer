
import { Box, Container } from '@mui/material';

function Characters() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 0,
          py: 0
        }}
      >
        <Box
          component="img"
          sx={{
            width: '30%',
            height: 'auto',
            objectFit: 'cover',
          }}
          src="/assets/hachiwa.webp"
          alt="hachiwa"
        />
        
        <Box
          component="img"
          sx={{
            width: '30%',
            height: 'auto',
            objectFit: 'cover',
          }}
          src="/assets/AdorableCutieChiikawa.webp"
          alt="Chiikawa"
        />
        
        <Box
          component="img"
          sx={{
            width: '30%',
            height: 'auto',
            objectFit: 'cover',
          }}
          src="/assets/YahaUsagi.webp"
          alt="YahaUsagi"
        />
      </Box>
    </Container>
  );
};


  
  export default Characters;