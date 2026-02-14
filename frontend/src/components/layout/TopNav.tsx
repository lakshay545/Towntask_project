import { useState } from 'react';
import { useGetCallerUserProfile } from '../../hooks/queries/useCallerContext';
import {
  buildBrowseJobsRoute, buildMyProfileRoute, buildProviderJobsRoute,
  buildMyApplicationsRoute, buildAnalyticsRoute, buildSmartSearchRoute,
  buildEmergencyRoute, buildMyEmergenciesRoute, buildVolunteerRoute, buildFeedbackRoute,
} from '../../router/routes';
import LoginButton from '../auth/LoginButton';
import { Briefcase, User, FileText, Search, Menu, X, BarChart3, AlertTriangle, Shield, Radar, MessageSquare } from 'lucide-react';

export default function TopNav() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isProvider = userProfile?.profileType === 'provider';
  const isWorker = userProfile?.profileType === 'worker';

  const navLinks = [
    { href: buildBrowseJobsRoute(), icon: Search, label: 'Browse Jobs', show: true },
    { href: buildSmartSearchRoute(), icon: Radar, label: 'Smart Search', show: true },
    { href: buildAnalyticsRoute(), icon: BarChart3, label: 'Analytics', show: true },
    { href: buildProviderJobsRoute(), icon: Briefcase, label: 'My Jobs', show: isProvider },
    { href: buildMyApplicationsRoute(), icon: FileText, label: 'My Applications', show: isWorker },
    { href: buildEmergencyRoute(), icon: AlertTriangle, label: 'Emergency', show: true, className: 'text-red-600 hover:text-red-700' },
    { href: buildVolunteerRoute(), icon: Shield, label: 'Volunteer', show: true },
    { href: buildFeedbackRoute(), icon: MessageSquare, label: 'Feedback', show: true },
    { href: buildMyProfileRoute(), icon: User, label: 'Profile', show: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass animate-slide-down">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href={buildBrowseJobsRoute()} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight gradient-text">LocalWork</span>
          </a>
          {!isLoading && userProfile && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.filter(l => l.show).map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/5 ${link.className || 'text-muted-foreground hover:text-foreground'}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LoginButton />
          {!isLoading && userProfile && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && !isLoading && userProfile && (
        <div className="md:hidden border-t animate-slide-down">
          <nav className="container py-3 flex flex-col gap-1">
            {navLinks.filter(l => l.show).map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-primary/5 ${link.className || 'text-muted-foreground hover:text-foreground'}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

