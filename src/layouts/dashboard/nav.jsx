/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import { alpha } from '@mui/material/styles';

import { usePathname, useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import Logo from '../../../public/assets/eureka-forbes-logo.png';
import EurekaForbes from '../../../public/assets/eurekafobesimage2.png';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav, collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const upLg = useResponsive('up', 'lg');

  const [config, setConfig] = useState(navConfig);

  useEffect(() => {
    // Check if the user is a Super Admin and update the navConfig
    const user = JSON.parse(localStorage.getItem('user'));
    const isSAdmin = user?.userType === 'SUPER_ADMIN';
    const icon = (name) => (
      <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
    );

    const updatedNavConfig = isSAdmin
      ? [
          ...navConfig,
          {
            title: 'Admins',
            path: '/admins',
            icon: icon('ic_lock'),
          },
        ]
      : navConfig;

    setConfig(updatedNavConfig); // Update the navConfig state based on user role
  }, []); // Only run once when component mounts


  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev); // Toggle collapsed state
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: collapsed ? 1 : 2, mt: 3 }}>
      {config.map((item) => (
        <NavItem key={item.title} item={item} collapsed={collapsed} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: collapsed ? 'hidden' : 'auto', // Hide scrollbar when collapsed
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {collapsed ? (
        <img
          src={EurekaForbes}
          alt="Eurekforbes"
          style={{
            width: '64%',
            marginTop: '32px',
            marginLeft: '10px',
            marginBottom: '9px',
            cursor: 'pointer',
          }}
          onClick={() => {
            router.push('/');
          }}
        />
      ) : (
        <img
          src={Logo}
          alt="Description of your image"
          style={{
            width: '60%',
            marginTop: '20px',
            marginLeft: '25px',
            cursor: 'pointer',
          }}
          onClick={() => {
            router.push('/');
          }}
        />
      )}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: collapsed ? 0 : 30,
          right: 0,
          textAlign: 'left',
        }}
      >
        <button
          onClick={toggleCollapsed}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {collapsed ? (
            <TbLayoutSidebarRightCollapse
              style={{ width: '40%', height: '60px', color: '#333333' }}
            />
          ) : (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#333333',
                gap: '6px',
                fontSize: '15px',
              }}
            >
              <TbLayoutSidebarLeftCollapse style={{ width: '24%', height: '40px' }} /> Collapse
            </span>
          )}
        </button>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: collapsed ? 60 : NAV.WIDTH }, // Adjust width when collapsed
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: collapsed ? 80 : NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: collapsed ? 60 : NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item, collapsed }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: collapsed ? 0 : 2 }}>
        {item.icon}
      </Box>
      {!collapsed && <Box component="span">{item.title}</Box>}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  collapsed: PropTypes.bool,
};
