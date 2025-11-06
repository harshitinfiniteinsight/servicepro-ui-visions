import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Clock, ChevronLeft, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { mockEmployees } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const WEEK_DAYS = [
  { label: "S", value: "Sunday", fullLabel: "Sunday", index: 0 },
  { label: "M", value: "Monday", fullLabel: "Monday", index: 1 },
  { label: "T", value: "Tuesday", fullLabel: "Tuesday", index: 2 },
  { label: "W", value: "Wednesday", fullLabel: "Wednesday", index: 3 },
  { label: "T", value: "Thursday", fullLabel: "Thursday", index: 4 },
  { label: "F", value: "Friday", fullLabel: "Friday", index: 5 },
  { label: "S", value: "Saturday", fullLabel: "Saturday", index: 6 },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const TIME_SLOTS = ["5 Min", "10 Min", "15 Min", "20 Min", "30 Min", "60 Min"];

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
      
      // Parse date
      const scheduleDate = schedule.scheduledDate ? new Date(schedule.scheduledDate) : undefined;
      setSelectedDate(scheduleDate);
      
      // Store weekDays
      const days = schedule.weekDays || [];
      setWeekDays(days);
      
      // Check if all days are selected
      setAllDaysSelected(days.length === 7);
      
      // Format time slot
      const timeInterval = schedule.timeInterval || "";
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
            const firstTIndex = prev.indexOf("T");
            newDays = prev.filter((_, i) => i !== firstTIndex);
          } else {
            newDays = [...prev, "T"];
          }
        } else if (index === 4) {
          // Toggle Thursday (second T)
          if (tCount >= 2) {
            const lastTIndex = prev.lastIndexOf("T");
            newDays = prev.filter((_, i) => i !== lastTIndex);
          } else if (tCount === 1) {
            newDays = [...prev, "T"];
          } else {
            newDays = [...prev, "T"];
          }
        } else {
          newDays = prev;
        }
      } else {
        newDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      }
      
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
      scheduledDateEnd: undefined,
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header with orange gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-white">Edit Schedule</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/90 text-sm ml-11">
            Update employee schedule information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="h-10">
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

          <Separator />

          {/* Schedule Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-600">Schedule Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schedule Date */}
              <div className="space-y-2">
                <Label>Schedule Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select date"}
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

              {/* Time Slot */}
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot *</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timezone and Days in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Select Timezone *</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Days *</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAllDays"
                      checked={allDaysSelected}
                      onCheckedChange={toggleAllDays}
                    />
                    <Label htmlFor="selectAllDays" className="text-sm font-medium cursor-pointer">
                      Select All
                    </Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  {WEEK_DAYS.map((day, index) => {
                    let isSelected = false;
                    if (day.label === "T") {
                      const tCount = weekDays.filter(d => d === "T").length;
                      if (index === 2) {
                        isSelected = weekDays.indexOf("T") >= 0 && weekDays.indexOf("T") < 3;
                      } else if (index === 4) {
                        isSelected = weekDays.filter(d => d === "T").length > 1;
                      }
                    } else {
                      isSelected = weekDays.includes(day.label);
                    }
                    
                    return (
                      <button
                        key={`${day.label}-${index}`}
                        type="button"
                        onClick={() => toggleWeekDay(day.label, index)}
                        className={cn(
                          "h-10 w-10 rounded-full border-2 font-semibold text-sm transition-all flex-shrink-0",
                          isSelected
                            ? "bg-orange-500 text-white border-orange-500 shadow-md"
                            : "bg-background text-muted-foreground border-border hover:border-orange-300 hover:text-orange-600"
                        )}
                        title={day.fullLabel}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Start and End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
