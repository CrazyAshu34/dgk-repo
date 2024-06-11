/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-useless-fragment */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from '../../../../utils/axios';
// form
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import {
    firstLetterUppercase
} from 'utils/utils';
// @mui
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
// utils 
// components vvv
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { RHFTextField } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
import CheckboxAutocomplete from './ColorAutocompleteCheckbox';
// ----------------------------------------------------------------------
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
AddColorVariants.propTypes = {
    onClose: PropTypes.func,
    isEdit: PropTypes.bool,
};

export default function AddColorVariants({ onClose, isEdit }) {
    const { control, setValue, watch, resetField } = useFormContext();
    const { trigger } = useForm();
    const [variantOptionsValue, setVariantOptionsValue] = useState([]);
    const [selectedValue, setSelectedValue] = useState('a');
    const [selectValues, setSelectValues] = useState([]);
    const [openColorVariant, setOpenColorVariant] = useState(false);
    const [submitButton, setSubmitButton] = useState(false);
    const [allColorFamilies, setAllColorFamilies] = useState([]);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'color',
    });

    const values = watch();

    useEffect(() => {
        if (fields.length === 0) {
            append({
                title: '',
            });
            // setValue('leadVariant', 'Color');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValue]);
    // Regular expression for validating hexadecimal color codes
    const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$|^#([0-9A-Fa-f]{4}){1,2}$/;
    useEffect(() => {
        if (values?.color && values?.color?.some((item) => item?.title === '' || item?.title == undefined)) {
            setSubmitButton(true);
        }
        else if (values?.color && values?.color?.some((item) => hexColorRegex.test(item?.title) === false)) {
            setSubmitButton(true);
        }
        else if (values?.color && values?.color?.some((item) => item?.families?.length === 0 || !item?.families)) {
            setSubmitButton(true);
        }
        else {
            setSubmitButton(false)
        }
    }, [values, values?.color]);
    useEffect(() => {
        if (isEdit) {
            const colorVariantIndex = values.variants.findIndex(variant => variant.title?.toLowerCase() === "color");
            if (colorVariantIndex !== -1) {
                // values.variants[colorVariantIndex]?.options?.map((item => item))
                setValue('color', values.variants[colorVariantIndex]?.colorFamilies);
            }
        }
    }, [isEdit]);
    const getColorFamilies = async () => {
        const colorfamilies = await axios.get(
            `${process.env.REACT_APP_HOST_API_KEY}/colorfamilies/all`
        );
        if (colorfamilies) {
            setAllColorFamilies(colorfamilies?.data?.data);
        }
        console.log("colorfamilies=", colorfamilies)
    }
    useEffect(() => {
        const colorVariantIndex = values.variants.findIndex(variant => variant.title?.toLowerCase() === "color");
        if (colorVariantIndex !== -1) {
            const colorsFamilies = values.variants[colorVariantIndex].colorFamilies?.map((color => color?.families));
            if (colorsFamilies) {
                setSelectValues(colorsFamilies);
            }
        }
        getColorFamilies();
    }, []);
    const handleAdd = () => {
        if (fields.length === 0) {
            append({
                title: '',
            });
            // setValue('leadVariant', 'Color');
        } else {
            append({
                title: '',
            });
        }
    };

    const handleRemove = (index) => {
        // console.log(values?.leadVariant, "deleteindex=", values?.variants[index]?.title);
        remove(index);
        // if (values?.leadVariant === values?.variants[index]?.title) {
        //     setValue('leadVariant', '');
        // }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleAddColor = () => {
        // Find the index of the "color" variant
        const colorVariantIndex = values.variants.findIndex(variant => variant.title?.toLowerCase() === "color");
        // Update the "color" variant
        if (colorVariantIndex !== -1) {
            values.variants[colorVariantIndex].options = values.color.map(family => family.title);
            values.variants[colorVariantIndex].colorFamilies = values.color;
        }
        setValue('variants', values.variants);
        onClose();
    }
    const handleOpenColorVariant = () => {
        setOpenColorVariant(true);
    }
    // console.log('fields', fields);

    const watchFieldArray = watch('variants');
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });
    const handleSelectChange = (index, selectedOptions) => {
        const updatedValues = [...selectValues];
        updatedValues[index] = selectedOptions;
        setSelectValues(updatedValues);
        setValue(`color[${index}].families`, selectedOptions)

    };
    const handleResetColor = () => {

        if (isEdit) {
            const colorVariantIndex = values.variants.findIndex(variant => variant.title?.toLowerCase() === "color");
            if (colorVariantIndex !== -1) {
                // values.variants[colorVariantIndex]?.options?.map((item => item))
                setValue('color', values.variants[colorVariantIndex]?.colorFamilies);
            }
        } else {
            resetField(`color`);
            setSelectValues([]);
            // Find the index of the "color" variant
            const colorVariantIndex = values.variants.findIndex(variant => variant.title?.toLowerCase() === "color");
            // Update the "color" variant
            if (colorVariantIndex !== -1) {
                values.variants[colorVariantIndex].options = [];
                values.variants[colorVariantIndex].colorFamilies = [];
                setValue('variants', values.variants);
            }
        }
        onClose();
    }
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Add Color Variants
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
                                    <Stack>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                my: 1,
                                            }}
                                        >
                                            Hexa Code
                                        </Typography>
                                        {/* Don't Remove this console it will not update the current fields till find other solution */}
                                        {// console.log(values)
                                        }
                                        <RHFTextField style={{ backgroundColor: values?.color ? hexColorRegex.test(values?.color[index]?.title) ? values?.color[index]?.title : null : null }}
                                            name={`color[${index}].title`}
                                            size="small"
                                            placeholder={index === 0 ? 'E.g. #FF5733' : 'E.g. #FF5733'}
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
                                            Color Family
                                        </Typography>
                                        <CheckboxAutocomplete
                                            options={allColorFamilies}
                                            name={`color[${index}].families`}
                                            selectedOptions={selectValues ? selectValues[index] : []}
                                            handleSelectChange={selectedOptions => handleSelectChange(index, selectedOptions)}
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
                {//fields?.length < 3 && (
                    <Button
                        size="small"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleAdd}
                        sx={{ flexShrink: 0 }}
                    >
                        {fields?.length === 0 ? 'Add Color Variant' : 'Add Another Color Variant'}
                    </Button>
                    // )
                }
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
                >
                    <Button
                        size="small"
                        onClick={() => {
                            handleResetColor();
                        }}
                        variant="outlined"
                        sx={{ flexShrink: 0 }}
                    >
                        Reset & Close
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {

                            handleAddColor();
                        }}
                        variant="contained"
                        sx={{ flexShrink: 0 }}
                        disabled={submitButton}
                    >
                        Submit Variant
                    </Button>
                </Stack>
            </Stack>

        </Box>
    );
}
