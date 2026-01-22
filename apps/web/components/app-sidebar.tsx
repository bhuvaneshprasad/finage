import { HomeIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from './ui/sidebar';

const menuItems = [
  {
    title: 'Fund House',
    url: '/fund-house',
    icon: HomeIcon,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {menuItems.map((menuItem) => (
          <SidebarMenuItem key={menuItem.title}>
            <SidebarMenuButton asChild>
              <a href={menuItem.url}>
                <menuItem.icon />
                <span>{menuItem.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
      <SidebarTrigger />
      <SidebarFooter />
    </Sidebar>
  );
}
