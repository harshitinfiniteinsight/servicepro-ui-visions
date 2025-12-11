import { useState, useRef, useEffect } from "react";
import { Bell, DollarSign, Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NotificationDropdownProps {
  onConvertToJob: (entityType: "invoice" | "estimate" | "agreement", entityId: string) => void;
}

export const NotificationDropdown = ({ onConvertToJob }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { notifications, markAsRead, markAllAsRead, unreadCount, removeNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
  };

  const handleConvertToJob = (notification: any) => {
    markAsRead(notification.id);
    onConvertToJob(notification.entityType, notification.entityId);
    setIsOpen(false);
  };

  const getEntityTypeLabel = (type: "invoice" | "estimate" | "agreement") => {
    switch (type) {
      case "invoice":
        return "Invoice";
      case "estimate":
        return "Estimate";
      case "agreement":
        return "Agreement";
    }
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="touch-target hover:bg-gray-100 relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer",
                      !notification.read && "bg-blue-50/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon Circle */}
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>

                        {/* Convert to Job Button */}
                        {notification.action === "convertToJob" && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToJob(notification);
                            }}
                            className="h-8 px-3 bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white text-xs font-medium rounded-full gap-1.5"
                            size="sm"
                          >
                            <Briefcase className="h-3.5 w-3.5" />
                            Convert to Job
                          </Button>
                        )}
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="flex-shrink-0 h-6 w-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Remove notification"
                      >
                        <X className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => navigate("/notifications")}
                className="text-sm text-primary hover:text-primary/80 font-medium w-full text-center"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

