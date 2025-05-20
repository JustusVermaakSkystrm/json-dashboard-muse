
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BrandLogo from "@/components/BrandLogo";
import { LogOut, Settings as SettingsIcon } from "lucide-react";

const formSchema = z.object({
  deviceId: z.string().min(1, { message: "Device ID is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedDeviceId, setSavedDeviceId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceId: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, "userSettings", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setSavedDeviceId(data.deviceId);
          form.setValue("deviceId", data.deviceId);
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };
    
    fetchUserSettings();
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    try {
      // Save user settings
      await setDoc(doc(db, "userSettings", user.uid), {
        deviceId: values.deviceId,
      });
      
      setSavedDeviceId(values.deviceId);
      
      toast({
        title: "Settings saved",
        description: "Your device ID has been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    
    if (success) {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: error || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center"
           style={{ background: 'linear-gradient(to right, #FF800A, #7829B0)' }}>
        <Card className="w-full max-w-md bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6"
         style={{ background: 'linear-gradient(to right, #FF800A, #7829B0)' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <div className="flex items-center gap-2">
              <Badge className="mb-2 bg-[#E2E8F0] text-gray-600 hover:bg-[#CBD5E1]">
                Settings
              </Badge>
              <div>
                <h1 className="text-3xl font-semibold text-white">Device Settings</h1>
                <p className="text-gray-200 mt-1">
                  Configure your Raspberry Pi device connection
                </p>
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Dashboard
          </Button>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Device Configuration</CardTitle>
            <CardDescription>
              Link your account to your Raspberry Pi device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your device ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Save Settings
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {savedDeviceId && (
              <div className="w-full p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium">Current Device ID</p>
                <p className="font-mono text-sm">{savedDeviceId}</p>
              </div>
            )}
            
            <Button variant="outline" onClick={handleLogout} className="w-full gap-2 text-red-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
