'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarLinks() {
  const pathname = usePathname();

  const links = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      ),
      exact: true
    },
    {
      name: 'Inquiries',
      href: '/admin/dashboard/inquiries',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      ),
      exact: false
    },
    {
      name: 'Product Catalog',
      href: '/admin/dashboard/catalog',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      ),
      exact: false
    },
    {
      name: 'Offers & Campaigns',
      href: '/admin/dashboard/offers',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
      ),
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (href === '#') return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col gap-1">
      {links.map((link) => {
        const active = isActive(link.href, link.exact);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`px-4 py-2.5 text-sm font-medium rounded-sm border-l-2 transition-all flex items-center gap-3 ${
              active
                ? 'bg-[#f9f5f6] text-[#3a081a] border-[#3a081a]'
                : 'text-gray-600 hover:bg-gray-50 border-transparent'
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
