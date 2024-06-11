import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
    Card,
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,Autocomplete, Checkbox, Box
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { allowOnlyNumbers } from 'utils/inputValidation';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import api from 'services/api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'redux/store';
import { useCreateAmc, useUpdateAllAmcById } from 'services/amcServices';
import { useGetAllServiceCategories } from 'services/servicecategoryServices';

import { useGetAllActivProducts } from 'services/productServices';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { AppTopRelated, DialogSalectCustomer } from './tab';
// import { ProductAMCAddForm } from '.';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

ProductAMCAddForm.propTypes = {
    isEdit: PropTypes.bool,
    productAMCAdata: PropTypes.func,
};
const header = {
    'Content-Type': 'multipart/form-data',
};
export default function ProductAMCAddForm({ isEdit = false, productAMCAdata }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validDate, setValidDate] = useState(new Date());
    const [customerType, setcustomerType] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [invoiceFile, setInvoiceFile] = useState('');
    const [invoiceFileErr, setInvoiceFileErr] = useState('');
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedServiceCat, setSelectedServiceCat] = useState([]);
    const { createAmc, isLoading: amcIsLoading } = useCreateAmc();
    const { updateAllAmc, isLoading: amcServiceIsLoading } = useUpdateAllAmcById();

    const { data: productdata, isLoading, isError } = useGetAllActivProducts();
    const { data: servicecategoryData, isLoading: servicecategoryIsLoading, isError: servicecategoryIsError } = useGetAllServiceCategories();

    const NewBrandSchema = Yup.object().shape({
       // product_id: Yup.string().required('Product Type is required'),
        amc_type: Yup.string().required('AMC Type is required'),
        customer: Yup.array().required('Customer is required'),
    });

    const defaultValues = useMemo(
        () => ({
            _id: productAMCAdata?._id || '',
            expiry_date: productAMCAdata?.expiry_date || '',
            product_id: productAMCAdata?.product_id || '',
            service_categorie_id: productAMCAdata?.service_categorie_id || '',
            amc_type: productAMCAdata?.amc_type || '',
            invoice_file: productAMCAdata?.invoice_file || '',

            domain: productAMCAdata?.domain || '',
            total_visit: productAMCAdata?.total_visit || '',
            ip_address: productAMCAdata?.ip_address || '',
        }),
        [productAMCAdata]
    );

    const methods = useForm({
        resolver: yupResolver(NewBrandSchema),
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
        
        if (isEdit && productAMCAdata && productdata) { 
            const names = productAMCAdata?.product_id?.map((id) => productdata.find((el) => el._id === id));
            setValue('products', names);
            setSelectedProduct(names);
            if(productAMCAdata?.service_categorie_id){
            const scnames = productAMCAdata?.service_categorie_id?.map((id) => servicecategoryData.find((el) => el._id === id));
            setValue('service_category', scnames);
            setSelectedServiceCat(scnames);} 
        }
    }, [isEdit, productAMCAdata, productdata, setValue, servicecategoryData]);
    useEffect(() => {
        const pidresult = values?.products?.map(a => a._id);
        setValue('product_id', pidresult)
        
    },[values?.products, setValue])
    useEffect(() => {
        if(isEdit){
         console.log("productAMCAdata?.products=",productAMCAdata?.products);
         setValue('products', productAMCAdata?.products);
     }
         
     },[isEdit, productAMCAdata, setValue])
    useEffect(() => {
       const servicecatids = values?.service_category?.map(a => a._id);
       setValue('service_categorie_id', servicecatids)
        
    },[values?.service_category, setValue])

    useEffect(() => {
        if (isEdit && productAMCAdata) { 
            reset(defaultValues);
            // setcustomerType(JSON.parse(productAMCAdata?.customer));
            setInvoiceFile(productAMCAdata?.invoice_file);
            setcustomerType(productAMCAdata?.customers);
            setValue('customer', productAMCAdata?.customers);
            setValidDate(productAMCAdata?.expiry_date);
        }
        if (!isEdit) {
            reset(defaultValues);
            const year = validDate.getFullYear();
            const month = validDate.getMonth();
            const day = validDate.getDate();
            const finalDate = new Date(year + 2, month, day);
            setValidDate(finalDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, productAMCAdata]);

    const onSubmit = async (dataArr) => {
        try {
            // const payload = {
            //     id: productAMCAdata?._id,
            //     expiry_date: validDate,
            //     customer_id: customerType[0]._id,
            //     customer: JSON.stringify(customerType),
            //     product_id: dataArr?.product_id,
            // };
            const payload = {
                _id: dataArr?._id,
                customer_id: customerType[0]._id,
                expiry_date: validDate,
                product_id: dataArr?.product_id,
                service_categorie_id: dataArr?.service_categorie_id,
                amc_type: dataArr?.amc_type,
                total_visit: dataArr?.total_visit,
                ip_address: dataArr?.ip_address,
                domain: dataArr?.domain,
                invoice_file: invoiceFile,
            };
            console.log('data', payload);
            if (isEdit) {
                updateAllAmc(payload, {
                    onSuccess: (_data) => closeIt(_data),
                });
            } else {
                createAmc(payload, {
                    onSuccess: (_data) => closeIt(_data),
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    };

    if (isLoading) return <div />;

    if (isError) return <div />;

    const closeIt = (_data) => {
        if (_data?.data?.status === true) {
            reset();
            navigate(PATH_DASHBOARD.amc.list);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddEvent = () => {
        setShowModal(true);
    };

    const ValidDateChange = (newValue) => {
        setValidDate(newValue);
    };

    const onSetCustomerType = (value) => {
        setcustomerType(value);
        setValue('customer', value);
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
    console.log("setSelectedServiceCat==",selectedServiceCat);
    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                        Select Customer
                                    </Typography>

                                    <RHFTextField
                                        name="customer"
                                        placeholder=""
                                        value={customerType.length > 0 ? `${customerType[0]?.name}|${customerType[0]?.contact_no}|${customerType[0]?.city}` : ''}
                                        onClick={() => handleAddEvent()}
                                        inputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <RHFSelect name="amc_type" label="AMC Type">
                                        <MenuItem value="REGULAR AMC" > REGULAR AMC </MenuItem>
                                        <MenuItem value="COMPREHENSIVE AMC" > COMPREHENSIVE AMC </MenuItem>
                                        <MenuItem value="NON COMPREHENSIVE AMC" >NON COMPREHENSIVE AMC </MenuItem>
                                    </RHFSelect>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        multiple
                                        options={productdata}
                                        onChange={(event, newValue) => {setValue('products', newValue); setSelectedProduct(newValue)}}
                                        value={selectedProduct || []}
                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                        getOptionLabel={(option) => option.title}
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
                                    {/* <Autocomplete
                                        multiple
                                        onChange={(event, newValue) => {setValue('service_category', newValue); setSelectedServiceCat(newValue)}}
                                        value={selectedServiceCat}
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
                                    /> */}
                                               <Autocomplete
                                        multiple
                                        onChange={(event, newValue) => {setValue('service_category', newValue); setSelectedServiceCat(newValue)}}
                                        options={servicecategoryData}
                                        value={selectedServiceCat.length>0?selectedServiceCat:[]}
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

                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting || amcIsLoading || amcServiceIsLoading}
                                >
                                    {isEdit ? 'Update Now' : 'Post Now'}
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>

            <Dialog fullWidth maxWidth="lg" open={showModal} onClose={handleCloseModal}>
                <DialogTitle>Salect Customer</DialogTitle>
                <DialogSalectCustomer
                    customerType={customerType}
                    setcustomerType={onSetCustomerType}
                    onCancel={handleCloseModal}
                />
            </Dialog>
        </>
    );
}
