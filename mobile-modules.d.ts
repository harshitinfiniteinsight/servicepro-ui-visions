// Type declarations for mobile-version modules
// This file helps TypeScript resolve mobile-version's @/ imports when checking from root

// Wildcard declarations for mobile-version modules
declare module '@/components/layout/MobileHeader' {
  const MobileHeader: any;
  export default MobileHeader;
}
declare module '@/components/layout/MobileLayout' {
  const MobileLayout: any;
  export default MobileLayout;
}
declare module '@/components/layout/BottomNav' {
  const BottomNav: any;
  export default BottomNav;
}
declare module '@/components/layout/SalesSubmenu' {
  const SalesSubmenu: any;
  export default SalesSubmenu;
}
declare module '@/components/cards/CustomerCard' {
  const CustomerCard: any;
  export default CustomerCard;
}
declare module '@/components/cards/EmptyState' {
  const EmptyState: any;
  export default EmptyState;
}
declare module '@/components/cards/EstimateCard' {
  const EstimateCard: any;
  export default EstimateCard;
}
declare module '@/components/cards/InvoiceCard' {
  const InvoiceCard: any;
  export default InvoiceCard;
}
declare module '@/components/cards/JobCard' {
  const JobCard: any;
  export default JobCard;
}
declare module '@/components/mobile/MobileCard' {
  const MobileCard: any;
  export default MobileCard;
}
declare module '@/components/mobile/ActionSheet' {
  const ActionSheet: any;
  export default ActionSheet;
}
declare module '@/components/mobile/BottomSheet' {
  const BottomSheet: any;
  export default BottomSheet;
}
declare module '@/components/mobile/MobileList' {
  const MobileList: any;
  export default MobileList;
}
declare module '@/components/mobile/PullToRefresh' {
  const PullToRefresh: any;
  export default PullToRefresh;
}
declare module '@/components/mobile/SwipeableCard' {
  const SwipeableCard: any;
  export default SwipeableCard;
}
declare module '@/data/mobileMockData' {
  export const mockCustomers: any[];
  export const mockEstimates: any[];
  export const mockInvoices: any[];
  export const mockJobs: any[];
  export const mockEmployees: any[];
  export const mockAgreements: any[];
  export const mockDiscounts: any[];
  export const mockInventory: any[];
  export const mockAppointments: any[];
  export const statusColors: any;
}
declare module '@/data/mockData' {
  export const customers: any[];
  export const estimates: any[];
  export const invoices: any[];
  export const jobs: any[];
  export const employees: any[];
}
declare module '@/hooks/use-mobile' {
  export function useMobile(): boolean;
}
declare module '@/hooks/use-tablet' {
  export function useTablet(): boolean;
}
declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
}
