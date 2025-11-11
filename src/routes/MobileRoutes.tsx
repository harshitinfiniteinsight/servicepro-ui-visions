import { Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from "../../mobile-version/src/components/layout/MobileLayout";

// Import mobile pages
import SignIn from "../../mobile-version/src/pages/SignIn";
import SignUp from "../../mobile-version/src/pages/SignUp";
import Index from "../../mobile-version/src/pages/Index";
import Customers from "../../mobile-version/src/pages/Customers";
import CustomerDetails from "../../mobile-version/src/pages/CustomerDetails";
import AddCustomer from "../../mobile-version/src/pages/AddCustomer";
import Jobs from "../../mobile-version/src/pages/Jobs";
import AddJob from "../../mobile-version/src/pages/AddJob";
import JobDetails from "../../mobile-version/src/pages/JobDetails";
import Invoices from "../../mobile-version/src/pages/Invoices";
import AddInvoice from "../../mobile-version/src/pages/AddInvoice";
import InvoiceDueAlert from "../../mobile-version/src/pages/InvoiceDueAlert";
import InvoiceDetails from "../../mobile-version/src/pages/InvoiceDetails";
import Estimates from "../../mobile-version/src/pages/Estimates";
import AddEstimate from "../../mobile-version/src/pages/AddEstimate";
import EstimateDetails from "../../mobile-version/src/pages/EstimateDetails";
import Agreements from "../../mobile-version/src/pages/Agreements";
import AddAgreement from "../../mobile-version/src/pages/AddAgreement";
import AgreementDetails from "../../mobile-version/src/pages/AgreementDetails";
import MinimumDepositPercentage from "../../mobile-version/src/pages/MinimumDepositPercentage";
import Employees from "../../mobile-version/src/pages/Employees";
import EmployeeDetails from "../../mobile-version/src/pages/EmployeeDetails";
import AddEmployee from "../../mobile-version/src/pages/AddEmployee";
import EmployeeSchedule from "../../mobile-version/src/pages/EmployeeSchedule";
import EmployeeTracking from "../../mobile-version/src/pages/EmployeeTracking";
import Inventory from "../../mobile-version/src/pages/Inventory";
import InventoryItemDetails from "../../mobile-version/src/pages/InventoryItemDetails";
import AddInventoryItem from "../../mobile-version/src/pages/AddInventoryItem";
import AddDiscount from "../../mobile-version/src/pages/AddDiscount";
import InventoryStockInOut from "../../mobile-version/src/pages/InventoryStockInOut";
import InventoryRefund from "../../mobile-version/src/pages/InventoryRefund";
import Discounts from "../../mobile-version/src/pages/Discounts";
import LowInventoryAlertSettings from "../../mobile-version/src/pages/LowInventoryAlertSettings";
import ManageAppointments from "../../mobile-version/src/pages/ManageAppointments";
import AddAppointment from "../../mobile-version/src/pages/AddAppointment";
import Reports from "../../mobile-version/src/pages/Reports";
import InvoiceReport from "../../mobile-version/src/pages/InvoiceReport";
import EstimateReport from "../../mobile-version/src/pages/EstimateReport";
import Settings from "../../mobile-version/src/pages/Settings";
import Profile from "../../mobile-version/src/pages/Profile";
import ChangePassword from "../../mobile-version/src/pages/ChangePassword";
import PermissionSettings from "../../mobile-version/src/pages/PermissionSettings";
import ChangeLanguage from "../../mobile-version/src/pages/ChangeLanguage";
import Help from "../../mobile-version/src/pages/Help";
import TermsConditions from "../../mobile-version/src/pages/TermsConditions";
import ReturnPolicy from "../../mobile-version/src/pages/ReturnPolicy";
import BusinessPolicies from "../../mobile-version/src/pages/BusinessPolicies";
import PaymentMethods from "../../mobile-version/src/pages/PaymentMethods";
import Walkthrough from "../../mobile-version/src/pages/Walkthrough";
import NotFound from "../../mobile-version/src/pages/NotFound";

const MobileRoutes = () => {
  return (
    <Routes>
      {/* Auth routes - no layout */}
      <Route path="/mobile/signin" element={<SignIn />} />
      <Route path="/mobile/signup" element={<SignUp />} />
      <Route path="/mobile/walkthrough" element={<Walkthrough />} />
      
      {/* Redirect /mobile to /mobile/ */}
      <Route path="/mobile" element={<Navigate to="/mobile/" replace />} />
      
      {/* Main routes - with mobile layout */}
      <Route path="/mobile/" element={<MobileLayout><Index /></MobileLayout>} />
      <Route path="/mobile/customers" element={<MobileLayout><Customers /></MobileLayout>} />
      <Route path="/mobile/customers/new" element={<MobileLayout><AddCustomer /></MobileLayout>} />
      <Route path="/mobile/customers/:id" element={<MobileLayout><CustomerDetails /></MobileLayout>} />
      <Route path="/mobile/jobs" element={<MobileLayout><Jobs /></MobileLayout>} />
      <Route path="/mobile/jobs/new" element={<MobileLayout><AddJob /></MobileLayout>} />
      <Route path="/mobile/jobs/:id" element={<MobileLayout><JobDetails /></MobileLayout>} />
      <Route path="/mobile/invoices" element={<MobileLayout><Invoices /></MobileLayout>} />
      <Route path="/mobile/invoices/new" element={<MobileLayout><AddInvoice /></MobileLayout>} />
      <Route path="/mobile/invoices/:id" element={<MobileLayout><InvoiceDetails /></MobileLayout>} />
      <Route path="/mobile/invoices/due-alert" element={<MobileLayout><InvoiceDueAlert /></MobileLayout>} />
      <Route path="/mobile/estimates" element={<MobileLayout><Estimates /></MobileLayout>} />
      <Route path="/mobile/estimates/new" element={<MobileLayout><AddEstimate /></MobileLayout>} />
      <Route path="/mobile/estimates/:id" element={<MobileLayout><EstimateDetails /></MobileLayout>} />
      <Route path="/mobile/agreements" element={<MobileLayout><Agreements /></MobileLayout>} />
      <Route path="/mobile/agreements/new" element={<MobileLayout><AddAgreement /></MobileLayout>} />
      <Route path="/mobile/agreements/:id" element={<MobileLayout><AgreementDetails /></MobileLayout>} />
      <Route path="/mobile/agreements/minimum-deposit" element={<MobileLayout><MinimumDepositPercentage /></MobileLayout>} />
      <Route path="/mobile/employees" element={<MobileLayout><Employees /></MobileLayout>} />
      <Route path="/mobile/employees/new" element={<MobileLayout><AddEmployee /></MobileLayout>} />
      <Route path="/mobile/employees/:id" element={<MobileLayout><EmployeeDetails /></MobileLayout>} />
      <Route path="/mobile/employees/schedule" element={<MobileLayout><EmployeeSchedule /></MobileLayout>} />
      <Route path="/mobile/employees/tracking" element={<MobileLayout><EmployeeTracking /></MobileLayout>} />
      <Route path="/mobile/inventory" element={<MobileLayout><Inventory /></MobileLayout>} />
      <Route path="/mobile/inventory/new" element={<MobileLayout><AddInventoryItem /></MobileLayout>} />
      <Route path="/mobile/inventory/:id" element={<MobileLayout><InventoryItemDetails /></MobileLayout>} />
      <Route path="/mobile/inventory/alert-settings" element={<MobileLayout><LowInventoryAlertSettings /></MobileLayout>} />
      <Route path="/mobile/inventory/stock-in-out" element={<MobileLayout><InventoryStockInOut /></MobileLayout>} />
      <Route path="/mobile/inventory/refunds" element={<MobileLayout><InventoryRefund /></MobileLayout>} />
      <Route path="/mobile/inventory/discounts" element={<MobileLayout><Discounts /></MobileLayout>} />
      <Route path="/mobile/inventory/discounts/new" element={<MobileLayout><AddDiscount /></MobileLayout>} />
      <Route path="/mobile/appointments/manage" element={<MobileLayout><ManageAppointments /></MobileLayout>} />
      <Route path="/mobile/appointments/add" element={<MobileLayout><AddAppointment /></MobileLayout>} />
      <Route path="/mobile/reports" element={<MobileLayout><Reports /></MobileLayout>} />
      <Route path="/mobile/reports/invoice" element={<MobileLayout><InvoiceReport /></MobileLayout>} />
      <Route path="/mobile/reports/estimate" element={<MobileLayout><EstimateReport /></MobileLayout>} />
      <Route path="/mobile/settings" element={<MobileLayout><Settings /></MobileLayout>} />
      <Route path="/mobile/settings/profile" element={<MobileLayout><Profile /></MobileLayout>} />
      <Route path="/mobile/settings/change-password" element={<MobileLayout><ChangePassword /></MobileLayout>} />
      <Route path="/mobile/settings/permissions" element={<MobileLayout><PermissionSettings /></MobileLayout>} />
      <Route path="/mobile/settings/terms" element={<MobileLayout><TermsConditions /></MobileLayout>} />
      <Route path="/mobile/settings/return-policy" element={<MobileLayout><ReturnPolicy /></MobileLayout>} />
      <Route path="/mobile/settings/business-policies" element={<MobileLayout><BusinessPolicies /></MobileLayout>} />
      <Route path="/mobile/settings/payment-methods" element={<MobileLayout><PaymentMethods /></MobileLayout>} />
      <Route path="/mobile/settings/language" element={<MobileLayout><ChangeLanguage /></MobileLayout>} />
      <Route path="/mobile/settings/help" element={<MobileLayout><Help /></MobileLayout>} />
      <Route path="/mobile/*" element={<MobileLayout><NotFound /></MobileLayout>} />
    </Routes>
  );
};

export default MobileRoutes;

