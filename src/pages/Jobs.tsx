import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { MobileTabletHeader } from "@/components/MobileTabletHeader";
import { useIsTablet } from "@/hooks/use-tablet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  SlidersHorizontal, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  FileText,
  DollarSign,
  User,
  TrendingUp,
  Search,
  ChevronDown,
  MapPin,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle,
  MessageSquare,
  Image,
  Share2,
  Edit,
  UserCheck,
  Send
} from "lucide-react";
import { mockAgreements, mockEstimates, mockInvoices, mockEmployees, mockCustomers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PreviewAgreementModal } from "@/components/modals/PreviewAgreementModal";
import { PreviewEstimateModal } from "@/components/modals/PreviewEstimateModal";
import { PreviewInvoiceModal } from "@/components/modals/PreviewInvoiceModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { AgreementPaymentModal } from "@/components/modals/AgreementPaymentModal";
import { AddServicePicturesModal } from "@/components/modals/AddServicePicturesModal";
import { ServicePicturesModal } from "@/components/modals/ServicePicturesModal";
import { ReassignEmployeeModal } from "@/components/modals/ReassignEmployeeModal";
import { JobStatusDropdown, type JobStatus as JobStatusDropdownType } from "@/components/JobStatusDropdown";

type ViewMode = "list" | "calendar";
type TimeFilter = "day" | "week" | "month";
type JobType = "agreement" | "estimate" | "invoice";

type JobStatus = "Scheduled" | "In Progress" | "Completed" | "Feedback Received" | "Canceled";

