// import React from 'react';
// import swal from 'sweetalert';
// import { userRequest } from 'src/requestMethod';
// import Iconify from 'src/components/iconify';
// import { IconButton } from '@mui/material';


// const ActionButtons = ({ userId, onDelete }) => {

//   const handleDelete = async () => {
//     try {
//       await userRequest.put(`/admin/updateAdmin?id=${userId}`);
//     //   await userRequest.put(`/admin/updateAdmin?id=${userId}`, { status: 'false' });
//       swal("Deleted!", "User has been deleted.", "success");
//       onDelete(); 
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       swal("Error", "Error deleting user. Please try again later.", "error");
//     }
//   };

//   return (
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <IconButton color="error" onClick={handleDelete}>
//         <Iconify icon="eva:trash-2-outline" />
//       </IconButton>
//     </div>
//   );
// };

// export default ActionButtons;



import React from 'react';
import swal from 'sweetalert';
import { userRequest } from 'src/requestMethod';
import Iconify from 'src/components/iconify';
import { IconButton } from '@mui/material';

const ActionButtons = ({ userId, onDelete }) => {

  const handleDelete = async () => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      try {
      await userRequest.delete(`/admin/deleteAdmin?id=${userId}`, { deleted: 'true' });
        swal("Deleted!", "User has been deleted.", "success");
        onDelete(); 
      } catch (error) {
        console.error('Error deleting user:', error);
        swal("Error", "Error deleting user. Please try again later.", "error");
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <IconButton color="error" onClick={handleDelete}>
        <Iconify icon="eva:trash-2-outline" />
      </IconButton>
    </div>
  );
};

export default ActionButtons;
