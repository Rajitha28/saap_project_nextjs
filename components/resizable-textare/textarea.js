import React, { useState, useRef  } from 'react';
import Form from 'react-bootstrap/Form';

const ResizableTextarea = ({ placeholder, maxLength, initialRows,handleChange }) => {
 
  const textareaRef = useRef(null);

  return (
    <Form.Control
      as="textarea"
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default ResizableTextarea;
