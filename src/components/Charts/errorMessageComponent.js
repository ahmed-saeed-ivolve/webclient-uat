import react from 'react';
import styles from './errorMessageComponent.css';

const ErrorComponent = ({ error }) => {
    return (
        <div className={styles.errorMessageComponent}>
            <span>{error}</span>
        </div>
    );
};

export default ErrorComponent;
