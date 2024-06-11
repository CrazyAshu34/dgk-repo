import { Stack, TableCell, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Image from '../../../components/image';
import { useGetProductById } from '../../../services/productServices';

ProductEnquriesTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onOpenDialog: PropTypes.func,
};

export default function ProductEnquriesTableRow({ row, index, onOpenDialog }) {
  const { productId, name, contactNo, emailId, created_at, userType, variant } = row;

  const [productName, setProductName] = useState();
  const [pic, setPic] = useState();

  const [variantData, setVariantData] = useState();

  const { data, isLoading, isError } = useGetProductById(productId);

  useEffect(() => {
    if (data) {
      setProductName(data[0]?.title);
      setPic(data[0]?.images[0]?.values[0]?.url);
      setVariantData(variant);
    }
  }, [data, userType, variant]);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  if (isLoading) console.log('Loading...');
  if (isError) console.log('Error...');

  console.log(userType, 'data', data);
  let user_type = 'B2C';
  if (userType) {
    user_type = userType.toUpperCase();
  } else {
    user_type = 'B2C';
  }
  return (
    <TableRow hover>
      <TableCell align="left">{index + 1}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          alt={productName}
          src={pic}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog()}>
        {productName}
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog()}>
        {variantData ? variantData?.map((item, i) => (
          <Stack flexDirection="row" key={i}>
            <Typography>{`${capitalizeFirstLetter(item?.title)} : ${capitalizeFirstLetter(item?.value)}`} </Typography>
            {/* <Typography>{item?.value}</Typography> */}
          </Stack>
        )) : null}
      </TableCell>

      <TableCell sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog()}>
        {name}
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog()}>
        {contactNo}
      </TableCell>

      <TableCell align="left">{emailId}</TableCell>

      <TableCell align="left">{moment(created_at).format('DD MMM YYYY')}</TableCell>
    </TableRow>
  );
}
