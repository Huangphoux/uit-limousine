import { useState } from "react";

export const useResourceDownload = (onResourceDeleted) => {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("accessToken");

  const handleDownloadResource = async (e, lessonId, resourceId, filename) => {
    if (e) e.preventDefault();

    alert(`Downloading: ${filename}\nLessonId: ${lessonId}\nResourceId: ${resourceId}`);

    console.log("[Download] Starting download:", {
      lessonId,
      resourceId,
      filename,
      timestamp: new Date().toISOString(),
    });

    setDownloading(true);
    try {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/resources/${resourceId}`;
      console.log("[Download] Fetching from URL:", downloadUrl);

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[Download] Response status:", response.status);
      console.log("[Download] Response headers:", Object.fromEntries(response.headers.entries()));

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        console.log(
          `[Download] File size from server: ${(parseInt(contentLength) / 1024 / 1024).toFixed(2)} MB`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Download] Error response:", errorData);

        if (response.status === 404) {
          throw new Error("File not found. It may have been deleted.");
        }
        throw new Error(errorData.message || errorData.data || "Failed to download file");
      }

      console.log("[Download] Loading file data from server...");
      const blob = await response.blob();
      console.log("[Download] Blob received:", {
        size: blob.size,
        type: blob.type,
        sizeMB: (blob.size / 1024 / 1024).toFixed(2) + " MB",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("[Download] Success! File downloaded:", filename);
    } catch (error) {
      console.error("[Download] Download error:", error);
      console.error("[Download] Error stack:", error.stack);
      alert(`Failed to download file: ${error.message}`);
    } finally {
      setDownloading(false);
      console.log("[Download] Download completed/failed");
    }
  };

  const handleDeleteResource = async (resourceId, filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      // Since there's no direct DELETE endpoint, we need to remove it from the lesson
      // This will be handled through the comprehensive update when saving the lesson
      if (onResourceDeleted) {
        onResourceDeleted(resourceId);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete file: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return { handleDownloadResource, handleDeleteResource, downloading, deleting };
};
