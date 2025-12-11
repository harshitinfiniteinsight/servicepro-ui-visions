import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, PlusCircle, FileText, Calendar as CalendarIcon, Eye, Mail, MessageSquare, Edit, DollarSign, Wallet, CalendarRange, Percent, Search, MoreVertical, Briefcase } from "lucide-react";
import { mockAgreements } from "@/data/mockData";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { PayCashModal } from "@/components/modals/PayCashModal";
import { LinkModulesModal } from "@/components/modals/LinkModulesModal";
import { AgreementSignModal } from "@/components/modals/AgreementSignModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { AgreementPaymentModal } from "@/components/modals/AgreementPaymentModal";
import { PreviewAgreementModal } from "@/components/modals/PreviewAgreementModal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Agreements = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [sendSMSOpen, setSendSMSOpen] = useState(false);
  const [payCashOpen, setPayCashOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [agreements, setAgreements] = useState(mockAgreements);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkTargetModule, setLinkTargetModule] = useState<"estimate" | "invoice">("estimate");
  const [selectedAgreementForLink, setSelectedAgreementForLink] = useState<any>(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedAgreementForSign, setSelectedAgreementForSign] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedAgreementForPayment, setSelectedAgreementForPayment] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAgreementForPreview, setSelectedAgreementForPreview] = useState<any>(null);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch = agreement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const agreementDate = new Date(agreement.startDate);
    const matchesDateRange = 
      (!dateRange.from || agreementDate >= dateRange.from) &&
      (!dateRange.to || agreementDate <= dateRange.to);
    
    return matchesSearch && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSendEmail = (agreement: any) => {
    setSelectedAgreement(agreement);
    setSendEmailOpen(true);
  };

  const handleSendSMS = (agreement: any) => {
    setSelectedAgreement(agreement);
    setSendSMSOpen(true);
  };

  const handlePayCash = (agreement: any) => {
    setSelectedAgreement(agreement);
    setPayCashOpen(true);
  };

  const handleUpdateAgreement = (agreement: any) => {
    navigate(`/agreements/${agreement.id}/edit`);
  };

  const handlePaymentComplete = () => {
    if (selectedAgreement) {
      setAgreements(prevAgreements =>
        prevAgreements.map(agreement =>
          agreement.id === selectedAgreement.id
            ? { ...agreement, status: "Paid" }
            : agreement
        ) as typeof mockAgreements
      );
    }
  };

  const handleLinkModule = (agreement: any, targetModule: "estimate" | "invoice") => {
    setSelectedAgreementForLink(agreement);
    setLinkTargetModule(targetModule);
    setLinkModalOpen(true);
  };

  const handleConvertToJob = (agreement: any) => {
    navigate("/jobs/new", { state: { agreementData: agreement } });
  };

  const handleCreateNewAgreement = () => {
    navigate("/agreements/new");
  };

  const handlePayNow = (agreement: any) => {
    setSelectedAgreementForSign(agreement);
    setSelectedAgreementForPayment(agreement);
    setSignModalOpen(true);
  };

  const handleSignComplete = () => {
    setPaymentModalOpen(true);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search agreements..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full touch-target"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <CalendarRange className="h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">From Date</p>
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      className="pointer-events-auto"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">To Date</p>
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      className="pointer-events-auto"
                    />
                  </div>
                  {(dateRange.from || dateRange.to) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              onClick={() => navigate("/agreements/minimum-deposit")} 
              className="gap-2 w-full sm:w-auto"
            >
              <Percent className="h-5 w-5" />
              Minimum Deposit
            </Button>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => navigate("/agreements/new")}>
              <Plus className="h-5 w-5" />
              New Agreement
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAgreements.map((agreement) => (
            <Card
              key={agreement.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/agreements/${agreement.id}`)}
            >
              <div className="flex items-start justify-between gap-4 p-4">
                {/* Left block */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-foreground truncate">{agreement.title}</p>
                    <Badge className={getStatusColor(agreement.status)} variant="outline">
                      {agreement.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{agreement.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(agreement.startDate).toLocaleDateString()} – {new Date(agreement.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right block */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      ${agreement.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>

                  {agreement.status === "Open" && (
                    <Button
                      className="h-9 px-3 bg-[#F97316] hover:bg-[#F97316]/90 text-white text-sm font-medium rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayNow(agreement);
                      }}
                    >
                      Pay
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 bg-popover">
                      {/* Shared: Preview */}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgreementForPreview(agreement);
                          setPreviewModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>

                      {agreement.status === "Paid" && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToJob(agreement);
                            }}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Convert to Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateNewAgreement();
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Agreement
                          </DropdownMenuItem>
                        </>
                      )}

                      {agreement.status === "Open" && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToJob(agreement);
                            }}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Convert to Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayNow(agreement);
                            }}
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Pay Now
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayCash(agreement);
                            }}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Pay Cash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendEmail(agreement);
                            }}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendSMS(agreement);
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAgreement(agreement);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Agreement
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <SendEmailModal
        open={sendEmailOpen}
        onOpenChange={setSendEmailOpen}
        customerEmail={selectedAgreement?.customerEmail || ""}
      />
      <SendSMSModal
        open={sendSMSOpen}
        onOpenChange={setSendSMSOpen}
        customerName={selectedAgreement?.customerName || ""}
        phoneNumber={selectedAgreement?.customerPhone || ""}
      />
      <PayCashModal
        open={payCashOpen}
        onOpenChange={setPayCashOpen}
        orderAmount={selectedAgreement?.amount || 0}
        orderId={selectedAgreement?.id || ""}
        entityType="agreement"
        onPaymentComplete={handlePaymentComplete}
      />
      <LinkModulesModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        sourceModule="agreement"
        sourceId={selectedAgreementForLink?.id || ""}
        sourceName={selectedAgreementForLink?.title || ""}
        targetModule={linkTargetModule}
      />
      <AgreementSignModal
        open={signModalOpen}
        onOpenChange={setSignModalOpen}
        agreementId={selectedAgreementForSign?.id || ""}
        onSignComplete={handleSignComplete}
      />
      <PreviewAgreementModal
        open={previewModalOpen}
        onOpenChange={(open) => {
          setPreviewModalOpen(open);
          if (!open) setSelectedAgreementForPreview(null);
        }}
        agreement={selectedAgreementForPreview}
        onPayNow={(agreement) => {
          setSelectedAgreementForPayment(agreement);
          setPaymentModalOpen(true);
        }}
        onUpdate={(agreement) => {
          navigate(`/agreements/${agreement.id}/edit`);
        }}
      />
      <AgreementPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        agreement={selectedAgreementForPayment}
      />
    </div>
  );
};

export default Agreements;
