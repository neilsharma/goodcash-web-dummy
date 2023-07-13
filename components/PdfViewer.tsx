import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import Button from "./Button";
import LoadingPDFIndicator from "./LoadingPDFIndicator";
import { isAndroid, isIOS } from "react-device-detect";

const PDFViewer = ({ url }: { url: string }) => {
  const pdfUrl = url;
  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (isAndroid || isIOS)
    return (
      <>
        <div className="bg-white w-[90vw] h-[40vh] overflow-scroll mt-5">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={() => <LoadingPDFIndicator />}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
        <div className="mt-4">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <div className="flex flex-row gap-4">
            <Button
              className="mt-12"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </Button>
            <Button
              className="mt-12"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </>
    );

  return <iframe src={url} className="w-full h-96 my-10" allowFullScreen />;
};

export default PDFViewer;
