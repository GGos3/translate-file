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
import { useToast } from "@/components/ui/use-toast";

export function FileTranslator() {
  const [files, setFiles] = useState<File[]>([]);
  const [wordList, setWordList] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [translatedFiles, setTranslatedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(uploadedFiles);

    if (uploadedFiles.length > 0) {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setTranslatedFiles(result.fileUrls);
          toast({
            description: "Files uploaded successfully!",
            variant: "success",
          });
        } else {
          const errorText = await response.text();
          console.error("File upload error:", errorText);
          throw new Error("File upload failed");
        }
      } catch (error) {
        toast({
          description: `Failed to upload files: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleTranslate = async () => {
    if (files.length === 0 || !selectedLanguage) {
      toast({
        description: "Please upload a file and select a language",
        variant: "destructive",
      });
      return;
    }

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", selectedLanguage);

      const response = await fetch("/api/translate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Translation API error:", errorText);
        throw new Error("Translation failed");
      }

      const result = await response.json();
      if (result.error) {
        console.error("Server error:", result.error);
        throw new Error(result.error);
      }

      setTranslatedFiles([result.fileUrl]);
    } catch (error) {
      toast({
        description: `Failed to translate the file: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = () => {
    translatedFiles.forEach((fileUrl) => {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl.split("/").pop() || "translated_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
              <Button variant="outline" size="sm" onClick={handleTranslate}>
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
                  placeholder="Enter Your Word list"
                  className="w-full"
                  rows={4}
                  value={wordList}
                  onChange={(event) => setWordList(event.target.value)}
                />
              </div>
              <div className="bg-card rounded-md p-4">
                <label
                  htmlFor="translate-to"
                  className="block text-sm font-medium mb-2"
                >
                  Translate To
                </label>
                <Select
                  value={selectedLanguage}
                  onValueChange={(value) => setSelectedLanguage(value)}
                >
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
              {translatedFiles.map((fileUrl, index) => (
                <div
                  key={index}
                  className="bg-card rounded-md p-4 flex flex-col items-center justify-center text-center overflow-hidden"
                >
                  <FileIcon className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium truncate max-w-full">
                    {fileUrl.split("/").pop()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download =
                        fileUrl.split("/").pop() || "translated_file";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
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
