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
  0: 'First Image Field',
  1: 'Second Image Field',
  2: 'Third Image Field',
  3: 'Fourth Image Field',
  4: 'Fifth Image Field',
  5: 'Sixth Image Field',
  6: 'Seventh Image Field',
  7: 'Eighth Image Field',
  8: 'Nineth Image Field',
  9: 'Tenth Image Field',
  10: 'Eleventh Image Field',
  11: 'Twelveth Image Field',
  12: 'Thirteen Image Field',
  13: 'fourteen Image Field',
  14: 'fifteen Image Field',
  15: 'sixteen Image Field',
  16: 'seventeen Image Field',
};

AddImageFields.propTypes = {
  onClose: PropTypes.func,
};

export default function AddImageFields({ onClose }) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputFields.inputImageFields',
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
        Add Image Fields
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
                        name={`inputFields.inputImageFields[${index}].title`}
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
            {fields?.length === 0 ? 'Add Image Fields' : 'Add Another Image Fields'}
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
              resetField(`inputFields.inputImageFields`);
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
              values?.inputFields?.inputImageFields?.length > 0 && values?.inputFields?.inputImageFields?.some((item) => item?.title === '')
            }
          >
            Submit Image
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
