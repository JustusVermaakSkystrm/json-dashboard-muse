
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
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    console.log("Starting Firebase data fetch...");
    
    // Create a query to fetch data ordered by timestamp
    const q = query(collection(db, 'fallData'), orderBy('timestamp', 'desc'));

    // First, let's check if we can get any data
    getDocs(q).then((snapshot) => {
      console.log("Initial data check:", snapshot.size, "documents found");
      console.log("Collection exists:", !snapshot.empty);
      if (!snapshot.empty) {
        console.log("Sample doc:", snapshot.docs[0].data());
      }
    }).catch(error => {
      console.error("Error checking collection:", error);
    });

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Snapshot received, document count:", querySnapshot.size);
      
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        console.log("Processing document:", doc.id, docData);
        
        return {
          ...docData,
          id: doc.id,
          formattedTime: new Date(docData.timestamp * 1000).toLocaleString(),
          fall_probability_percent: `${(docData.fall_probability || 0).toFixed(2)}%`
        };
      });
      
      console.log("Processed data:", data);
      setJsonData(data);
      
      toast({
        title: "Success",
        description: `Loaded ${data.length} records from Firebase`,
      });
    }, (error) => {
      console.error("Detailed error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data from Firebase",
        variant: "destructive",
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

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
                Connecting to Firebase and fetching real-time fall detection data.
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
