import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScanLine, Bluetooth, Usb, Wifi, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CardReader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  
  const [cardReaderSettings, setCardReaderSettings] = useState({
    enabled: true,
    autoConnect: true,
    soundEnabled: true,
    printReceipt: false,
  });

  const [connectedDevice] = useState({
    name: "Square Reader",
    type: "Bluetooth",
    status: "connected",
    battery: 85,
  });

  const handleToggle = (key: keyof typeof cardReaderSettings) => {
    setCardReaderSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Card reader settings have been updated successfully.",
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Testing card reader connection...",
    });
    // Add test logic here
  };

  const handleDisconnect = () => {
    toast({
      title: "Device Disconnected",
      description: "Card reader has been disconnected.",
    });
    // Add disconnect logic here
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." />
      
      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Configure Card Reader
          </h1>
        </div>

        <div className="max-w-4xl space-y-6">
          <p className="text-sm text-muted-foreground">
            Set up and manage your card reader devices for processing payments.
          </p>

          {/* Connected Device */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Connected Device</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-600/10">
                      <ScanLine className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{connectedDevice.name}</h3>
                        {connectedDevice.status === "connected" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {connectedDevice.type === "Bluetooth" ? (
                            <Bluetooth className="h-3 w-3" />
                          ) : connectedDevice.type === "USB" ? (
                            <Usb className="h-3 w-3" />
                          ) : (
                            <Wifi className="h-3 w-3" />
                          )}
                          {connectedDevice.type}
                        </span>
                        <span>Battery: {connectedDevice.battery}%</span>
                        <span className="capitalize">{connectedDevice.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleTestConnection}
                      size="sm"
                    >
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDisconnect}
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Device Settings</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Enable Card Reader</h3>
                    <p className="text-sm text-muted-foreground">
                      Turn card reader functionality on or off
                    </p>
                  </div>
                  <Switch
                    checked={cardReaderSettings.enabled}
                    onCheckedChange={() => handleToggle("enabled")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Auto-Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically connect to card reader when available
                    </p>
                  </div>
                  <Switch
                    checked={cardReaderSettings.autoConnect}
                    onCheckedChange={() => handleToggle("autoConnect")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Sound Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Play sound when card is read or payment is processed
                    </p>
                  </div>
                  <Switch
                    checked={cardReaderSettings.soundEnabled}
                    onCheckedChange={() => handleToggle("soundEnabled")}
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Print Receipt</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically print receipt after successful payment
                    </p>
                  </div>
                  <Switch
                    checked={cardReaderSettings.printReceipt}
                    onCheckedChange={() => handleToggle("printReceipt")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Connection Options</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-600/10">
                      <Bluetooth className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-foreground">Bluetooth</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect wirelessly via Bluetooth
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-600/10">
                      <Usb className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium text-foreground">USB</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect via USB cable
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground mb-1">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure your card reader is powered on and within range. If you're having trouble connecting, 
                    try disconnecting and reconnecting the device, or check the device's battery level.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasChanges && (
            <div className="sticky bottom-6 flex justify-center">
              <Button
                onClick={handleSave}
                size="lg"
                className="shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CardReader;


