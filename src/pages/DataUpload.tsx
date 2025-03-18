
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  Info, 
  Loader2, 
  Upload 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const REQUIRED_COLUMNS = [
  'Date',
  'Campaign name',
  'Ad set name',
  'Delivery status',
  'Delivery level',
  'Reach',
  'Impressions',
  'Frequency',
  'Attribution setting',
  'Result Type',
  'Results',
  'Amount spent (INR)',
  'Cost per result',
  'Purchase ROAS (return on ad spend)',
  'Purchases conversion value',
  'Starts',
  'Ends',
  'Link clicks',
  'CPC (cost per link click)',
  'CPM (cost per 1,000 impressions)',
  'CTR (all)',
  'CPC (all)',
  'Clicks (all)',
  'Adds to cart',
  'Checkouts initiated',
  'Cost per add to cart',
  'Video plays at 50%',
  'Video plays at 75%',
  'Video average play time',
  'Instagram profile visits',
  'Page engagement',
  'Reporting starts',
  'Reporting ends',
];

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [uploadOption, setUploadOption] = useState<'append' | 'overwrite'>('append');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationStatus('idle');
      setValidationMessage('');
    }
  };

  const validateCSV = () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsValidating(true);
    setValidationStatus('validating');

    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      
      // Simulate validation success (in real app, this would be actual validation)
      const isValid = true; // This would be determined by actual validation
      
      if (isValid) {
        setValidationStatus('success');
        setValidationMessage('File is valid and ready to upload');
        toast.success('File validation successful!');
      } else {
        setValidationStatus('error');
        setValidationMessage('File is missing required columns');
        toast.error('File validation failed');
      }
    }, 1500);
  };

  const handleUpload = () => {
    if (validationStatus !== 'success') {
      toast.error('Please validate the file first');
      return;
    }

    toast.success(`File uploaded successfully with ${uploadOption} option!`);
    
    // Reset the form
    setFile(null);
    setValidationStatus('idle');
    setValidationMessage('');
    setUploadOption('append');
    
    // Clear the file input
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const downloadTemplate = () => {
    // In a real app, this would generate a template CSV file
    // For now, we'll just show a toast message
    toast.success('Template downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload your Meta Ads data to track and analyze performance
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="format">Format Requirements</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 pt-4">
          <Card className="glass-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Upload Meta Ads Data</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with your Meta Ads performance data
                </p>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
              
              <div className="text-center mb-4">
                <h3 className="font-medium">Upload CSV File</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>
              
              <div className="w-full max-w-sm">
                <Label htmlFor="csv-upload" className="sr-only">
                  Upload CSV
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="bg-secondary/50"
                />
              </div>
              
              {file && (
                <div className="mt-4 w-full max-w-sm">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-sm font-medium truncate max-w-[180px]">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <>
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={validateCSV}
                    disabled={isValidating || !file}
                    className="bg-brand-green text-brand-darkBlue hover:bg-brand-green/90"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Validate File'
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleUpload}
                    disabled={validationStatus !== 'success'}
                    className="bg-brand-blue"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>

                {validationStatus === 'success' && (
                  <Alert className="bg-brand-green/10 border-brand-green">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    <AlertTitle className="text-brand-green">Validation Successful</AlertTitle>
                    <AlertDescription className="text-brand-green/90">
                      {validationMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {validationStatus === 'error' && (
                  <Alert className="bg-brand-red/10 border-brand-red">
                    <AlertCircle className="h-4 w-4 text-brand-red" />
                    <AlertTitle className="text-brand-red">Validation Error</AlertTitle>
                    <AlertDescription className="text-brand-red/90">
                      {validationMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {validationStatus === 'success' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-brand-skyBlue" />
                      <h3 className="text-sm font-medium">Upload Options</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="append"
                          name="uploadOption"
                          value="append"
                          checked={uploadOption === 'append'}
                          onChange={() => setUploadOption('append')}
                          className="text-brand-green focus:ring-brand-green"
                        />
                        <Label htmlFor="append">
                          Append data (add to existing data)
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="overwrite"
                          name="uploadOption"
                          value="overwrite"
                          checked={uploadOption === 'overwrite'}
                          onChange={() => setUploadOption('overwrite')}
                          className="text-brand-green focus:ring-brand-green"
                        />
                        <Label htmlFor="overwrite">
                          Overwrite data (replace existing data for matching dates)
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="format" className="space-y-4 pt-4">
          <Card className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">CSV Format Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Required Columns</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Your CSV file must include the following columns in the exact order:
                </p>
                
                <div className="border border-border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">#</TableHead>
                        <TableHead>Column Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {REQUIRED_COLUMNS.slice(0, 10).map((column, index) => (
                        <TableRow key={column}>
                          <TableCell className="font-mono">{index + 1}</TableCell>
                          <TableCell>{column}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  See all {REQUIRED_COLUMNS.length} required columns in the template file.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Data Format</h3>
                
                <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
                  <li>Dates must be in YYYY-MM-DD format (e.g., 2023-12-01)</li>
                  <li>Numeric values should not contain commas (e.g., 1234.56 not 1,234.56)</li>
                  <li>Empty cells should be left blank, not filled with 0 or N/A</li>
                  <li>The first row must contain column headers exactly as specified</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Export from Meta Ads Manager</h3>
                
                <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                  <li>In Meta Ads Manager, go to the Reports tab</li>
                  <li>Create a report with all the required metrics</li>
                  <li>Set your desired date range</li>
                  <li>Click Export → CSV</li>
                  <li>Upload the exported file here</li>
                </ol>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          <Card className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Upload History</h2>
            
            <div className="border border-border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Data Range</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-12-15 10:23 AM</TableCell>
                    <TableCell>meta-ads-dec-2023.csv</TableCell>
                    <TableCell>Dec 1 - Dec 15, 2023</TableCell>
                    <TableCell>156</TableCell>
                    <TableCell className="text-brand-green">Success</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-12-01 09:15 AM</TableCell>
                    <TableCell>meta-ads-nov-2023.csv</TableCell>
                    <TableCell>Nov 1 - Nov 30, 2023</TableCell>
                    <TableCell>302</TableCell>
                    <TableCell className="text-brand-green">Success</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-11-15 11:45 AM</TableCell>
                    <TableCell>meta-ads-oct-2023.csv</TableCell>
                    <TableCell>Oct 1 - Oct 31, 2023</TableCell>
                    <TableCell>298</TableCell>
                    <TableCell className="text-brand-green">Success</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataUpload;
