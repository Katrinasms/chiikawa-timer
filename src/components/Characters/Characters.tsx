import React, { useContext } from 'react'
import { Box, Container } from '@mui/material';
import { CharacterContext } from '../../services/CharacterContext';

function Characters() {
  const { dispatch } = useContext(CharacterContext);

  const characters = [
    { name: 'hachiwa', imgSrc: '/assets/hachiwa.webp', color: '#7fb3d5' },
    { name: 'chiikawa', imgSrc: '/assets/AdorableCutieChiikawa.webp', color: '#FDC7CE' },
    { name: 'yahausagi', imgSrc: '/assets/YahaUsagi.webp', color: '#FFF1CB' },
  ];

  const handleCharacterSelect = (character:any) => {
    dispatch({ type: 'SELECT_CHARACTER', payload: character });
  };




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
      {characters.map((character) => (
        <Box
          key={character.name}
          component="img"
          sx={{
            width: '30%',
            height: 'auto',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          src={character.imgSrc}
          alt={character.name}
          onClick={() => handleCharacterSelect(character)}
        />
      ))}
    </Box>
  </Container>
);



  // return (
  //   <Container maxWidth="lg">
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         justifyContent: 'space-between',
  //         alignItems: 'center',
  //         gap: 0,
  //         py: 0
  //       }}
  //     >
  //       <Box
  //         component="img"
  //         sx={{
  //           width: '30%',
  //           height: 'auto',
  //           objectFit: 'cover',
  //         }}
  //         src="/assets/hachiwa.webp"
  //         alt="hachiwa"
  //         onClick={() => handleCharacterSelect('/assets/hachiwa.webp')}
  //       />
        
  //       <Box
  //         component="img"
  //         sx={{
  //           width: '30%',
  //           height: 'auto',
  //           objectFit: 'cover',
  //         }}
  //         src="/assets/AdorableCutieChiikawa.webp"
  //         alt="Chiikawa"
  //         onClick={() => handleCharacterSelect('/assets/AdorableCutieChiikawa.webp')}
  //       />
        
  //       <Box
  //         component="img"
  //         sx={{
  //           width: '30%',
  //           height: 'auto',
  //           objectFit: 'cover',
  //         }}
  //         src="/assets/YahaUsagi.webp"
  //         alt="YahaUsagi"
  //         onClick={() => handleCharacterSelect('/assets/YahaUsagi.webp')}
  //       />
  //     </Box>
  //   </Container>
  // );
};


  
  export default Characters;