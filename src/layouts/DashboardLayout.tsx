
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileUpload,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Data Upload', href: '/dashboard/upload', icon: FileUpload },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-brand-darkBlue flex flex-col">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card">
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-2 text-xl font-bold text-gradient">AdPulse</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-white opacity-75">
            {currentUser?.email?.split('@')[0]}
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 h-16">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-gradient">AdPulse</h1>
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-white"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 px-2 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-brand-green"
                          : "text-white hover:bg-primary/5 hover:text-brand-green"
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-brand-green">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {currentUser?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-white/60">
                  {userProfile?.role || 'User'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-3 w-full justify-start text-white hover:bg-primary/5 hover:text-brand-red"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
