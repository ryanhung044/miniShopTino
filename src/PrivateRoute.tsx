import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { getRouteParams } from "zmp-sdk/apis";
import nativeStorage from './utils/nativeStorage';
import { API_URL } from './pages/Client/config';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const { ref, app_id  } = getRouteParams();
        if (ref) {
            nativeStorage.setItem('referrer_id', ref);
            console.log('Referrer ID saved:', ref);
        }
        if (app_id) {
            nativeStorage.setItem('app_id', app_id);
            console.log('App ID saved:', app_id);
        }

        const token = nativeStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, []);

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/signup" />;
    }

    // Authenticated
    return children;
};

export default PrivateRoute;
