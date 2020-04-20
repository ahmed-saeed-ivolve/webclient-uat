import { Button, message, notification } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../config/defaultSettings';
const { pwa } = defaultSettings;

if (pwa) {
 
  window.addEventListener('sw.offline', () => {
    message.warning(
      formatMessage({
        id: 'app.pwa.offline',
      }),
    );
  });

  window.addEventListener('sw.updated', event => {
    const e = event;

    const reloadSW = async () => {
     
     
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      }

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      });

      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {formatMessage({
          id: 'app.pwa.serviceworker.updated.ok',
        })}
      </Button>
    );
    notification.open({
      message: formatMessage({
        id: 'app.pwa.serviceworker.updated',
      }),
      description: formatMessage({
        id: 'app.pwa.serviceworker.updated.hint',
      }),
      btn,
      key,
      onClose: async () => { },
    });
  });
} else if ('serviceWorker' in navigator) {
 
  navigator.serviceWorker.ready
    .then(registration => {
      registration.unregister();
      return true;
    })
    .catch(() => {
      
    });
}
