import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, Briefcase, Edit, UserX } from "lucide-react";

interface EmployeeCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  hireDate: string;
  totalJobs: number;
  avatar?: string;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export const EmployeeCard = ({
  id,
  name,
  email,
  phone,
  role,
  status,
  hireDate,
  totalJobs,
  avatar,
  onEdit,
  onDeactivate,
}: EmployeeCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{id}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {role}
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                {status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground truncate">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground">{phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground">
              Hired {new Date(hireDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Total Jobs
            </span>
            <span className="font-bold text-xl text-primary">{totalJobs}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onEdit} variant="outline" size="sm" className="flex-1 gap-2 min-w-0">
            <Edit className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Edit Employee</span>
          </Button>
          <Button onClick={onDeactivate} variant="outline" size="sm" className="flex-1 gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground min-w-0">
            <UserX className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Deactivate</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
