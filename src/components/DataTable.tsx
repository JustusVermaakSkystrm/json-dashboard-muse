
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableProps {
  data: any;
  searchQuery: string;
}

const DataTable = ({ data, searchQuery }: DataTableProps) => {
  // Simple console log to track incoming data
  console.log("DataTable received data:", data);

  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error("DataTable expected array, received:", typeof data);
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Data Table</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Check if data is empty
  if (data.length === 0) {
    console.log("DataTable received empty array");
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Data Table</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Process data safely
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Filter data based on search query
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Format data for display
  const formattedData = filteredData.map(row => {
    const newRow = {...row};
    
    // Format sit_probability and stand_probability to show as 0% to 100%
    if ('sit_probability' in newRow && typeof newRow.sit_probability === 'string') {
      // Check if it's already formatted properly
      if (!newRow.sit_probability.includes('%')) {
        const value = parseFloat(newRow.sit_probability);
        newRow.sit_probability = `${(value * 100).toFixed(2)}%`;
      }
    }
    
    if ('stand_probability' in newRow && typeof newRow.stand_probability === 'string') {
      // Check if it's already formatted properly
      if (!newRow.stand_probability.includes('%')) {
        const value = parseFloat(newRow.stand_probability);
        newRow.stand_probability = `${(value * 100).toFixed(2)}%`;
      }
    }
    
    return newRow;
  });

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Data Table</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {typeof row[column] === "object"
                        ? JSON.stringify(row[column])
                        : String(row[column] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
