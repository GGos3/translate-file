"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileTranslator() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // 메모리 해제
  };

  const handleDownloadAll = () => {
    files.forEach((file) => {
      handleDownload(file);
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">File Translator</h1>
          <p className="text-muted-foreground mb-6">
            Translate your files to different languages in one place.
          </p>
          <div className="bg-muted rounded-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload Files</h2>
              <Label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              >
                Add Files
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
              </Label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-card rounded-md p-4 flex flex-col items-center justify-center text-center overflow-hidden"
                >
                  <FileIcon className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium truncate max-w-full">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted rounded-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Translate Options</h2>
              <Button variant="outline" size="sm">
                Translate
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-md p-4">
                <label
                  htmlFor="text-to-translate"
                  className="block text-sm font-medium mb-2"
                >
                  Text to Translate
                </label>
                <Textarea
                  id="text-to-translate"
                  placeholder="Enter text to translate"
                  className="w-full"
                  rows={4}
                />
              </div>
              <div className="bg-card rounded-md p-4">
                <label
                  htmlFor="translate-to"
                  className="block text-sm font-medium mb-2"
                >
                  Translate To
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Download Translated Files
              </h2>
              <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                Download All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-card rounded-md p-4 flex flex-col items-center justify-center text-center overflow-hidden"
                >
                  <FileIcon className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium truncate max-w-full">
                    {file.name}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
