import React from 'react';
import LogoHolder from '../DetasadLogoHolder/DetasadLogoHolder';
import styles from './DetasadLeftContent.less';

const DetasadLeftContent = ({ children }) => {
  return <div style={{paddingRight: `30px`}} className={styles['ds-gh-left-content']}>{children}</div>;
};

export default DetasadLeftContent;
