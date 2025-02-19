import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Requests',
    path: '/requests',
    icon: icon('ic_task'),
  },
  {
    title: 'Hierarchy',
    path: '/hierarchy',
    icon: icon('ic_user'),
  },
];

export default navConfig;
