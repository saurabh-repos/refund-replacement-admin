// eslint-disable-next-line perfectionist/sort-imports
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import Hierarchy from 'src/pages/hierarchy';
import FormsPage from 'src/pages/requests';
import { UsersView } from 'src/sections/users/view';
import { MasterView } from 'src/sections/master/view';

export const IndexPage = lazy(() => import('src/pages/app'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const TicketPage = lazy(() => import('src/pages/requests'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const isLoggedIn = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const isSAdmin = user?.userType === 'SUPER_ADMIN';

  const AdminRoute = ({ children }) => {
    return isSAdmin ? children : <Navigate to="/" replace />;
  };

  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? (
        <DashboardLayout>
          <Suspense>
            <ToastContainer />
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'requests', element: <FormsPage /> },
        { path: 'hierarchy', element: <Hierarchy /> },
        ...(isSAdmin
          ? [
              {
                path: 'admins',
                element: (
                  <AdminRoute>
                    <UsersView />
                  </AdminRoute>
                ),
              },
              {
                path: '/master',
                element: (
                  <AdminRoute>
                    <MasterView />
                  </AdminRoute>
                ),
              },
            ]
          : []),
      ],
    },
    {
      path: '/login',
      element: isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
