import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuditSection } from "@/data/auditSections";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import croAuditLogo from "@/assets/cro-audit-logo.png";

interface PDFGeneratorProps {
  auditData: {
    preparedBy: string;
    date: string;
    websiteUrl: string;
  };
  sections: AuditSection[];
}

export const PDFGenerator = ({ auditData, sections }: PDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // More aggressive compression for PDF optimization (max 600x400)
        let { width, height } = img;
        const maxWidth = 600;
        const maxHeight = 400;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Enhanced compression: JPEG with 60% quality for smaller PDFs
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataURL = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataURL);
      };
      
      img.onerror = reject;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const totalItems = sections.reduce((total, section) => total + section.items.length, 0);
      const completedItems = sections.reduce((total, section) => 
        total + section.items.filter(item => item.status !== null).length, 0);
      const passedItems = sections.reduce((total, section) => 
        total + section.items.filter(item => item.status === 'pass').length, 0);
      const failedItems = sections.reduce((total, section) => 
        total + section.items.filter(item => item.status === 'fail').length, 0);
      const optionalItems = sections.reduce((total, section) => 
        total + section.items.filter(item => item.status === 'optional').length, 0);

      // Create a temporary div to hold our PDF content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.color = 'black';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.padding = '40px';

      // Collect and compress image data for failed/optional items
      const imageData: Record<string, string> = {};
      for (const section of sections) {
        for (const item of section.items) {
          if (item.image && (item.status === 'fail' || item.status === 'optional')) {
            try {
              // Enhanced compression for smaller PDFs
              const compressedImage = await compressImage(item.image);
              imageData[item.id] = compressedImage;
            } catch (error) {
              console.warn(`Failed to process image for item ${item.id}:`, error);
            }
          }
        }
      }

      // Create section content with modern headers and optimized layout
      let sectionsHTML = '';
      for (const section of sections) {
        // Only include sections with completed items
        const sectionCompletedItems = section.items.filter(item => item.status !== null);
        if (sectionCompletedItems.length === 0) continue;

        let itemsHTML = '';
        for (const item of sectionCompletedItems) {
          const statusText = item.status === 'pass' ? '✓ PASS' : 
                            item.status === 'fail' ? '✗ FAIL' : 
                            item.status === 'optional' ? '🟡 OPTIONAL' : '○ PENDING';
          
          let imageHTML = '';
          if (item.image && (item.status === 'fail' || item.status === 'optional') && imageData[item.id]) {
            imageHTML = `<div style="margin-top: 12px; page-break-inside: avoid; break-inside: avoid;">
              <img src="${imageData[item.id]}" style="max-width: 280px; max-height: 180px; border: 1px solid #ddd; border-radius: 6px; display: block;" alt="Issue screenshot" />
            </div>`;
          }

          // Enhanced item styling with better page break handling
          itemsHTML += `
            <div style="
              margin-bottom: 18px; 
              padding: 18px; 
              border: 1px solid #e0e0e0; 
              border-radius: 10px; 
              background: #fbfbfb; 
              page-break-inside: avoid; 
              break-inside: avoid;
              display: block;
              width: 100%;
              box-sizing: border-box;
            ">
              <div style="font-weight: bold; margin-bottom: 10px; font-size: 15px; color: #2c2c2c; line-height: 1.3;">${item.title}</div>
              <p style="margin-bottom: 10px; color: #6a6a6a; font-size: 13px; line-height: 1.4;">${item.description}</p>
              <div style="margin-bottom: 10px;">
                <span style="
                  display: inline-block; 
                  padding: 6px 14px; 
                  border-radius: 15px; 
                  font-size: 11px; 
                  font-weight: bold; 
                  ${item.status === 'pass' ? 'background: #d4edda; color: #155724;' : 
                    item.status === 'fail' ? 'background: #f8d7da; color: #721c24;' : 
                    item.status === 'optional' ? 'background: #fff3cd; color: #856404;' : 'background: #e2e3e5; color: #6c757d;'}
                ">${statusText}</span>
              </div>
              ${item.explanation ? `<div style="
                margin-top: 12px; 
                padding: 14px; 
                background: #f0f0f0; 
                border-radius: 8px; 
                font-style: italic; 
                font-size: 12px; 
                page-break-inside: avoid; 
                break-inside: avoid;
                line-height: 1.4;
              "><strong>${item.status === 'fail' ? 'Issue & Recommendations:' : item.status === 'optional' ? 'Optional Notes:' : 'Notes:'}</strong><br/>${item.explanation}</div>` : ''}
              ${imageHTML}
            </div>
          `;
        }

        // Modern section header with better visual hierarchy
        sectionsHTML += `
          <div style="
            margin-bottom: 35px; 
            page-break-inside: avoid; 
            break-inside: avoid;
            display: block;
            width: 100%;
          ">
            <div style="
              font-size: 22px; 
              font-weight: bold; 
              color: #1a1a1a; 
              background: linear-gradient(135deg, #FFE009 0%, #FFF14D 100%);
              padding: 18px 20px; 
              margin-bottom: 20px; 
              border-radius: 12px;
              border-left: 5px solid #E6CC00;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              page-break-after: avoid;
            ">
              ${section.title.toUpperCase()}
            </div>
            <p style="
              margin-bottom: 20px; 
              font-style: italic; 
              color: #666; 
              font-size: 14px; 
              padding-left: 4px;
              line-height: 1.4;
            ">${section.description}</p>
            <div style="page-break-inside: avoid; break-inside: avoid;">
              ${itemsHTML}
            </div>
          </div>
        `;
      }

      // Create the full HTML content with beautiful styling
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #FFE009; padding-bottom: 20px;">
          <img src="${croAuditLogo}" style="height: 60px; margin-bottom: 15px;" alt="CRO Audit Logo" />
          <div style="color: #FFE009; font-size: 32px; font-weight: bold; margin-bottom: 10px;">CRO AUDIT REPORT</div>
          <h2 style="margin: 0; color: #2E2E2E; font-size: 20px;">Conversion Rate Optimization Analysis</h2>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ddd;">
          <h3 style="margin-top: 0; color: #2E2E2E;">Audit Information</h3>
          <p style="margin: 8px 0;"><strong>Website:</strong> ${auditData.websiteUrl}</p>
          <p style="margin: 8px 0;"><strong>Prepared by:</strong> ${auditData.preparedBy}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${auditData.date}</p>
        </div>

        <div style="background: #2E2E2E; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; page-break-inside: avoid; break-inside: avoid;">
          <h3 style="margin-top: 0; color: #FFE009;">Executive Summary</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Total Items Evaluated:</strong> ${totalItems}</p>
            <p style="margin: 5px 0;"><strong>Items Completed:</strong> ${completedItems} (${Math.round((completedItems/totalItems)*100)}%)</p>
            <p style="margin: 5px 0;"><strong>Items Passed:</strong> ${passedItems}</p>
            <p style="margin: 5px 0;"><strong>Items Failed:</strong> ${failedItems}</p>
            <p style="margin: 5px 0;"><strong>Optional Items:</strong> ${optionalItems}</p>
          </div>
          <p style="margin: 15px 0 5px 0; font-size: 18px;"><strong>Pass Rate: ${completedItems > 0 ? Math.round((passedItems/completedItems)*100) : 0}%</strong></p>
        </div>

        ${sectionsHTML}
      `;

      document.body.appendChild(tempDiv);

      // Convert to canvas with optimized settings for smaller file size
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true
      });

      // Remove temp div
      document.body.removeChild(tempDiv);

      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Compress the image data further
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality instead of PNG
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed (smart page breaks)
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Auto-download the PDF
      const fileName = `CRO-Audit-Report-${auditData.websiteUrl.replace(/[^a-zA-Z0-9]/g, '-')}-${auditData.date}.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Downloaded",
        description: "Your CRO audit report has been automatically downloaded with all images included.",
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const completedItems = sections.reduce((total, section) => 
    total + section.items.filter(item => item.status !== null).length, 0);
  const totalItems = sections.reduce((total, section) => total + section.items.length, 0);

  return (
    <Card className="audit-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Generate PDF Report</h3>
          <p className="text-muted-foreground">
            Create a professional PDF report with all audit findings, recommendations, and uploaded images.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Progress: {completedItems}/{totalItems} items completed ({Math.round((completedItems/totalItems)*100)}%)</p>
        </div>

        <Button 
          onClick={generatePDF}
          disabled={isGenerating || completedItems === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF Report
            </>
          )}
        </Button>

        {completedItems === 0 && (
          <p className="text-sm text-warning">
            Complete at least one audit item to generate a report.
          </p>
        )}
      </div>
    </Card>
  );
};