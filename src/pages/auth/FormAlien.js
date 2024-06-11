import React from 'react';
import { Box, Typography, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Mytable = () => {
  const [formSubmissions, setFormSubmissions] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [formDataToUpdate, setFormDataToUpdate] = React.useState(null);

  React.useEffect(() => {
    const dataString = localStorage.getItem('formSubmissions');
    const storedSubmissions = dataString ? JSON.parse(dataString) : [];
    setFormSubmissions(storedSubmissions);
  }, []);

  const handleEdit = (index) => {

  };

  const handleUpdate = (updatedFormData) => {
    const updatedSubmissions = [...formSubmissions];
    updatedSubmissions[selectedIndex] = updatedFormData;
    setFormSubmissions(updatedSubmissions);
    localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
    setSelectedIndex(null);
    setFormDataToUpdate(null);
    alert('Data updated successfully!');
  };

  const handleDelete = (index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this entry?');
    if (isConfirmed) {
      const updatedSubmissions = [...formSubmissions];
      updatedSubmissions.splice(index, 1);
      setFormSubmissions(updatedSubmissions);
      localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
      alert('Data deleted successfully!');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', marginTop: '100px' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Submitted Data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formSubmissions.map((formData, index) => (
              <TableRow key={index}>
                <TableCell>{formData.name}</TableCell>
                <TableCell>{formData.contact}</TableCell>
                <TableCell>{formData.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Render FormAlien component for editing */}
      {selectedIndex !== null && formDataToUpdate && (
        <FormAlien editData={formDataToUpdate} onUpdate={handleUpdate} />
      )}
    </Box>
  );
};

export default Mytable;
