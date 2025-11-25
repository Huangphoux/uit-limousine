import { useOutletContext } from "react-router-dom";

// Custom hook to easily access the notification context in child components
export function useNotificationContext() {
  return useOutletContext();
}