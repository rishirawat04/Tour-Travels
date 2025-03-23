import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const SideNavigation = ({ sections, onNavigate }) => {
  return (
    <List>
      {sections.map((section) => (
        <ListItem button key={section.id} onClick={() => onNavigate(section.id)}>
          <ListItemText primary={section.label} />
        </ListItem>
      ))}
    </List>
  );
};

export default SideNavigation;
