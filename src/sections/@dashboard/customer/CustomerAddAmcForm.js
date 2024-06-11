import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Divider, Grid, MenuItem, Stack, TextField, Autocomplete, Checkbox, Box } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import BlankPage from 'pages/dashboard/BlankPage';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import api from 'services/api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { allowOnlyNumbers } from 'utils/inputValidation';
import { useCreateAmc } from 'services/amcServices';
import { useGetAllActivProducts } from 'services/productServices';
import { useGetAllServiceCategories } from 'services/servicecategoryServices';

import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
// import AppTopRelated from '../service/AppTopRelated';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

StaffAddForm.propTypes = {
    id: PropTypes.string,
};

const header = {
    'Content-Type': 'multipart/form-data',
};

export default function StaffAddForm({ id }) {
    const navigate = useNavigate();
    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = currentDate.getMonth();
    // const day = currentDate.getDate();
    // const finalDate = new Date(year + 2, month, day);

    const [validDate, setValidDate] = useState('');
    const [invoiceFile, setInvoiceFile] = useState('');
    const [invoiceFileErr, setInvoiceFileErr] = useState('');
    const { createAmc, isLoading: updateProductAmcIsLoading } = useCreateAmc();
    const {
        data: productdata,
        isLoading: AmcIsLoading,
        isError: AmcIsError,
    } = useGetAllActivProducts();
    const { data: servicecategoryData, isLoading: servicecategoryIsLoading, isError: servicecategoryIsError } = useGetAllServiceCategories();
    const NewStaffSchema = Yup.object().shape({
        product_id: Yup.array(),
    });

    const defaultValues = {
        product_id: [],
        expiry_date: '',
    };

    const methods = useForm({
        resolver: yupResolver(NewStaffSchema),
        defaultValues,
    });

    const {
        reset,
        setValue,watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    useEffect(() => {
        const pidresult = values?.products?.map(a => a._id);
        setValue('product_id', pidresult)
        
    },[values?.products, setValue])
    useEffect(() => {
       const servicecatids = values?.service_category?.map(a => a._id);
       setValue('service_categorie_id', servicecatids)
        
    },[values?.service_category, setValue])
      useEffect(() => {
         const year = new Date().getFullYear();
         const month = new Date().getMonth();
         const day = new Date().getDate();
         const finalDate = new Date(year + 2, month, day);
         setValue('expiry_date', new Date());
        setValidDate(finalDate);
    },[setValue])
    const onSubmit = async (data) => {
        console.log('data===', data);
        try {
            const payload = {
                customer_id: id,
                expiry_date: validDate,
                product_id: data?.product_id,
                service_categorie_id: data?.service_categorie_id,
                amc_type: data?.amc_type,
                total_visit: data?.total_visit,
                ip_address: data?.ip_address,
                domain: data?.domain,
                invoice_file: invoiceFile,
            };
            createAmc(payload, {
                onSuccess: (_data) => closeIt(_data),
            });
        } catch (error) {
            console.error('error', error);
        }
    };

    const closeIt = (_data) => {
        if (_data?.data?.status === true) {
            reset();
            navigate(PATH_DASHBOARD.customer.list);
        }
    };

    const ValidDateChange = (newValue) => {
        setValue('expiry_date', newValue);
        setValidDate(newValue);
      };
    const handleBrochure = async (e) => {
        const files = e.target.files;
        if (files.length === 1) {
            const file = files[0];
            const formdata = new FormData();
            formdata.append('file', file);
            const response = await api.post('fileupload/uploadfile', formdata, { headers: header });
            console.log('response=', response);


            if (response?.data?.status === false) {
                setInvoiceFileErr(response?.data?.message);

            } else {
                setValue('invoiceFile', response?.data.file);
                setInvoiceFile(response?.data.file);
                setInvoiceFileErr('');
            }

        }
    };
    console.log("productdata==", productdata);
    if (AmcIsLoading) return <LoadingScreen />;

    if (AmcIsError) return <BlankPage />;

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>

                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <RHFSelect name="amc_type" label="AMC Type">
                                        <MenuItem value="REGULAR AMC" > REGULAR AMC </MenuItem>
                                        <MenuItem value="COMPREHENSIVE AMC" > COMPREHENSIVE AMC </MenuItem>
                                        <MenuItem value="NON COMPREHENSIVE AMC" >NON COMPREHENSIVE AMC </MenuItem>
                                    </RHFSelect>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {/* <RHFSelect
                    name="product_id"
                    label="Select Product"
                    size="large"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                  >
                    <MenuItem
                      value=""
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                    >
                      Select Product
                    </MenuItem>
                    <Divider /> 
                    {productdata.map((option) => (
                      <MenuItem
                        key={option}
                        value={option?._id}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        <AppTopRelated productdata={option} />
                      </MenuItem>
                    ))}
                  </RHFSelect> */}
                                    {/* {!AmcIsLoading && productdata?.length > 0 && (
                  <RHFAutocomplete
                    name="product_id"
                    label="Select Product"
                    multiple
                    options={productdata}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option?.title}
                    filterSelectedOptions
                    ChipProps={{ size: 'small' }}
                  />
                )} */}

                                    <Autocomplete
                                        multiple
                                        // limitTags={2}
                                       
                                        options={productdata}
                                        onChange={(event, newValue) => setValue('products', newValue)}
                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                        getOptionLabel={(option) => option.title}
                                        // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Product" placeholder="Product" />
                                        )}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="AMC Expiry date"
                                            inputFormat="DD/MM/YYYY"
                                            value={validDate}
                                            name="expiry_date"
                                            onChange={ValidDateChange}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField
                                        name="total_visit"
                                        label="Assign Total Visit"
                                        fullWidth
                                        InputProps={{

                                            inputMode: 'numeric',
                                        }}
                                        onInput={(e) => {
                                            allowOnlyNumbers(e);
                                        }}
                                    /></Grid>
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        multiple
                                        onChange={(event, newValue) => setValue('service_category', newValue)}
                                        options={servicecategoryData}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.name}
                                            </li>
                                        )}

                                        renderInput={(params) => (
                                            <TextField {...params} label="Service Category" placeholder="Category" />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField
                                        name="ip_address"
                                        label="Ip Address"
                                        fullWidth

                                    /></Grid>
                                <Grid item xs={12} md={6}>
                                    <RHFTextField
                                        name="domain"
                                        label="DOMAIN | SN | P2P"
                                        fullWidth

                                    /></Grid>
                                <Grid item xs={12} md={12} >
                                    <Stack spacing={3}>
                                        <Grid container>
                                            <Grid item xs={12} md={10} >

                                                <Box sx={{ mb: 1 }}>
                                                    <Box sx={{ mt: 2 }}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                border: '1px solid #8885',
                                                                borderRight: 'none',
                                                                marginBottom: '15px',
                                                                padding: '0 0 0 12px',
                                                                borderRadius: 8,
                                                                height: 55,
                                                                overflow: 'hidden',
                                                            }}
                                                        >

                                                            {invoiceFile !== '' ? invoiceFile : 'Choose File'}

                                                        </div>

                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={2} style={{ paddingTop: '16px', marginLeft: '-14px', }} >
                                                <LoadingButton variant="contained" sx={{ height: 55, width: 100 }} component="label" style={{ borderBottomLeftRadius: '0px', borderTopLeftRadius: '0px' }}>
                                                    Choose File
                                                    <input
                                                        name="invoice_file"
                                                        id="invoice_file"
                                                        type="file"
                                                        accept="file/pdf"

                                                        onChange={(e) => {
                                                            handleBrochure(e);
                                                        }}
                                                        hidden
                                                    />
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                        {invoiceFile !== "" ?
                                            <small style={{ textAlign: 'end' }}><a href={invoiceFile} rel="noreferrer" target="_blank">View Brochure</a></small>
                                            : null}
                                        <small style={{ color: 'red' }}>
                                            {
                                                invoiceFileErr
                                            }
                                        </small>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>

                        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size=""
                                loading={isSubmitting || updateProductAmcIsLoading}
                            >
                                Add Now
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