interface JobItem {
  id: string;
  orderId: string;
  type: JobType;
  date: string;
  employeeName: string;
  customerName: string;
  amount: number;
  status?: JobStatus;
  paymentStatus?: string;
  address?: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  const isMobileOrTablet = isMobile || isTablet;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterUnpaid, setFilterUnpaid] = useState(false);
  const [previewAgreementModalOpen, setPreviewAgreementModalOpen] = useState(false);
  const [previewEstimateModalOpen, setPreviewEstimateModalOpen] = useState(false);
  const [previewInvoiceModalOpen, setPreviewInvoiceModalOpen] = useState(false);
  const [selectedAgreementForPreview, setSelectedAgreementForPreview] = useState<any>(null);
  const [selectedEstimateForPreview, setSelectedEstimateForPreview] = useState<any>(null);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedItemForPayment, setSelectedItemForPayment] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<"invoice" | "agreement" | null>(null);
  // Track job status updates (optimistic updates)
  const [jobStatuses, setJobStatuses] = useState<Record<string, JobStatus>>({});
  // Track job pictures (mock data - replace with actual API call)
  const [jobPictures, setJobPictures] = useState<Record<string, boolean>>({});
  // Track job images URLs (mock data - replace with actual API call)
  const [jobBeforeImages, setJobBeforeImages] = useState<Record<string, string[]>>({});
  const [jobAfterImages, setJobAfterImages] = useState<Record<string, string[]>>({});
  // Feedback settings (mock - replace with actual settings store)
  const [feedbackSettingsEnabled, setFeedbackSettingsEnabled] = useState<boolean>(false);
  // Add Service Pictures Modal
  const [addPicturesModalOpen, setAddPicturesModalOpen] = useState(false);
  const [selectedJobForPictures, setSelectedJobForPictures] = useState<JobItem | null>(null);
  const [addPicturesInitialTab, setAddPicturesInitialTab] = useState<"before" | "after">("before");
  // View Service Pictures Modal
  const [viewPicturesModalOpen, setViewPicturesModalOpen] = useState(false);
  const [selectedJobForViewPictures, setSelectedJobForViewPictures] = useState<JobItem | null>(null);
  // Reassign Employee Modal
  const [reassignEmployeeModalOpen, setReassignEmployeeModalOpen] = useState(false);
  const [selectedJobForReassign, setSelectedJobForReassign] = useState<JobItem | null>(null);

  // Apply filters from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.dateFrom) {
        setDateFrom(location.state.dateFrom);
      }
      if (location.state.dateTo) {
        setDateTo(location.state.dateTo);
      }
      if (location.state.timeFilter) {
        setTimeFilter(location.state.timeFilter);
      }
      if (location.state.filterUnpaid) {
        setFilterUnpaid(location.state.filterUnpaid);
      }
      // Clear the state to prevent re-applying on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Helper function to derive job status
  const deriveJobStatus = (job: any, type: JobType): JobStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jobDate = new Date(job.date || job.startDate || job.createdDate || job.issueDate);
    jobDate.setHours(0, 0, 0, 0);
    
    // Check payment status
    const isPaid = job.status === "Paid";
    const isOpen = job.status === "Open";
    
    // If paid or completed, mark as Completed
    if (isPaid) {
      return "Completed";
    }
    
    // If date is in the past and not paid, could be In Progress or Completed
    if (jobDate < today) {
      // If it's an estimate that's open, it's Scheduled
      if (type === "estimate" && isOpen) {
        return "Scheduled";
      }
      // Otherwise, it's likely In Progress or Completed based on payment
      return isPaid ? "Completed" : "In Progress";
    }
    
    // If date is today or future, it's Scheduled
    if (jobDate >= today) {
      return "Scheduled";
    }
    
    // Default to Scheduled
    return "Scheduled";
  };

  // Handle job status update
  const handleJobStatusUpdate = async (jobId: string, newStatus: JobStatusDropdownType) => {
    // Optimistically update the UI
    setJobStatuses((prev) => ({
      ...prev,
      [jobId]: newStatus as JobStatus,
    }));

    // TODO: Replace with actual API call
    // Example API call pattern:
    // try {
    //   await updateJobStatus(jobId, newStatus);
    //   // Optionally refresh data or show success toast
    // } catch (error) {
    //   // Revert optimistic update on error
    //   setJobStatuses((prev) => {
    //     const updated = { ...prev };
    //     delete updated[jobId];
    //     return updated;
    //   });
    //   console.error('Failed to update job status:', error);
    // }
  };

  // Menu action handlers
  const handleEdit = (job: JobItem) => {
    // Navigate to edit page based on job type
    if (job.type === "estimate") {
      navigate(`/estimates/${job.id}/edit`);
    } else if (job.type === "invoice") {
      navigate(`/invoices/${job.id}/edit`);
    } else if (job.type === "agreement") {
      navigate(`/agreements/${job.id}/edit`);
    }
  };

  const handleReassignEmployee = (job: JobItem) => {
    setSelectedJobForReassign(job);
    setReassignEmployeeModalOpen(true);
  };

  const handleReassignSave = async (newEmployeeId: string) => {
    if (!selectedJobForReassign) return;

    // TODO: Replace with actual API call
    // Example API call pattern:
    // try {
    //   await reassignJobEmployee(selectedJobForReassign.id, newEmployeeId);
    //   // Optionally refresh job data or update local state
    // } catch (error) {
    //   console.error('Failed to reassign employee:', error);
    //   throw error;
    // }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local state if needed (this would typically come from API response)
    // For now, we'll just close the modal and show success toast
  };

  const handleShare = (job: JobItem) => {
    // TODO: Implement share functionality
    // Could open a share modal or use Web Share API
    console.log("Share job:", job.id);
    if (navigator.share) {
      navigator.share({
        title: `Job ${job.orderId}`,
        text: `Job details for ${job.customerName}`,
      }).catch(console.error);
    }
  };

  const handleShowOnMap = (job: JobItem) => {
    // Check if address is available
    if (!job.address || job.address.trim() === "") {
      toast.error("Location not available.");
      return;
    }

    // Build Google Maps URL
    const encodedAddress = encodeURIComponent(job.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // Open in new tab
    window.open(mapsUrl, "_blank");
  };

  const handleAddPictures = (job: JobItem) => {
    setSelectedJobForPictures(job);
    setAddPicturesModalOpen(true);
  };

  const handleSavePictures = async (beforeImages: File[], afterImages: File[]) => {
    if (!selectedJobForPictures) return;

    // TODO: Replace with actual API call
    // Example API call pattern:
    // try {
    //   const formData = new FormData();
    //   beforeImages.forEach((file, index) => {
    //     formData.append(`before_${index}`, file);
    //   });
    //   afterImages.forEach((file, index) => {
    //     formData.append(`after_${index}`, file);
    //   });
    //   const response = await uploadServicePictures(selectedJobForPictures.id, formData);
    //   setJobBeforeImages((prev) => ({ ...prev, [selectedJobForPictures.id]: response.beforeUrls }));
    //   setJobAfterImages((prev) => ({ ...prev, [selectedJobForPictures.id]: response.afterUrls }));
    //   setJobPictures((prev) => ({ ...prev, [selectedJobForPictures.id]: true }));
    // } catch (error) {
    //   console.error('Failed to upload pictures:', error);
    //   throw error;
    // }

    // Simulate API call - convert files to data URLs for preview
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const beforeUrls: string[] = [];
    const afterUrls: string[] = [];

    // Convert files to data URLs for display
    for (const file of beforeImages) {
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      beforeUrls.push(url);
    }

    for (const file of afterImages) {
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      afterUrls.push(url);
    }
    
    // Update job state so "View Pictures" becomes available
    setJobBeforeImages((prev) => ({
      ...prev,
      [selectedJobForPictures.id]: beforeUrls,
    }));
    setJobAfterImages((prev) => ({
      ...prev,
      [selectedJobForPictures.id]: afterUrls,
    }));
    setJobPictures((prev) => ({ ...prev, [selectedJobForPictures.id]: true }));
  };

  const handleViewPictures = (job: JobItem) => {
    setSelectedJobForViewPictures(job);
    setViewPicturesModalOpen(true);
  };

  const handleReplacePictures = (type: "before" | "after") => {
    if (!selectedJobForViewPictures) return;
    
    // Close view modal and open add modal with focused tab
    setViewPicturesModalOpen(false);
    setSelectedJobForPictures(selectedJobForViewPictures);
    setAddPicturesInitialTab(type);
    setAddPicturesModalOpen(true);
  };

  const handleDeletePictures = async (type: "before" | "after") => {
    if (!selectedJobForViewPictures) return;

    // TODO: Replace with actual API call
    // try {
    //   await deleteServicePictures(selectedJobForViewPictures.id, type);
    // } catch (error) {
    //   console.error('Failed to delete pictures:', error);
    //   throw error;
    // }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update state
    if (type === "before") {
      setJobBeforeImages((prev) => {
        const updated = { ...prev };
        delete updated[selectedJobForViewPictures.id];
        return updated;
      });
    } else {
      setJobAfterImages((prev) => {
        const updated = { ...prev };
        delete updated[selectedJobForViewPictures.id];
        return updated;
      });
    }

    // Check if both are empty, then remove from jobPictures
    const beforeImages = jobBeforeImages[selectedJobForViewPictures.id] || [];
    const afterImages = jobAfterImages[selectedJobForViewPictures.id] || [];
    
    if (type === "before") {
      if (afterImages.length === 0) {
        setJobPictures((prev) => {
          const updated = { ...prev };
          delete updated[selectedJobForViewPictures.id];
          return updated;
        });
      }
    } else {
      if (beforeImages.length === 0) {
        setJobPictures((prev) => {
          const updated = { ...prev };
          delete updated[selectedJobForViewPictures.id];
          return updated;
        });
      }
    }
  };

  // handleViewPictures is already defined above

  const handleSendFeedbackForm = (job: JobItem) => {
    // TODO: Send feedback form
    console.log("Send feedback form for job:", job.id);
  };

  // Generate menu items based on job status
  const getJobMenuItems = (job: JobItem) => {
    const status = job.status || "Scheduled";
    const hasPictures = jobPictures[job.id] || false;
    const items: Array<{
      label: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      onClick: () => void;
    }> = [];

    if (status === "Scheduled") {
      items.push(
        { label: "Preview", icon: Eye, onClick: () => handlePreview(job) },
        { label: "Edit", icon: Edit, onClick: () => handleEdit(job) },
        { label: "Reassign Employee", icon: UserCheck, onClick: () => handleReassignEmployee(job) },
        { label: "Share", icon: Share2, onClick: () => handleShare(job) },
        { label: "Show on Map", icon: MapPin, onClick: () => handleShowOnMap(job) },
        { label: "Add Pictures", icon: Image, onClick: () => handleAddPictures(job) }
      );
      if (hasPictures) {
        items.push({ label: "View Pictures", icon: Image, onClick: () => handleViewPictures(job) });
      }
    } else if (status === "In Progress") {
      items.push(
        { label: "Preview", icon: Eye, onClick: () => handlePreview(job) },
        { label: "Share", icon: Share2, onClick: () => handleShare(job) },
        { label: "Show on Map", icon: MapPin, onClick: () => handleShowOnMap(job) },
        { label: "Add Pictures", icon: Image, onClick: () => handleAddPictures(job) }
      );
      if (hasPictures) {
        items.push({ label: "View Pictures", icon: Image, onClick: () => handleViewPictures(job) });
      }
    } else if (status === "Completed") {
      items.push(
        { label: "Preview", icon: Eye, onClick: () => handlePreview(job) },
        { label: "Share", icon: Share2, onClick: () => handleShare(job) },
        { label: "Show on Map", icon: MapPin, onClick: () => handleShowOnMap(job) },
        { label: "Add Pictures", icon: Image, onClick: () => handleAddPictures(job) }
      );
      if (hasPictures) {
        items.push({ label: "View Pictures", icon: Image, onClick: () => handleViewPictures(job) });
      }
      // Only show Send Feedback Form if feedback settings are OFF
      if (!feedbackSettingsEnabled) {
        items.push({ label: "Send Feedback Form", icon: Send, onClick: () => handleSendFeedbackForm(job) });
      }
    } else if (status === "Canceled") {
      items.push(
        { label: "Preview", icon: Eye, onClick: () => handlePreview(job) }
      );
    }

    return items;
  };

  // Transform data into unified format
  const allJobs: JobItem[] = [
    ...mockAgreements.map((agreement) => ({
      id: agreement.id,
      orderId: agreement.id.replace("AGR-", "G"),
      type: "agreement" as JobType,
      date: agreement.startDate,
      employeeName: "N/A",
      customerName: agreement.customerName,
      amount: agreement.amount,
      status: jobStatuses[agreement.id] || deriveJobStatus(agreement, "agreement"),
      paymentStatus: agreement.status,
      address: (agreement as any).jobAddress || (agreement as any).address || "",
    })),
    ...mockEstimates.map((estimate) => ({
      id: estimate.id,
      orderId: estimate.id.replace("EST-", ""),
      type: "estimate" as JobType,
      date: estimate.createdDate,
      employeeName: estimate.employeeName,
      customerName: estimate.customerName,
      amount: estimate.amount,
      status: jobStatuses[estimate.id] || deriveJobStatus(estimate, "estimate"),
      paymentStatus: estimate.status,
      address: estimate.jobAddress || "",
    })),
    ...mockInvoices.map((invoice) => ({
      id: invoice.id,
      orderId: invoice.orderId,
      type: "invoice" as JobType,
      date: invoice.issueDate,
      employeeName: invoice.employeeName,
      customerName: invoice.customerName,
      amount: invoice.amount,
      status: jobStatuses[invoice.id] || deriveJobStatus(invoice, "invoice"),
      paymentStatus: invoice.status,
      address: (invoice as any).jobAddress || (invoice as any).address || "",
    })),
  ];

  // Filter and sort jobs
  const filteredJobs = allJobs
    .filter((job) => {
      const matchesSearch =
        job.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter unpaid jobs if filterUnpaid is true
      if (filterUnpaid) {
        const jobInvoice = mockInvoices.find(inv => inv.id === job.id);
        const jobEstimate = mockEstimates.find(est => est.id === job.id);
        const jobAgreement = mockAgreements.find(agr => agr.id === job.id);
        
        // Check if job is unpaid
        const isUnpaid = 
          (jobInvoice && jobInvoice.status !== "Paid") ||
          (jobEstimate && jobEstimate.status === "Open") ||
          (jobAgreement && jobAgreement.status !== "Paid");
        
        if (!isUnpaid) return false;
      }
      
      const matchesEmployee = selectedEmployee === "all" || job.employeeName === selectedEmployee;
      const matchesJobType = selectedJobType === "all" || job.type === selectedJobType;
      const matchesCustomer = selectedCustomer === "all" || job.customerName === selectedCustomer;
      const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
      const matchesPayment = selectedPayment === "all" || 
        (selectedPayment === "paid" && job.paymentStatus === "Paid") ||
        (selectedPayment === "open" && job.paymentStatus === "Open");
      
      const jobDate = new Date(job.date);
      const matchesDateFrom = !dateFrom || jobDate >= dateFrom;
      const matchesDateTo = !dateTo || jobDate <= dateTo;
      
      return matchesSearch && matchesEmployee && matchesJobType && matchesCustomer && matchesStatus && matchesPayment && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group jobs by date
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const date = new Date(job.date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(job);
    return acc;
  }, {} as Record<string, JobItem[]>);

  const getJobConfig = (type: JobType) => {
    switch (type) {
      case "agreement":
        return {
          gradient: "from-info/10 to-info/5",
          border: "border-info/20",
          badge: "bg-info/10 text-info border-info/20",
          icon: Briefcase,
          iconBg: "bg-info/10",
          iconColor: "text-info",
          label: "Agreement",
          amountColor: "text-info"
        };
      case "invoice":
        return {
          gradient: "from-warning/10 to-warning/5",
          border: "border-warning/20",
          badge: "bg-warning/10 text-warning border-warning/20",
          icon: DollarSign,
          iconBg: "bg-warning/10",
          iconColor: "text-warning",
          label: "Invoice",
          amountColor: "text-warning"
        };
      case "estimate":
        return {
          gradient: "from-success/10 to-success/5",
          border: "border-success/20",
          badge: "bg-success/10 text-success border-success/20",
          icon: FileText,
          iconBg: "bg-success/10",
          iconColor: "text-success",
          label: "Estimate",
          amountColor: "text-success"
        };
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status?: JobStatus) => {
    switch (status) {
      case "Scheduled":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "In Progress":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "Canceled":
        return "bg-red-50 text-red-600 border-red-200";
      case "Feedback Received":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfMonth = monthStart.getDay();
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(daysInMonth);
  
  const getJobsForDate = (date: Date) => {
    return filteredJobs.filter((job) => isSameDay(new Date(job.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Handle preview based on job type
  const handlePreview = (job: JobItem) => {
    if (job.type === "agreement") {
      const agreement = mockAgreements.find(agr => agr.id === job.id);
      if (agreement) {
        setSelectedAgreementForPreview(agreement);
        setPreviewAgreementModalOpen(true);
      }
    } else if (job.type === "estimate") {
      const estimate = mockEstimates.find(est => est.id === job.id);
      if (estimate) {
        setSelectedEstimateForPreview(estimate);
        setPreviewEstimateModalOpen(true);
      }
    } else if (job.type === "invoice") {
      const invoice = mockInvoices.find(inv => inv.id === job.id);
      if (invoice) {
        setSelectedInvoiceForPreview(invoice);
        setPreviewInvoiceModalOpen(true);
      }
    }
  };

  // Calculate stats
  const totalJobs = filteredJobs.length;
  const totalRevenue = filteredJobs.reduce((sum, job) => sum + job.amount, 0);
  const jobsByType = {
    agreement: filteredJobs.filter(j => j.type === "agreement").length,
    invoice: filteredJobs.filter(j => j.type === "invoice").length,
    estimate: filteredJobs.filter(j => j.type === "estimate").length,
  };
  
  // Calculate status summary for tablet/mobile (5 metrics)
  const statusSummary = {
    scheduled: filteredJobs.filter(j => j.status === "Scheduled").length,
    inProgress: filteredJobs.filter(j => j.status === "In Progress").length,
    completed: filteredJobs.filter(j => j.status === "Completed").length,
    canceled: filteredJobs.filter(j => j.status === "Canceled").length,
    feedback: filteredJobs.filter(j => j.status === "Feedback Received").length,
  };

  return (
    <div className="flex-1">
      {/* Header - Conditional rendering for tablet/mobile vs desktop */}
      {isMobileOrTablet ? (
        <MobileTabletHeader title="Jobs" showBack={true} />
      ) : (
        <AppHeader searchPlaceholder="Search jobs..." onSearchChange={setSearchQuery} title="Job Dashboard" />
      )}

      <main className={cn(
        "space-y-4 sm:space-y-6 animate-fade-in overflow-y-auto",
        isMobileOrTablet ? "pt-20 pb-24 px-4" : "px-4 sm:px-6 py-4 sm:py-6"
      )}>
        {/* Tablet/Mobile Layout */}
        {isMobileOrTablet ? (
          <>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input 
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-11 h-10 sm:h-11"
              />
              </div>

            {/* Status Summary Cards - 3 Metrics (Matching Mobile View) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
                <p className="text-xl sm:text-2xl font-bold">{statusSummary.scheduled}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-warning/5 border border-warning/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold">{statusSummary.inProgress}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-success/5 border border-success/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">Completed</p>
                <p className="text-xl sm:text-2xl font-bold">{statusSummary.completed}</p>
              </div>
            </div>

            {/* Filters Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border border-border rounded-full sm:rounded-xl bg-card shadow-sm overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline rounded-full sm:rounded-none">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span className="font-medium">Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                  {/* Date Range - Full Width Row */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium mb-2 block">Select Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start touch-target">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="truncate">{dateFrom ? format(dateFrom, "MM/dd/yyyy") : "From"}</span>
                </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start touch-target">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="truncate">{dateTo ? format(dateTo, "MM/dd/yyyy") : "To"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                        </PopoverContent>
                      </Popover>
              </div>
            </div>

                  {/* Employee */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Employee</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="touch-target">
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {mockEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.name}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
          </div>

                  {/* Job Type */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Job Type</Label>
                    <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                      <SelectTrigger className="touch-target">
                        <SelectValue placeholder="All Jobs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        <SelectItem value="invoice">Invoices</SelectItem>
                        <SelectItem value="estimate">Estimates</SelectItem>
                        <SelectItem value="agreement">Agreements</SelectItem>
                      </SelectContent>
                    </Select>
        </div>

                  {/* Job Status */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Job Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="touch-target">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Feedback Received">Feedback Received</SelectItem>
                        <SelectItem value="Canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Payment Status</Label>
                    <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                      <SelectTrigger className="touch-target">
                        <SelectValue placeholder="All Payments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payments</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <>
            {/* Desktop Layout - Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search jobs by customer name, job ID, or employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Job Status Metrics - 5 Cards */}
            <div className="grid grid-cols-5 gap-4">
          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                    <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scheduled</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{statusSummary.scheduled}</p>
              </div>

              <div className="app-card p-4 card-shine">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 shadow-sm">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">In Progress</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{statusSummary.inProgress}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-success/10 to-success/5 shadow-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{statusSummary.completed}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 shadow-sm">
                    <XCircle className="h-4 w-4 text-destructive" />
              </div>
            </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Canceled</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{statusSummary.canceled}</p>
          </div>

          <div className="app-card p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-info/10 to-info/5 shadow-sm">
                    <MessageSquare className="h-4 w-4 text-info" />
              </div>
            </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Feedback Received</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{statusSummary.feedback}</p>
          </div>
        </div>

            {/* Filters Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border border-border rounded-xl bg-card shadow-sm">
                <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
                  <Label className="text-sm font-medium mb-2 block">Date Range (From)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start touch-target">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{dateFrom ? format(dateFrom, "MM/dd/yyyy") : "From"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
                  <Label className="text-sm font-medium mb-2 block">Date Range (To)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start touch-target">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{dateTo ? format(dateTo, "MM/dd/yyyy") : "To"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                </PopoverContent>
              </Popover>
            </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="All Employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.name}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Job Type</Label>
              <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                <SelectTrigger className="touch-target">
                      <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="estimate">Estimates</SelectItem>
                  <SelectItem value="agreement">Agreements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
                  <Label className="text-sm font-medium mb-2 block">Job Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="touch-target">
                      <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                      <SelectItem value="Feedback Received">Feedback Received</SelectItem>
                </SelectContent>
              </Select>
                </div>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
                  <Label className="text-sm font-medium mb-2 block">Payment Status</Label>
                  <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                <SelectTrigger className="touch-target">
                      <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}

        {/* Jobs List - Shared for tablet/mobile and desktop */}
        {viewMode === "list" && (
          <div>
            {isMobileOrTablet ? (
              // Mobile/Tablet: Grouped by date
          <div className="space-y-6">
            {Object.entries(groupedJobs).map(([date, jobs]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{date}</span>
                </div>

                {/* Jobs for this date */}
                <div className="grid gap-3">
                  {jobs.map((job) => {
                    const config = getJobConfig(job.type);
                    const JobIcon = config.icon;
                        const employeeInitials = job.employeeName !== "N/A" 
                          ? job.employeeName.split(" ").map(n => n[0]).join("").toUpperCase()
                          : "N/A";
                    
                    return (
                          // Mobile/Tablet Style Job Card
                      <div
                        key={job.id}
                            className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
                            onClick={() => handlePreview(job)}
                          >
                            {/* Top Row: ID (Left) | Status + Menu (Right) */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-lg text-foreground">{job.orderId}</span>
                              <div className="flex items-center gap-2">
                                {job.status && (
                                  <JobStatusDropdown
                                    status={job.status as JobStatusDropdownType}
                                    onChange={(newStatus) => handleJobStatusUpdate(job.id, newStatus)}
                                  />
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-52" onClick={(e) => e.stopPropagation()}>
                                    {getJobMenuItems(job).map((item, index) => {
                                      const Icon = item.icon;
                                      return (
                                        <DropdownMenuItem
                                          key={index}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            item.onClick();
                                          }}
                                          className="gap-2 cursor-pointer"
                                        >
                                          <Icon className="h-4 w-4" />
                                          {item.label}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Second Row: Customer Name (Left) | Payment Status + Job Type (Right) */}
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-base font-semibold text-foreground flex-1 min-w-0 pr-2">{job.customerName}</p>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant="outline" className={cn("text-xs border", job.paymentStatus === "Paid" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20")}>
                                  {job.paymentStatus || "Open"}
                                </Badge>
                                <Badge variant="outline" className={cn("text-xs border", config.badge)}>
                                  {config.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Bottom Row: Creation Date (Left) | Employee Name (Right) */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{new Date(job.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                  <span className="text-xs font-bold text-primary">{employeeInitials}</span>
                                </div>
                                <span className="text-sm text-muted-foreground truncate max-w-[100px]">{job.employeeName}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop: Grid layout
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredJobs.map((job) => {
                  const config = getJobConfig(job.type);
                  const employeeInitials = job.employeeName !== "N/A" 
                    ? job.employeeName.split(" ").map(n => n[0]).join("").toUpperCase()
                    : "N/A";
                  const paymentStatusBadge = job.paymentStatus === "Paid" 
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20";
                  
                  return (
                    <Card
                      key={job.id}
                      className="p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/30"
                      onClick={() => handlePreview(job)}
                    >
                      {/* Top Row: ID (Left) | Status + Menu (Right) */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-lg text-foreground">{job.orderId}</span>
                        <div className="flex items-center gap-2">
                          {job.status && (
                            <JobStatusDropdown
                              status={job.status as JobStatusDropdownType}
                              onChange={(newStatus) => handleJobStatusUpdate(job.id, newStatus)}
                            />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52" onClick={(e) => e.stopPropagation()}>
                              {getJobMenuItems(job).map((item, index) => {
                                const Icon = item.icon;
                                return (
                                  <DropdownMenuItem
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      item.onClick();
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Second Row: Customer Name (Left) | Payment Status + Job Type (Right) */}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-base font-semibold text-foreground flex-1 min-w-0 pr-2">{job.customerName}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className={cn("text-xs border", paymentStatusBadge)}>
                            {job.paymentStatus || "Open"}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs border", config.badge)}>
                            {config.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Bottom Row: Creation Date (Left) | Employee Name (Right) */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(job.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-xs font-bold text-primary">{employeeInitials}</span>
                          </div>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">{job.employeeName}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                          </div>
            )}

            {filteredJobs.length === 0 && (
              <div className="app-card p-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No jobs found matching your filters</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or date range</p>
              </div>
            )}
          </div>
        )}

        {/* Calendar View - Desktop only */}
        {!isMobileOrTablet && viewMode === "calendar" && (
          <div className="app-card p-4 sm:p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient">
                {format(currentMonth, "MMMM, yyyy")}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-bold text-sm text-muted-foreground py-3">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayJobs = getJobsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square border-2 rounded-xl p-2 relative transition-all hover:scale-105 cursor-pointer",
                      isCurrentMonth ? "bg-card border-border hover:border-primary/30" : "bg-muted/20 border-transparent",
                      isToday && "bg-gradient-to-br from-primary to-accent text-white font-bold border-primary shadow-lg"
                    )}
                  >
                    <div className={cn("text-sm sm:text-base text-center mb-1 font-semibold", isToday && "text-white")}>
                      {format(day, "d")}
                    </div>
                    {dayJobs.length > 0 && (
                      <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center flex-wrap">
                        {dayJobs.slice(0, 3).map((job) => {
                          const config = getJobConfig(job.type);
                          return (
                            <div
                              key={job.id}
                              className={cn("w-2 h-2 rounded-full", config.iconColor.replace('text-', 'bg-'))}
                            />
                          );
                        })}
                        {dayJobs.length > 3 && (
                          <span className="text-[10px] font-bold">+{dayJobs.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modals */}
      <PreviewAgreementModal
        open={previewAgreementModalOpen}
        onOpenChange={(open) => {
          setPreviewAgreementModalOpen(open);
          if (!open) setSelectedAgreementForPreview(null);
        }}
        agreement={selectedAgreementForPreview}
        onPayNow={(agreement) => {
          setSelectedItemForPayment(agreement);
          setPaymentType("agreement");
          setPaymentModalOpen(true);
        }}
        onUpdate={(agreement) => {
          navigate(`/agreements/${agreement.id}/edit`);
        }}
      />

      <PreviewEstimateModal
        open={previewEstimateModalOpen}
        onOpenChange={(open) => {
          setPreviewEstimateModalOpen(open);
          if (!open) setSelectedEstimateForPreview(null);
        }}
        estimate={selectedEstimateForPreview}
        onEdit={(estimate) => {
          navigate(`/estimates/${estimate.id}/edit`);
        }}
        onPayNow={(estimate) => {
          setSelectedItemForPayment(estimate);
          setPaymentType("invoice");
          setPaymentModalOpen(true);
        }}
      />

      <PreviewInvoiceModal
        open={previewInvoiceModalOpen}
        onOpenChange={(open) => {
          setPreviewInvoiceModalOpen(open);
          if (!open) setSelectedInvoiceForPreview(null);
        }}
        invoice={selectedInvoiceForPreview}
        onEdit={(invoice) => {
          navigate(`/invoices/${invoice.id}/edit`);
        }}
        onPayNow={(invoice) => {
          setSelectedItemForPayment(invoice);
          setPaymentType("invoice");
          setPaymentModalOpen(true);
        }}
      />

      {/* Payment Modals */}
      {paymentType === "invoice" && (
        <InvoicePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoice={selectedItemForPayment}
        />
      )}
      {paymentType === "agreement" && (
        <AgreementPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          agreement={selectedItemForPayment}
        />
      )}

      <AddServicePicturesModal
        open={addPicturesModalOpen}
        onOpenChange={(open) => {
          setAddPicturesModalOpen(open);
          if (!open) {
            setSelectedJobForPictures(null);
            setAddPicturesInitialTab("before");
          }
        }}
        jobId={selectedJobForPictures?.id || ""}
        jobOrderId={selectedJobForPictures?.orderId}
        initialTab={addPicturesInitialTab}
        onSave={handleSavePictures}
      />

      <ServicePicturesModal
        open={viewPicturesModalOpen}
        onOpenChange={(open) => {
          setViewPicturesModalOpen(open);
          if (!open) setSelectedJobForViewPictures(null);
        }}
        jobId={selectedJobForViewPictures?.id || ""}
        jobOrderId={selectedJobForViewPictures?.orderId}
        beforeImages={selectedJobForViewPictures ? jobBeforeImages[selectedJobForViewPictures.id] || [] : []}
        afterImages={selectedJobForViewPictures ? jobAfterImages[selectedJobForViewPictures.id] || [] : []}
        onReplace={handleReplacePictures}
        onDelete={handleDeletePictures}
      />

      <ReassignEmployeeModal
        open={reassignEmployeeModalOpen}
        onOpenChange={(open) => {
          setReassignEmployeeModalOpen(open);
          if (!open) setSelectedJobForReassign(null);
        }}
        jobId={selectedJobForReassign?.id || ""}
        jobOrderId={selectedJobForReassign?.orderId}
        currentEmployeeId={
          selectedJobForReassign
            ? mockEmployees.find((emp) => emp.name === selectedJobForReassign.employeeName)?.id || ""
            : ""
        }
        employeesList={mockEmployees}
        onSave={handleReassignSave}
      />
    </div>
  );
};

export default Jobs;
