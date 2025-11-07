import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAppointments } from "@/data/mobileMockData";
import { Plus, Calendar, Clock, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const ManageAppointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Get appointments for selected date
  const dayAppointments = mockAppointments.filter(apt => apt.date === selectedDate);
  
  // Get unique dates with appointments
  const datesWithAppointments = Array.from(new Set(mockAppointments.map(apt => apt.date))).sort();
  
  // Get current week dates
  const today = new Date();
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Appointments"
        actions={
          <Button size="sm" onClick={() => navigate("/appointments/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Week Calendar */}
        <div className="px-4 py-4 border-b bg-muted/30">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {currentWeek.map((date) => {
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dateObj.getDate();
              const hasAppointments = datesWithAppointments.includes(date);
              const isSelected = date === selectedDate;
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] p-3 rounded-xl border transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent/5",
                    hasAppointments && !isSelected && "border-primary/30"
                  )}
                >
                  <span className="text-xs font-medium">{dayName}</span>
                  <span className={cn(
                    "text-lg font-bold mt-1",
                    isSelected ? "text-primary-foreground" : ""
                  )}>
                    {dayNum}
                  </span>
                  {hasAppointments && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1",
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Appointments */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <Badge variant="outline">{dayAppointments.length} appointments</Badge>
          </div>

          {dayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No appointments scheduled</p>
              <Button onClick={() => navigate("/appointments/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          ) : (
            dayAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{appointment.time}</span>
                      <Badge className={cn("text-xs", statusColors[appointment.status])}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg mb-1">{appointment.service}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-3 w-3" />
                      <span>{appointment.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">
                      {appointment.technicianName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{appointment.technicianName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
