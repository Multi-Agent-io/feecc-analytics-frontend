import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Search.module.css';
import searchIcon from '../../assets/search.svg';

export default function Search({ onSearch, onChange, value }) {
  const { t } = useTranslation();
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch !== undefined) onSearch();
  };
  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchIcon}>
        <img src={searchIcon} alt="search icon" />
      </div>
      <input value={value || ''} onKeyDown={onKeyDown} onChange={(e) => onChange && onChange(e.target.value)} className={styles.searchField} placeholder={t('search.enterName')} />
      <button
        type="button"
        onClick={() => {
          if (onSearch !== undefined) onSearch();
        }}
        className={styles.searchButton}
      >
        {t('search.Find')}
      </button>
    </div>
  );
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
