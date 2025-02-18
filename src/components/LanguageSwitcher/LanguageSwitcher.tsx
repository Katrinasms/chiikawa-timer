// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
// import './LanguageSwitcher.module.scss';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className={`${styles.topBar}`}>
       {/* <div className={styles.selectWrapper}> */}
      <select onChange={handleChange} value={i18n.language} className={`${styles.select}`}>
        <option value="en" className={styles.option}>English</option>
        <option value="zh" className={styles.option}>中文</option>
        <option value="ja" className={styles.option}>日本語</option>
        <option value="si" className={styles.option}>සිංහල</option>
      </select>
      {/* </div>  */}
    </div>
  );
};

export default LanguageSwitcher;
