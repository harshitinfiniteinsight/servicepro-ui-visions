import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clock, ChevronDown, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { mockEmployees } from "@/data/mockData";
import { toast } from "sonner";

interface Schedule {
  id: string;
  employeeName: string;
  scheduledDate: string;
  scheduledDateEnd?: string;
  timezone: string;
  startTime: string;
  endTime: string;
  timeInterval: string;
  weekDays: string[];
}

interface UpdateScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onUpdate: (schedule: Schedule) => void;
}

const weekDaysLabels = ["S", "M", "T", "W", "T", "F", "S"];

export function UpdateScheduleModal({ open, onOpenChange, schedule, onUpdate }: UpdateScheduleModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [timezone, setTimezone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Initialize form data when schedule changes
  useEffect(() => {
    if (schedule && open) {
      setSelectedEmployee(schedule.employeeName);
      
      // Parse date - use scheduledDate for single date picker
      const scheduleDate = schedule.scheduledDate ? new Date(schedule.scheduledDate) : undefined;
      setSelectedDate(scheduleDate);
      
      // Store weekDays as array of day labels
      setWeekDays(schedule.weekDays || []);
      
      // Format time slot to match "X Min" format (e.g., "15 min" -> "15 Min")
      const timeInterval = schedule.timeInterval || "";
      // Normalize the format: convert "15 min" to "15 Min" for display
      const normalizedInterval = timeInterval.replace(/\s*min\s*/i, "").trim();
      setTimeSlot(normalizedInterval ? `${normalizedInterval} Min` : "");
      
      setTimezone(schedule.timezone || "");
      setStartTime(schedule.startTime || "");
      setEndTime(schedule.endTime || "");
    } else {
      // Reset form when modal closes
      setSelectedEmployee("");
      setSelectedDate(undefined);
      setWeekDays([]);
      setTimeSlot("");
      setTimezone("");
      setStartTime("");
      setEndTime("");
    }
  }, [schedule, open]);

  const toggleWeekDay = (day: string, index: number) => {
    setWeekDays((prev) => {
      if (day === "T") {
        // Handle duplicate "T": index 2 is Tuesday, index 4 is Thursday
        const tCount = prev.filter(d => d === "T").length;
        
        if (index === 2) {
          // Toggle Tuesday (first T)
          if (tCount >= 1) {
            // Remove first "T"
            const firstTIndex = prev.indexOf("T");
            return prev.filter((_, i) => i !== firstTIndex);
          } else {
            // Add "T" for Tuesday
            return [...prev, "T"].sort((a, b) => {
              const order = ["S", "M", "T", "W", "T", "F", "S"];
              return order.indexOf(a) - order.indexOf(b);
            });
          }
        } else if (index === 4) {
          // Toggle Thursday (second T)
          if (tCount >= 2) {
            // Remove last "T"
            const lastTIndex = prev.lastIndexOf("T");
            return prev.filter((_, i) => i !== lastTIndex);
          } else if (tCount === 1) {
            // Add second "T" for Thursday
            return [...prev, "T"];
          } else {
            // If no T exists, add one (will be treated as Tuesday)
            return [...prev, "T"];
          }
        }
      }
      
      // For non-duplicate days, simple toggle
      return prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedDate || !startTime || !endTime || !timeSlot || !timezone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!schedule) return;

    // Convert "15 Min" back to "15 min" format for storage
    const timeIntervalValue = timeSlot.replace(/\s*Min\s*/i, " min").toLowerCase();
    
    const updatedSchedule: Schedule = {
      ...schedule,
      employeeName: selectedEmployee,
      scheduledDate: format(selectedDate, "yyyy-MM-dd"),
      scheduledDateEnd: undefined, // Single date picker, no end date
      timezone,
      startTime,
      endTime,
      timeInterval: timeIntervalValue,
      weekDays,
    };

    onUpdate(updatedSchedule);
    toast.success("Schedule updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-teal-50/50 via-cyan-50/30 to-transparent border-teal-200/50">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-center text-teal-700">
            Update Schedule
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Select Employee */}
              <div>
                <Label htmlFor="employee" className="text-sm font-semibold text-foreground mb-2 block">
                  Select Employee
                </Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-full bg-white border-teal-200 focus:border-teal-400">
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Schedule Date */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Select Schedule Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-white border-teal-200 hover:border-teal-400 text-foreground"
                    >
                      <span className="text-sm flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select date"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Select Time Slot */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Select Time Slot
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="w-full bg-white border-teal-200 focus:border-teal-400">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5 Min">5 Min</SelectItem>
                    <SelectItem value="10 Min">10 Min</SelectItem>
                    <SelectItem value="15 Min">15 Min</SelectItem>
                    <SelectItem value="20 Min">20 Min</SelectItem>
                    <SelectItem value="25 Min">25 Min</SelectItem>
                    <SelectItem value="30 Min">30 Min</SelectItem>
                    <SelectItem value="35 Min">35 Min</SelectItem>
                    <SelectItem value="40 Min">40 Min</SelectItem>
                    <SelectItem value="45 Min">45 Min</SelectItem>
                    <SelectItem value="50 Min">50 Min</SelectItem>
                    <SelectItem value="55 Min">55 Min</SelectItem>
                    <SelectItem value="60 Min">60 Min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Start Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 bg-white border-teal-200 focus:border-teal-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Select Weeks Days */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Select Weeks Days
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {weekDaysLabels.map((day, index) => {
                    // Check if this day is selected
                    let isSelected = false;
                    if (day === "T") {
                      // For "T", check position: index 2 is Tuesday, index 4 is Thursday
                      if (index === 2) {
                        // Tuesday: check if first "T" exists
                        isSelected = weekDays.indexOf("T") >= 0 && weekDays.indexOf("T") < 3;
                      } else if (index === 4) {
                        // Thursday: check if there's a second "T"
                        isSelected = weekDays.filter(d => d === "T").length > 1;
                      }
                    } else {
                      isSelected = weekDays.includes(day);
                    }
                    
                    return (
                      <button
                        key={`${day}-${index}`}
                        type="button"
                        onClick={() => toggleWeekDay(day, index)}
                        className={`h-12 w-12 rounded-full font-semibold text-sm transition-all ${
                          isSelected
                            ? "bg-teal-500 text-white shadow-md hover:bg-teal-600"
                            : "bg-white border-2 border-teal-200 text-teal-700 hover:border-teal-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Timezone */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Select Timezone
                </Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-full bg-white border-teal-200 focus:border-teal-400">
                    <SelectValue placeholder="Choose timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="America/New_York">America/New York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* End Time */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  End Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 bg-white border-teal-200 focus:border-teal-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              UPDATE
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

