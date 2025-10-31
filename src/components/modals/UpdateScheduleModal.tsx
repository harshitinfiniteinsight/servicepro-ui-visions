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
  const [allDaysSelected, setAllDaysSelected] = useState(false);
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
      const days = schedule.weekDays || [];
      setWeekDays(days);
      
      // Check if all days are selected
      setAllDaysSelected(days.length === 7);
      
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
      setAllDaysSelected(false);
      setTimeSlot("");
      setTimezone("");
      setStartTime("");
      setEndTime("");
    }
  }, [schedule, open]);

  const toggleAllDays = () => {
    if (allDaysSelected) {
      setWeekDays([]);
      setAllDaysSelected(false);
    } else {
      setWeekDays(["S", "M", "T", "W", "T", "F", "S"]);
      setAllDaysSelected(true);
    }
  };

  const toggleWeekDay = (day: string, index: number) => {
    setWeekDays((prev) => {
      let newDays: string[];
      
      if (day === "T") {
        // Handle duplicate "T": index 2 is Tuesday, index 4 is Thursday
        const tCount = prev.filter(d => d === "T").length;
        
        if (index === 2) {
          // Toggle Tuesday (first T)
          if (tCount >= 1) {
            // Remove first "T"
            const firstTIndex = prev.indexOf("T");
            newDays = prev.filter((_, i) => i !== firstTIndex);
          } else {
            // Add "T" for Tuesday
            newDays = [...prev, "T"].sort((a, b) => {
              const order = ["S", "M", "T", "W", "T", "F", "S"];
              return order.indexOf(a) - order.indexOf(b);
            });
          }
        } else if (index === 4) {
          // Toggle Thursday (second T)
          if (tCount >= 2) {
            // Remove last "T"
            const lastTIndex = prev.lastIndexOf("T");
            newDays = prev.filter((_, i) => i !== lastTIndex);
          } else if (tCount === 1) {
            // Add second "T" for Thursday
            newDays = [...prev, "T"];
          } else {
            // If no T exists, add one (will be treated as Tuesday)
            newDays = [...prev, "T"];
          }
        } else {
          newDays = prev;
        }
      } else {
        // For non-duplicate days, simple toggle
        newDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      }
      
      // Update "All Days" state
      setAllDaysSelected(newDays.length === 7);
      return newDays;
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Update Schedule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Employee Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule Date */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
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

            {/* Week Days */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Weeks Days</Label>
              <div className="flex gap-2 mb-3">
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
                      className={`h-12 w-12 rounded-full font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {/* All Days Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDays"
                  checked={allDaysSelected}
                  onChange={toggleAllDays}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="allDays" className="text-sm cursor-pointer">
                  All Days
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Slot */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Time Slot</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5 Min">5 Min</SelectItem>
                  <SelectItem value="10 Min">10 Min</SelectItem>
                  <SelectItem value="15 Min">15 Min</SelectItem>
                  <SelectItem value="20 Min">20 Min</SelectItem>
                  <SelectItem value="30 Min">30 Min</SelectItem>
                  <SelectItem value="60 Min">60 Min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                  <SelectItem value="America/New_York">America/New York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10"
                  placeholder="Start Time"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <Label className="text-sm font-medium mb-2 block">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
                  placeholder="End Time"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-lg py-6"
          >
            UPDATE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

