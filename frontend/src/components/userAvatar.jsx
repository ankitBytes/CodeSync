// src/components/common/UserAvatar.jsx
import React from 'react';
import { Avatar, Tooltip } from '@mui/material';

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
};

const getInitials = (name) => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
};

const UserAvatar = ({ name = '', src = '', size = 40, status }) => (
  <Tooltip title={name}>
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        bgcolor: !src && stringToColor(name),
        border: status === 'online' ? '2px solid green' : undefined,
      }}
    >
      {!src && getInitials(name)}
    </Avatar>
  </Tooltip>
);

export default UserAvatar;
