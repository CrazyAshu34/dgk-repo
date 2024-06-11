/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-useless-fragment */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
// form
import { useFieldArray, useFormContext } from 'react-hook-form';

import { firstLetterUppercase } from 'utils/utils';
// @mui
import { Box, Button, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
// utils
// components
import { RHFTextField } from '../../../../../components/hook-form';
import Iconify from '../../../../../components/iconify';

const customTitle = {
  0: 'First Text Field',
  1: 'Second Text Field',
  2: 'Third Text Field',
  3: 'Fourth Text Field',
  4: 'Fifth Text Field',
  5: 'Sixth Text Field',
  6: 'Seventh Text Field',
  7: 'Eighth Text Field',
  8: 'Nineth Text Field',
  9: 'Tenth Text Field',
  10: 'Eleventh Text Field',
  11: 'Twelveth Text Field',
  12: 'Thirteen Text Field',
  13: 'fourteen Text Field',
  14: 'fifteen Text Field',
  15: 'sixteen Text Field',
  16: 'seventeen Text Field',
};

AddVariants.propTypes = {
  onClose: PropTypes.func,
};

export default function AddVariants({ onClose }) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputFields.inputTextFields',
  });

  const values = watch();

  useEffect(() => {
    if (fields.length === 0) {
      append({
        title: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const handleAdd = () => {
    append({
      title: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const watchFieldArray = watch();
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Input Fields
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack
        divider={
          <Divider flexItem sx={{ borderStyle: 'dashed', mt: 2, p: 0, borderColor: 'red.500' }} />
        }
      >
        {controlledFields?.map((item, index) => (
          <>
            <Stack key={item?.id} direction="row" alignItems="center" justifyItems="center">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Stack
                    direction="row"
                    spacing={{
                      xs: 0,
                      md: 1,
                    }}
                  >
                    <Stack
                      sx={{
                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          my: 1,
                        }}
                      >
                        {customTitle[index]}
                      </Typography>

                      <RHFTextField
                        name={`inputFields.inputTextFields[${index}].title`}
                        size="small"
                        placeholder="Enter label name"
                        onInput={(e) => {
                          firstLetterUppercase(e);
                        }}
                      />
                    </Stack>

                    {index !== 0 && (
                      <IconButton
                        onClick={() => handleRemove(index)}
                        color="error"
                        sx={{
                          alignSelf: 'flex-end',
                        }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </>
        ))}
      </Stack>

      {/* Add more , reset and submit button */}
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mt: 3, justifyContent: 'space-between' }}
      >
        {fields?.length < 17 && (
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAdd}
            sx={{ flexShrink: 0 }}
          >
            {fields?.length === 0 ? 'Add Input Fields' : 'Add Another Input Fields'}
          </Button>
        )}

        <Stack
          direction="row"
          spacing={2}
          sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
        >
          <Button
            size="small"
            onClick={() => {
              resetField(`inputFields.inputTextFields`);
              onClose();
            }}
            variant="outlined"
            sx={{ flexShrink: 0 }}
          >
            Reset & Close
          </Button>

          <Button
            size="small"
            onClick={() => onClose()}
            variant="contained"
            sx={{ flexShrink: 0 }}
            disabled={
              values?.inputFields?.inputTextFields?.length > 0 && values?.inputFields?.inputTextFields?.some((item) => item?.title === '')
            }
          >
            Submit Input Fields
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
