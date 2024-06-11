import { LoadingButton } from '@mui/lab';
import { Box, InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import Iconify from '../../../components/iconify';

BannerToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  headers: PropTypes.array,
  getDownload: PropTypes.array,
};

export default function BannerToolbar({ filterName, onFilterName, headers, getDownload }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: '500px',
            lg: '500px',
          },
        }}
      >
        <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search by Banner Title"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <CSVLink
        data={getDownload}
        headers={headers}
        filename="Banner_List.csv"
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <LoadingButton type="submit" variant="contained" size="" sx={{ py: 2, px: 2 }}>
          Excel
        </LoadingButton>
      </CSVLink>
    </Stack>
  );
}

/* eslint-disable import/order */
// import { Box, CardActionArea, InputAdornment, Stack, TextField, Typography } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import PropTypes from 'prop-types';
// import { CSVLink } from 'react-csv';
// import Iconify from '../../../components/iconify';

// BannerToolbar.propTypes = {
//   filterName: PropTypes.string,
//   onFilterName: PropTypes.func,
//   headers: PropTypes.array,
//   getDownload: PropTypes.array,
// };

// export default function BannerToolbar({ filterName, onFilterName, headers, getDownload }) {
//   console.log('GETDOWNLOAD', headers, getDownload);
//   return (
//     <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
//       <Box
//         sx={{
//           width: {
//             xs: '100%',
//             sm: '100%',
//             md: '500px',
//             lg: '500px',
//           },
//         }}
//       >
//         <TextField
//           fullWidth
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search by Banner Title"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//       <CSVLink
//         data={getDownload}
//         headers={headers}
//         filename="Customer_List.csv"
//         target="_blank"
//         style={{ textDecoration: 'none' }}
//       >
//         {/* <LoadingButton type="submit" variant="contained" size="" sx={{ py: 2, px: 2 }}>
//        Excel
//        </LoadingButton> */}
//         <CardActionArea
//           sx={{
//             p: 1,
//             borderRadius: 1,
//             cursor: 'pointer',
//             color: 'text.secondary',
//             border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
//           }}
//         >
//           <Stack spacing={0.5} direction="row" alignItems="center">
//             {/* <FileThumbnail /> */}

//             <Typography variant="body2">exaL</Typography>
//           </Stack>
//         </CardActionArea>{' '}
//       </CSVLink>
//     </Stack>
//   );
// }
