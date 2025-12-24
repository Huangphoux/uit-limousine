import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import useNotifications from "../hooks/useNotifications";
import NotificationPanel from "../components/NotificationPanel";

const NewPageLayout = ({ children }) => {
  const notificationProps = useNotifications();

  return (
    <>
      <Header
        unreadCount={notificationProps.unreadCount}
        onBellClick={notificationProps.openPanel}
      />
      <Container className="mt-5 pt-5">
        {children ? (
          // Render children when NewPageLayout is used as a wrapper
          children
        ) : (
          // Default behavior for route nesting
          <Outlet context={notificationProps} />
        )}
      </Container>

      {/* Notification Panel is now managed by the layout */}
      <NotificationPanel
        isOpen={notificationProps.isOpen}
        onClose={notificationProps.closePanel}
        notifications={notificationProps.notifications}
        onMarkAllRead={notificationProps.markAllRead}
        onDeleteAll={notificationProps.deleteAll}
        onDeleteOne={notificationProps.deleteOne}
      />
    </>
  );
};

export default NewPageLayout;
