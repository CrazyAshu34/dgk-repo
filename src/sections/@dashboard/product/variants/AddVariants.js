/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-useless-fragment */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// form
import Radio from '@mui/material/Radio';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import {
  allLettersUppercase,
  firstLetterUppercase,
  specialCharactersNotAllowed,
} from 'utils/utils';
// @mui
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Stack, Typography } from '@mui/material';
// utils 
// components
import { RHFAutocomplete, RHFTextField } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
import AddColorVariants from './AddColorVariants';

// ----------------------------------------------------------------------

AddVariants.propTypes = {
  onClose: PropTypes.func,
  generateOnlineStockTable: PropTypes.func,
  isEdit: PropTypes.bool,
};

export default function AddVariants({ onClose, generateOnlineStockTable, isEdit }) {
  const { control, setValue, watch, resetField } = useFormContext();
  const { trigger } = useForm();
  const [variantOptionsValue, setVariantOptionsValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState('a');
  const [openColorVariant, setOpenColorVariant] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const values = watch();

  useEffect(() => {
    if (fields.length === 0) {
      append({
        title: 'Color',
        options: [],
      });
      setValue('leadVariant', 'Color');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);
  useEffect(() => {

    if (values?.variants?.length === 0) {
      setSubmitButton(false);
    } else if (values?.leadVariant === '') {
      setSubmitButton(true);
    }
    else if (values?.variants?.some((item) => item?.title === '')) {
      setSubmitButton(true);
    } else if (values?.variants?.some((item) => item?.options?.length === 0)) {
      setSubmitButton(true);
    }
    else {
      setSubmitButton(false)
    }
  }, [values, values?.variants, values?.leadVariant]);

  const handleAdd = () => {
    if (fields.length === 0) {
      append({
        title: 'Color',
        options: [],
      });
      setValue('leadVariant', 'Color');
    } else {
      append({
        title: '',
        options: [],
      });
    }
  };

  const handleRemove = (index) => {
    console.log(values?.leadVariant, "deleteindex=", values?.variants[index]?.title);
    remove(index);
    if (values?.leadVariant === values?.variants[index]?.title) {
      setValue('leadVariant', '');
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // console.log('fields', fields);

  const watchFieldArray = watch('variants');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });
  console.log(submitButton, values?.leadVariant, "variantss==", values?.variants.length);

  function rgbaToHex(rgba) {
    // Extract individual RGB and alpha values from the RGBA string
    const [r, g, b, a] = rgba.match(/\d+(\.\d+)?/g).map(Number);

    // Convert RGB to HEX
    const redHex = r.toString(16).padStart(2, '0');
    const greenHex = g.toString(16).padStart(2, '0');
    const blueHex = b.toString(16).padStart(2, '0');

    // Convert alpha to HEX (if needed)
    let alphaHex = '';
    if (a !== 1) {
      alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
    }

    // Combine the values
    const hexColor = `#${redHex}${greenHex}${blueHex}${alphaHex}`;

    return hexColor.toUpperCase(); // Optionally convert to uppercase for consistent output
  }
  const handleOpenColorVariant = (title) => {
    console.log("title=", title)
    if (title && title !== "") {
      if (title?.toLowerCase() == "color") {
        setOpenColorVariant(true);
      }
    }
  }
  function extractHexColorsFromString(inputString) {
    const hexColorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;
    const hexColors = inputString.match(hexColorRegex);
    return hexColors || [];
  }
  const getOptionLabel = (option) => {
    const bgColor = extractHexColorsFromString(option);
    console.log("bgColor=", bgColor);
    return (
      <div>
        {bgColor && bgColor?.length > 0 ? (
          <div
            style={{
              backgroundColor: bgColor,
              padding: '2px 8px',
              borderRadius: '1.5px',
              height: '15px',
              width: '15px',
              float: 'left',
              marginTop: '3px'
            }}
          ></div>
        ) : null}
        <div style={{ marginLeft: '8px', paddingLeft: '18px' }}>{option}</div>
      </div>
    );
  };
  console.log("values=", values);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Variants
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack
        divider={
          <Divider flexItem sx={{ borderStyle: 'dashed', m: 0, p: 0, borderColor: 'red.500' }} />
        }
      // spacing={1}
      >
        {controlledFields?.map((item, index) => (
          <>
            <Stack key={item?.id} direction="row" alignItems="center" justifyItems="center">
              <Stack
                direction="row"
                spacing={{
                  xs: 0,
                  md: 2,
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridGap: 2,
                  my: 2,
                }}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Radio
                    checked={values?.leadVariant === item?.title}
                    onChange={(event) => {
                      //     console.log('EVERNT', event.target);
                      trigger();
                      setValue('leadVariant', event.target.value);
                    }}
                    value={item?.title}
                    name="leadVariant"
                    sx={{
                      color: 'primary.main',
                      m: 0,
                      p: 0,
                      mt: 5.5,
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <Stack>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        my: 1,
                      }}
                    >
                      Variant Name
                    </Typography>
                    {/* Don't Remove this console it will not update the current fields till find other solution */}
                    {// console.log(values)
                    }
                    <RHFTextField
                      name={`variants[${index}].title`}
                      size="small"
                      placeholder={index === 0 ? 'E.g. Color' : 'E.g. Size'}
                      onInput={(e) => {
                        console.log('TRIGGER');
                        firstLetterUppercase(e);
                      }}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    gridColumn: 'span 2',
                    w: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flex: 1,
                  }}
                  onClick={() => handleOpenColorVariant(values?.variants[index]?.title)}
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
                      Variant Options
                    </Typography>
                    <RHFAutocomplete
                      name={`variants[${index}].options`}
                      size="small"
                      placeholder={
                        values.variants[index]?.options?.length === 0
                          ? `${index === 0 ? 'E.g. Red, Green, Blue etc.' : 'E.g. S, L, M, XL etc.'
                          } `
                          : ''
                      }
                      multiple
                      freeSolo
                      fullWidth
                      onInput={(event) => {
                        // special characters are not allowed
                        specialCharactersNotAllowed(event);
                        allLettersUppercase(event);
                      }}
                      options={variantOptionsValue?.map((option) => option)}
                      getOptionLabel={getOptionLabel}
                      ChipProps={{ size: 'small' }}
                      InputProps={{
                        readOnly: true,
                      }}
                    // onInputChange={handleOpenColorVariant}
                    />
                    {/* } */}
                  </Stack>
                  {(index !== 0 || isEdit) && (
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
              </Stack>
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
        {fields?.length < 3 && (
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAdd}
            sx={{ flexShrink: 0 }}
          >
            {fields?.length === 0 ? 'Add Variant' : 'Add Another Variant'}
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
              resetField(`variants`);
              setValue('leadVariant', '');
              onClose(); generateOnlineStockTable(values, 'indirect');
            }}
            variant="outlined"
            sx={{ flexShrink: 0 }}
          >
            Reset & Close
          </Button>
          <Button
            size="small"
            onClick={() => { onClose(); generateOnlineStockTable(values, 'indirect') }}
            variant="contained"
            sx={{ flexShrink: 0 }}
            // disabled={
            //   values?.variants?.length === 0 || (values?.leadVariant === '' ||
            //     (values?.variants?.length > 0 &&
            //       values?.variants?.some((item) => item?.title === '')) ||
            //     (values?.variants?.length > 0 &&
            //       values?.variants?.some((item) => item?.options?.length === 0)))
            // }
            disabled={submitButton}
          >
            Submit Variant
          </Button>
        </Stack>
      </Stack>
      <Dialog
        fullWidth
        maxWidth="sm"
        style={{ height: '100%', }}
        open={openColorVariant}
        // onClose={() => {
        //   setOpenVariant(false);
        // }}
        aria-labelledby="form-dialog-title"
        style={{
          zIndex: 9998, // Set an appropriate z-index value
        }}
      >
        <DialogContent style={{
          zIndex: 9998, // Set an appropriate z-index value
        }} >
          {/* <AddVariants
                    onClose={() => {
                      setOpenVariant(false);
                    }}
                    generateOnlineStockTable={generateOnlineStockTable}
                    isEdit={isEdit}

                  /> */}
          <AddColorVariants onClose={() => {
            setOpenColorVariant(false);
          }}
            //  generateOnlineStockTable={generateOnlineStockTable}
            isEdit={isEdit} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
