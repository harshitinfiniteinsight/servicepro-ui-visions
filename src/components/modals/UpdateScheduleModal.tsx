import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
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
  const [selectedDate, setSelectedDate] = useState("");
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
      
      // Parse date - convert to YYYY-MM-DD format for input type="date"
      const scheduleDate = schedule.scheduledDate || "";
      setSelectedDate(scheduleDate);
      
      // Store weekDays
      const days = schedule.weekDays || [];
      setWeekDays(days);
      
      // Check if all days are selected
      setAllDaysSelected(days.length === 7);
      
      // Format time slot - extract number from "15 min" format
      const timeInterval = schedule.timeInterval || "";
      const normalizedInterval = timeInterval.replace(/\s*min\s*/i, "").trim();
      setTimeSlot(normalizedInterval || "");
      
      setTimezone(schedule.timezone || "");
      setStartTime(schedule.startTime || "");
      setEndTime(schedule.endTime || "");
    } else {
      // Reset form when modal closes
      setSelectedEmployee("");
      setSelectedDate("");
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

  const toggleWeekDay = (day: string) => {
    const newDays = weekDays.includes(day) ? weekDays.filter(d => d !== day) : [...weekDays, day];
    setWeekDays(newDays);
    setAllDaysSelected(newDays.length === 7);
  };

  const handleUpdateSchedule = () => {
    if (!selectedEmployee || !selectedDate || !startTime || !endTime || !timeSlot || !timezone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!schedule) return;

    // Convert time slot to "15 min" format for storage
    const timeIntervalValue = `${timeSlot} min`;
    
    const updatedSchedule: Schedule = {
      ...schedule,
      employeeName: selectedEmployee,
      scheduledDate: selectedDate,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Edit Schedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 1. Select Employee */}
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

          {/* 2. Select Schedule Date */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Schedule Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* 3. Select Week Days */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Week Days</Label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="allDaysEdit"
                checked={allDaysSelected}
                onChange={toggleAllDays}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="allDaysEdit" className="text-sm cursor-pointer">
                Select All
              </Label>
            </div>
            <div className="flex gap-2">
              {weekDaysLabels.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekDay(day)}
                  className={`h-12 w-12 rounded-full font-semibold transition-all ${
                    weekDays.includes(day)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Select Time Slot */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Select Time Slot</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="10">10 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="20">20 min</SelectItem>
                <SelectItem value="25">25 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="35">35 min</SelectItem>
                <SelectItem value="40">40 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="50">50 min</SelectItem>
                <SelectItem value="55">55 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Select Timezone */}
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

          {/* 6. Start Time */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Start Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10"
                placeholder="HH:MM"
              />
            </div>
          </div>

          {/* 7. End Time */}
          <div>
            <Label className="text-sm font-medium mb-2 block">End Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10"
                placeholder="HH:MM"
              />
            </div>
          </div>

          {/* 8. Update Button */}
          <Button
            onClick={handleUpdateSchedule}
            className="w-full gradient-primary text-lg py-6"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
