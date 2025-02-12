
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
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create a query to fetch data ordered by timestamp
    const q = query(collection(db, 'fallData'), orderBy('timestamp', 'desc'));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      setJsonData(data);
      toast({
        title: "Success",
        description: `Loaded ${data.length} records from Firebase`,
      });
    }, (error) => {
      console.error("Error fetching data:", error);
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
              </p>
            </CardContent>
          </Card>
        ) : (
          <DataVisualizer data={jsonData} />
        )}
      </div>
    </div>
  );
};

export default Index;
