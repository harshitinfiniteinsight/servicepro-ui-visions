import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { User, Lock, Shield, Globe, HelpCircle, FileText, CreditCard, Building2, Bell, ChevronRight, ClipboardList, Users, Package, BarChart3, Briefcase, Calendar, FileText as FileTextIcon, TrendingUp } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const operationalModules = [
    {
      title: "Operations",
      items: [
        { icon: Users, label: "Customers", route: "/customers" },
        { icon: FileTextIcon, label: "Invoices", route: "/invoices" },
        { icon: TrendingUp, label: "Estimates", route: "/estimates" },
        { icon: Briefcase, label: "Jobs", route: "/jobs" },
        { icon: Calendar, label: "Appointments", route: "/appointments/manage" },
        { icon: ClipboardList, label: "Agreements", route: "/agreements" },
        { icon: Users, label: "Employees", route: "/employees" },
        { icon: Package, label: "Inventory", route: "/inventory" },
        { icon: BarChart3, label: "Reports", route: "/reports" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", route: "/settings/profile" },
        { icon: Lock, label: "Change Password", route: "/settings/change-password" },
      ],
    },
    {
      title: "Business",
      items: [
        { icon: Building2, label: "Business Policies", route: "/settings/business-policies" },
        { icon: CreditCard, label: "Payment Methods", route: "/settings/payment-methods" },
        { icon: FileText, label: "Terms & Conditions", route: "/settings/terms" },
        { icon: FileText, label: "Return Policy", route: "/settings/return-policy" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Globe, label: "Change Language", route: "/settings/language" },
        { icon: Shield, label: "Permissions", route: "/settings/permissions" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help", route: "/settings/help" },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Settings" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {operationalModules.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <div className="px-4 py-2 bg-muted/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                {section.title}
              </h3>
            </div>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.route)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent/5 active:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
