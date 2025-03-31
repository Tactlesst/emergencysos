import { useState } from 'react';
import styles from '../styles/Auth.module.css';
import Login from './Login';
import Register from './Register';

export default function Auth() {
  const [activeForm, setActiveForm] = useState('selection');
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          {activeForm === 'selection' ? (
            <div className={styles.selectionScreen}>
              <h2 className={styles.welcomeTitle}>Welcome!</h2>
              <p className={styles.welcomeSubtitle}>Please choose an option:</p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.selectionButton}
                  onClick={() => setActiveForm('login')}
                >
                  Log In
                </button>
                <button
                  className={styles.selectionButton}
                  onClick={() => setActiveForm('register')}
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setActiveForm('selection')}
                className={styles.closeButton}
              >
                &times;
              </button>
              
              {activeForm === 'login' ? (
                <Login 
                  switchToRegister={() => setActiveForm('register')} 
                  closeAuth={() => setActiveForm('selection')}
                />
              ) : (
                <Register 
                  switchToLogin={() => setActiveForm('login')} 
                  closeAuth={() => setActiveForm('selection')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}