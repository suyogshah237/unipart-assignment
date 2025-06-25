import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const GoogleSignIn = ({ onLoading, setError, buttonText, disabled }) => {
  const [localError, setLocalError] = useState('');
  const handleGoogleSignIn = async () => {
    try {
      if (setError) setError('');
      else setLocalError('');
      
      // Set loading state to true
      if (onLoading) onLoading(true);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create one
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create a new user document
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          role: 'USER',
          createdOn: serverTimestamp()
        });
      }
      
      // Google login successful - will be handled by the auth context
    } catch (err) {
      let errorMessage = 'Failed to log in with Google. Please try again.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing the sign-in.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in popup was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked by the browser. Please allow popups for this site.';
      }
      
      if (setError) setError(errorMessage);
      else setLocalError(errorMessage);
    } finally {
      // Set loading state to false
      if (onLoading) onLoading(false);
    }
  };

  return (
    <>
      {localError && <Alert variant="danger">{localError}</Alert>}      <div className="d-grid">
        <Button 
          variant="outline-secondary" 
          onClick={handleGoogleSignIn} 
          className="py-2 position-relative"
          type="button"
          disabled={disabled}
          style={{ 
            borderColor: '#18348B', 
            color: '#18348B',
            backgroundColor: 'white',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#18348B';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#18348B';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
          {buttonText || 'Sign in with Google'}
        </Button>
      </div>
    </>
  );
};

export default GoogleSignIn;
