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
          variant="outline-danger" 
          onClick={handleGoogleSignIn} 
          className="py-2"
          type="button"
          disabled={disabled}
        >
          <i className="bi bi-google me-2"></i>{buttonText || 'Sign in with Google'}
        </Button>
      </div>
    </>
  );
};

export default GoogleSignIn;
