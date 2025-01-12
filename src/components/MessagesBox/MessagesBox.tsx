import styles from './MessagesBox.module.scss';

function MessagesBox () {
return (
    <div className={styles.messageBoxRow}>
        <div className={styles.messageBoxContainer}>
            <div className={styles.messageBox}>
                <p>Please Select the time you want to focus?</p>
            </div>
        </div>
    </div>
)}

export default  MessagesBox;
