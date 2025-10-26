import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const NotificationListener = () =>  {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      setNotification(payload.notification);
    });
    return unsubscribe;
  }, []);

  return (
    notification && (
      <div className="notification-popup">
        <strong>{notification.title}</strong>
        <p>{notification.body}</p>
      </div>
    )
  );
}


export defult 