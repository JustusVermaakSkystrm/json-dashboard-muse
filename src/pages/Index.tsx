
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataVisualizer from "@/components/DataVisualizer";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://feb-38d20.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYi0zOGQyMCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEwMDg0OTg4LCJleHAiOjIwMjU2NjA5ODh9.8HBJ4I5QRgSK6JOuUvTR-qcaAYnGIiEDRNLkM6ybPw4'
);

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    console.log("Starting Supabase data fetch...");
    
    // Set up real-time listener for fall data
    const channel = supabase
      .channel('fall_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fall_data'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchData(); // Refresh data when changes occur
        }
      )
      .subscribe();

    // Initial data fetch
    fetchData();

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, [toast]);

  const fetchData = async () => {
    try {
      console.log("Fetching data from Supabase...");
      const { data, error } = await supabase
        .from('fall_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Received data:", data);

      const formattedData = data.map(item => ({
        ...item,
        formattedTime: new Date(item.timestamp * 1000).toLocaleString(),
        fall_probability_percent: `${(item.fall_probability || 0).toFixed(2)}%`
      }));

      setJsonData(formattedData);
      toast({
        title: "Success",
        description: `Loaded ${formattedData.length} records from database`,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-[#E2E8F0] text-gray-600 hover:bg-[#CBD5E1]">
              Dashboard
            </Badge>
            <h1 className="text-3xl font-semibold text-gray-900">Fall Detection Monitor</h1>
            <p className="text-gray-500 mt-1">
              Real-time fall detection data visualization
            </p>
          </div>
        </div>

        {!jsonData ? (
          <Card className="border-dashed border-2 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading Data...
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Connecting to database and fetching real-time fall detection data.
                Check console for connection status.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <DataVisualizer data={jsonData} />
            <DataTable 
              data={jsonData.map(item => ({
                timestamp: item.formattedTime,
                fall_probability: item.fall_probability_percent,
                trunk_angle: `${(item.trunk_angle || 0).toFixed(2)}°`,
                hip_angle: `${(item.hip_angle || 0).toFixed(2)}°`,
                sit_probability: `${(item.sit_probability || 0).toFixed(2)}%`,
                stand_probability: `${(item.stand_probability || 0).toFixed(2)}%`
              }))} 
              searchQuery={searchQuery}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
