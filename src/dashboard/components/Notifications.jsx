import React, { useEffect, useState } from 'react'
import { fetchAllNotifications, markNotificationAsRead } from '../../utils/Api'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'
import dayjs from 'dayjs'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const data = await fetchAllNotifications()
        setNotifications(data)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotificationsData()
  }, [])

  const handleNotificationClick = async (notif, idx) => {
    if (!notif.is_read) {
      try {
        await markNotificationAsRead(notif.id)
        setNotifications((prev) =>
          prev.map((n, i) => (i === idx ? { ...n, is_read: true } : n))
        )
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }

    window.open(notif.link, '_blank') // Open in new tab
  }

  return (
    <div className="p-4 max-h-96 overflow-y-auto shadow-lg rounded-lg " style={{ backgroundColor: colors.background.default }}>
      <h3 className="text-lg font-bold mb-3" style={{ color: colors.text.primary }}>
        Notifications
      </h3>
      {notifications.length > 0 ? (
        notifications.map((notif, idx) => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif, idx)}
            className={`rounded-lg px-4 py-3 mb-2 cursor-pointer transition duration-150`}
            style={{
              backgroundColor: notif.is_read ? colors.primary[100] : colors.primary[200],
              color: notif.is_read ? colors.text.secondary : colors.text.primary,
              fontWeight: notif.is_read ? 'normal' : 'bold',
              borderLeft: `4px solid ${colors.primary[400]}`
            }}
          >
            <div className="text-sm flex flex-col">
              <span>{notif.message}</span>
              <span className="text-xs mt-1" style={{ color: colors.text.secondary }}>
                {dayjs(notif.created_at).format('MMM D, YYYY h:mm A')}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      )}
    </div>
  )
}

export default Notifications
