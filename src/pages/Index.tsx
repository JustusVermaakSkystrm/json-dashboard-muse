
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
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import BrandLogo from "@/components/BrandLogo";

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    console.log("Starting Firebase data fetch...");
    
    // Set up real-time listener for fall data
    const q = query(
      collection(db, 'fallData'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        console.log("Received Firebase update");
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedTime: new Date(doc.data().timestamp * 1000).toLocaleString(),
          fall_probability_percent: `${(doc.data().fall_probability || 0).toFixed(2)}%`
        }));

        console.log("Processed data:", data);
        setJsonData(data);
      } catch (error) {
        console.error("Error processing Firebase data:", error);
        toast({
          title: "Error",
          description: "Failed to process database update",
          variant: "destructive",
        });
      }
    }, (error) => {
      console.error("Firebase subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="min-h-screen bg-black p-6 space-y-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <div>
              <Badge className="mb-2 bg-[#E2E8F0] text-gray-600 hover:bg-[#CBD5E1]">
                Dashboard
              </Badge>
              <h1 className="text-3xl font-semibold text-white">Fall Detection Monitor</h1>
              <p className="text-gray-400 mt-1">
                Real-time fall detection data visualization
              </p>
            </div>
          </div>
        </div>

        {!jsonData ? (
          <Card className="border-dashed border-2 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Loading Data...
              </h3>
              <p className="text-gray-400 text-center max-w-md">
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
