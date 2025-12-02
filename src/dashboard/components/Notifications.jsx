import React from 'react'
import { markNotificationAsRead, markAllNotificationAsRead } from '../../utils/Api'
import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'
import dayjs from 'dayjs'
import Divider from '@mui/material/Divider'
import Empty from './Empty'

const Notifications = ({ notifications, setNotifications }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleNotificationClick = async (notif, idx) => {
    if (!notif.is_read) {
      try {
        await markNotificationAsRead(notif.id)
        setNotifications(prev =>
          prev.map((n, i) => (i === idx ? { ...n, is_read: true } : n))
        )
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }
    window.location.href = notif.link
  }

  return (
    <div
      className="max-h-96 p-2 overflow-y-auto no-scrollbar shadow-lg rounded-lg"
      style={{ backgroundColor: colors.menu.primary }}
    >
      <h3
        className="text-lg p-4 font-semibold mb-3 flex justify-between items-center"
        style={{ color: colors.text.primary }}
      >
        Notifications
        {notifications.length > 0 && (
          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              color: colors.text.secondary,
            }}
          >
            Mark all as read
          </Button>
        )}
      </h3>

      {notifications.length > 0 ? (
        notifications.map((notif, idx) => (
          <React.Fragment key={notif.id}>
            <Box
              onClick={() => handleNotificationClick(notif, idx)}
              className="py-3 mb-2 mt-2  rounded-lg cursor-pointer transition duration-150"
              sx={{
                backgroundColor: notif.is_read
                  ? colors.menu.primary
                  : colors.menu.notifications,
                '&:hover': {
                  backgroundColor: colors.background.paper,
                },
              }}
            >
              <div className="text-sm px-4 flex flex-col">
                <span
                  className="font-semibold"
                  style={{
                    color: notif.is_read
                      ? colors.text.primary
                      : colors.text.secondary,
                    fontWeight: notif.is_read ? 'normal' : '',
                  }}
                >
                  {notif.message}
                </span>
                <span
                  className="text-xs mt-1 font-medium"
                  style={{
                    color: notif.is_read
                      ? colors.text.placeholder
                      : colors.text.secondary,
                  }}
                >
                  {dayjs(notif.created_at).format('MMM D, YYYY h:mm A')}
                </span>
              </div>
            </Box>
            {idx !== notifications.length - 1 && <span  >
              <Divider />

            </span> }
          </React.Fragment>
        ))
      ) : (
        <div className='w-full flex justify-center items-center'>
          <div className='w-1/4'>
            <Empty/>
            </div>
        </div>
      )}

    </div>
  )
}

export default Notifications
