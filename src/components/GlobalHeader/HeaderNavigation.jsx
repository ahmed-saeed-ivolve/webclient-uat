import React from 'react';
import { Link } from 'umi';
import { Icon } from 'antd';
import styles from './HeaderNavigation.less';

const HeaderNavigation = props => {
  return (
    <nav className={`${styles['ds-gh-links-ul']} ${styles[props.side]}`}>{props.children}</nav>
  );
};
export default HeaderNavigation;
