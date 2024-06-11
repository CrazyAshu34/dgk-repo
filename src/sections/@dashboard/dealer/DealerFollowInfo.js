/* eslint-disable radix */ import { Card, Divider, Stack, Typography } from '@mui/material';

export default function DealerFollowInfo({ ...other }) {
  const { orderData } = other;

  const Array = [];
  orderData?.map((item) => Array.push(parseInt(item.ord_value)));

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{orderData?.length}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No. of Order
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          {Array?.length ? (
            <Typography variant="h4"> {Array.reduce((total, num) => total + num)}</Typography>
          ) : null}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total Oreder Value
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
