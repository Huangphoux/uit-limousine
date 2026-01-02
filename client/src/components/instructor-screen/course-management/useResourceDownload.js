import { useState } from "react";

export const useResourceDownload = (onResourceDeleted) => {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("accessToken");

  const handleDownloadResource = async (e, lessonId, resourceId, filename) => {
    if (e) e.preventDefault();

    setDownloading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/resources/${resourceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error("File not found. It may have been deleted.");
        }
        throw new Error(errorData.message || "Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download file: ${error.message}`);
    } finally {
      setDownloading(false);
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
