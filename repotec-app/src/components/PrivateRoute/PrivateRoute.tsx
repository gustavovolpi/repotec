import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Layout from '../Layout/Layout';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = authService.isAuthenticated();
        // console.log('[PrivateRoute] isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
            console.error('Não autenticado');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
        return null;
    }

    return <Layout>{children}</Layout>;
};

export default PrivateRoute;
