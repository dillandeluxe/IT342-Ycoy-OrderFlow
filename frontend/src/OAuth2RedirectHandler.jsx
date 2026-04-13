import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Grab the user data from the URL parameters
        const urlParams = new URLSearchParams(location.search);
        const email = urlParams.get('email');
        const role = urlParams.get('role');
        const fullName = urlParams.get('fullName');

        if (email) {
            // Save to localStorage just like your regular login does
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', fullName);
            
            // Redirect to the Seller Dashboard
            navigate('/dashboard');
        } else {
            // If it failed, go back to login
            navigate('/login');
        }
    }, [navigate, location]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Logging you in securely with GitHub...</h2>
        </div>
    );
};

export default OAuth2RedirectHandler;