import { useContext } from 'react';
import styles from './MessagesBox.module.scss';
import { MessageContext } from '../../services/MessageContext'

// function MessagesBox () {
// return (
//     <div className={styles.messageBoxRow}>
//         <div className={styles.messageBoxContainer}>
//             <div className={styles.messageBox}>
//                 <p>Please Select the time you want to focus?</p>
//             </div>
//         </div>
//     </div>
// )}

const MessagesBox = () => {
    const { state } = useContext(MessageContext);
  
    return (
      <div className={`${styles.messageBoxRow} ${styles[state.message.position]}`}>
        <div className={styles.messageBoxContainer} >
          <div className={styles.messageBox} style={{ backgroundColor: state.message.color }}>
            <p>{state.message.text}</p>
          </div>
        </div>
      </div>
    );
  };

export default  MessagesBox;
