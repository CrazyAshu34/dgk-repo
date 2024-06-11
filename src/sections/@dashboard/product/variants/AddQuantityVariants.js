import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, useFieldArray } from 'react-hook-form';
import { allowOnlyNumbers } from 'utils/inputValidation';
import { onlyNumbersAllowed, specialCharactersNotAllowed } from 'utils/utils';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material';
// utils
// components
import Iconify from '../../../../components/iconify';
import { RHFAutocomplete, RHFSelect, RHFTextField } from '../../../../components/hook-form';

AddQuantityVariants.propTypes = {
  onClose: PropTypes.func,
};

export default function AddQuantityVariants({ onClose }) {
  const { control, setValue, watch, resetField } = useFormContext();
  const [variantOptions, setVariantOptions] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quantityVariants',
  });
  const values = watch();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Quantity Variants
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack
        divider={
          <Divider flexItem sx={{ borderStyle: 'dashed', m: 0, p: 0, borderColor: 'red.500' }} />
        }
        spacing={1}
      >
        <Stack>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Enter Quantity (Max 5)
          </Typography>
          <RHFAutocomplete
            name="quantityVariants"
            size="small"
            placeholder={values?.quantityVariants?.length === 0 ? 'Enter Quantity' : ''}
            multiple
            freeSolo
            fullWidth
            options={variantOptions}
            onInput={(e, value) => {
              if (values?.quantityVariants?.length < 5) {
                onlyNumbersAllowed(e);
                specialCharactersNotAllowed(e);
              } else {
                e.target.value = '';
              }
            }}
            ChipProps={{ size: 'small' }}
          />
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mt: 3, justifyContent: 'space-between' }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
        >
          <Button
            size="small"
            onClick={() => {
              resetField(`quantityVariants`);
              onClose();
            }}
            variant="outlined"
            sx={{ flexShrink: 0 }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={() => {
              onClose();
            }}
            variant="contained"
            sx={{ flexShrink: 0 }}
            disabled={values?.quantityVariants?.length === 0}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
