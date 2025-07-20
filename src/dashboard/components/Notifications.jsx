import React, { useEffect, useState } from 'react'
import { fetchAllNotifications, markNotificationAsRead } from '../../utils/Api'
import {Box} from '@mui/material'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'
import dayjs from 'dayjs'
import Divider from '@mui/material/Divider'


const Notifications = ({ notifications, setNotifications }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

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

   window.location.href = notif.link

  }

  return (
    <div className=" max-h-96 overflow-y-auto no-scrollbar shadow-lg rounded-lg" style={{ backgroundColor: colors.menu.primary }}>
      <h3 className="text-lg p-4 font-semibold mb-3" style={{ color: colors.text.primary }}>
        Notifications
      </h3>
      <>

       {notifications.length > 0 ? (
  notifications.map((notif, idx) => (

  <React.Fragment key={notif.id}>
    <Box
      onClick={() => handleNotificationClick(notif, idx)}
      className=" py-3 mb-2 cursor-pointer transition duration-150"
      sx={{
        backgroundColor: notif.is_read ? colors.menu.primary : colors.background.default,
        '&:hover': {
          backgroundColor: colors.background.paper
        },
      }}
    >
      <div className="text-sm px-4 flex flex-col">
        <span className='font-semibold' style={{ color: notif.is_read ? colors.text.primary : colors.text.secondary, fontWeight: notif.is_read ? 'normal' : '',}}>
          {notif.message}
        </span>
        <span className="text-xs mt-1 font-medium" style={{ color: notif.is_read ? colors.text.placeholder : colors.text.secondary }}>
          {dayjs(notif.created_at).format('MMM D, YYYY h:mm A')}
        </span>
      </div>
    </Box>
    {idx !== notifications.length - 1 && <Divider />}
  </React.Fragment>
))

      ) : (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      )}
      
      </>
    
    </div>
  )
}

export default Notifications
