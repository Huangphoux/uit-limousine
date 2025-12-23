import { useOutletContext } from "react-router-dom";

// Custom hook to easily access the notification context in child components
// This wraps useOutletContext in a try/catch to return an empty object when
// no Outlet context is available so it is safe to call unconditionally.
export function useNotificationContext() {
  try {
    return useOutletContext();
  } catch (e) {
    console.log(e);
    return {};
  }
}
