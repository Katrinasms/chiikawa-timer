import { useContext } from 'react';
import styles from './MessagesBox.module.scss';
import { MessageContext } from '../../services/MessageContext'
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next'

function MessagesBox () {
  const { state } = useContext(MessageContext);
  const { t } = useTranslation();
return (
      <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          gap: 0,
          py: 0,
        }}
        className={`${styles.messageBoxRow} ${styles[state.message.class]}`}
      >
        <div className={`${styles.messageBox} `}>
           <p>  {t(state.message.text)}
            </p>
        </div>
      </Box>
    </Container>
)}

export default  MessagesBox;
