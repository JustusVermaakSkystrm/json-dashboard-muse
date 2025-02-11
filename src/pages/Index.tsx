
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Search, SlidersHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import DataVisualizer from "@/components/DataVisualizer";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Split the file content by newlines and parse each line as JSON
          const lines = (e.target.result as string)
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '');
          
          const parsedData = lines.map(line => {
            try {
              return JSON.parse(line);
            } catch (lineError) {
              console.error('Error parsing line:', line);
              return null;
            }
          }).filter(item => item !== null);

          if (parsedData.length === 0) {
            throw new Error("No valid JSON lines found");
          }

          setJsonData(parsedData);
          toast({
            title: "Success",
            description: `JSONL file loaded successfully with ${parsedData.length} records`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSONL file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
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
            <h1 className="text-3xl font-semibold text-gray-900">JSONL Viewer</h1>
            <p className="text-gray-500 mt-1">
              Upload and visualize your JSONL data
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Upload className="h-4 w-4" />
              Upload JSONL
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".jsonl"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {!jsonData ? (
          <Card className="border-dashed border-2 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your JSONL file
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Drag and drop your JSONL file here, or click the upload button above
                to begin visualizing your data. Each line should contain a valid JSON object.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataVisualizer data={jsonData} />
            <DataTable data={jsonData} searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
