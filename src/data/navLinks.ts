export interface NavLink {
  label: string;
  to: string;
}

export const NAV_LINKS: NavLink[] = [
{ label: 'الرئيسية', to: '/' },
{ label: 'الإعلانات', to: '/equipment' },
{ label: 'أسعار الباقات', to: '/pricing' },
{ label: 'دليل الشركات', to: '/companies' },
{ label: 'عن المنصة', to: '/about' }];
