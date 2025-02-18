import { useContext } from 'react'
import { Box, Container } from '@mui/material';
import { CharacterContext } from '../../services/CharacterContext';
import { MessageContext } from '../../services/MessageContext';

function Characters() {
  const { dispatch: characterDispatch } = useContext(CharacterContext);
  const { dispatch: messageDispatch  } = useContext(MessageContext);

  const characters = [
    { name: 'hachiwa', imgSrc: '/assets/hachiwa.webp', color: '#7fb3d5' },
    { name: 'chiikawa', imgSrc: '/assets/AdorableCutieChiikawa.webp', color: '#FDC7CE' },
    { name: 'usagi', imgSrc: '/assets/YahaUsagi.webp', color: '#FFF1CB' },
  ];

  const handleCharacterSelect = (character:any) => {
    characterDispatch({ type: 'SELECT_CHARACTER', payload: character });
    messageDispatch({ type: 'CLICK_CHARACTER', character: character.name });
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