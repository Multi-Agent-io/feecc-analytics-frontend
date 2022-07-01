import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Search.module.css';
import searchIcon from '../../assets/search.svg';

export default function Search({ onSearch }) {
  const { t } = useTranslation();
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch !== undefined) {
      onSearch()
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchIcon}>
        <img src={searchIcon} alt="search icon" />
      </div>
      <input value={props.value || ''}
        onKeyDown={onKeyDown}
        onChange={(e) => props.onChange && props.onChange(e.target.value)}
        className={styles.searchField} placeholder={props.placeholder || t('search.enterName')} />
      <button onClick={() => props.onSearch && props.onSearch()}
        className={styles.searchButton}>{t('search.Find')}</button>
    </div>
  );
}
