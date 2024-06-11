import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Card,
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Stack, TextField,
    Typography, Autocomplete, Checkbox
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { onCloseModal, onOpenModal } from 'redux/slices/calendar';
import { useDispatch, useSelector } from 'redux/store';
import api from 'services/api';
import { useGetAllActivProducts, useCreateProductImageUrl, useDeleteProductImageById } from 'services/productServices';
import { useGetAllServiceCategories } from 'services/servicecategoryServices';
import * as Yup from 'yup';
import FormProvider, {
    RHFEditor,
    RHFSelect,
    RHFTextField,
    RHFUpload,
} from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateService, useUpdateServiceById } from '../../../services/serviceServices';
import AppTopRelated from './AppTopRelated';
import DialogSalectCustomer from './DialogSalectCustomer';
import { ProjectUpload } from '../../../components/upload';

const header = {
    'Content-Type': 'multipart/form-data',
};
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
ServiceAddForm.propTypes = {
    isEdit: PropTypes.bool,
    serviceData: PropTypes.func,
};

export default function ServiceAddForm({ isEdit = false, serviceData }) {
    console.log('serviceData', serviceData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [customerType, setcustomerType] = useState([]);
    const { openModal } = useSelector((state) => state.calendar);
    const { enqueueSnackbar } = useSnackbar();
    const [videoOne, setvideoOne] = useState('');
    const [videoErr, setVideoErr] = useState('');
    const [pictures, setPictures] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedServiceCat, setSelectedServiceCat] = useState([]);
    const { createService, isLoading: ServiceIsLoading } = useCreateService();
    const { updateService, isLoading: updateServiceIsLoading } = useUpdateServiceById();
    const { data: servicecategoryData, isLoading: servicecategoryIsLoading, isError: servicecategoryIsError } = useGetAllServiceCategories();
    const { data, isLoading, isError } = useGetAllActivProducts();
    const { deletedata } = useDeleteProductImageById();
    const NewBrandSchema = Yup.object().shape({
         customer: Yup.array().required('Customer is required'),
        // product_id: Yup.string().required('Product Type is required'),
        // service_type: Yup.string().required('Service Type is required'),
    });

    const defaultValues = useMemo(
        () => ({
            _id: serviceData?._id || '',
            images: serviceData?.images || [],
            video: serviceData?.video || '',
            address: serviceData?.address || '',
            product_id: serviceData?.product_id || '',
            service_categorie_id: serviceData?.service_categorie_id || '',
            description: serviceData?.description || '',
            priority: serviceData?.priority || '',
            is_other_product: serviceData?.is_other_product || false,
        }),
        [serviceData]
    );

    const methods = useForm({
        resolver: yupResolver(NewBrandSchema),
        defaultValues, 
    });

    const {
        reset,
        setValue,
        watch,
        handleSubmit, trigger, control,
        formState: { isSubmitting },
    } = methods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'images',
    });
    const values = watch();
    useEffect(() => {
        if(data){
    data?.push({ _id:'1234',title: 'Other' });}
    },[data]);
    useEffect(() => {
        
        if (isEdit && serviceData && data) { 
            if(serviceData?.product_id){
            const names = serviceData?.product_id?.map((id) => data.find((el) => el._id === id));
            names.push({_id:'1234',title: 'Other'}); 
            setValue('products', names);
            setSelectedProduct(names); }
            if(serviceData?.service_categorie_id){
            const scnames = serviceData?.service_categorie_id?.map((id) => servicecategoryData.find((el) => el._id === id));
            setValue('service_category', scnames);
            setSelectedServiceCat(scnames);}
        }
    }, [isEdit, serviceData, data, setValue, servicecategoryData]);

    useEffect(() => {
        const pidresult = values?.products?.map(a => a._id);
        const isInArray = pidresult?.includes('1234');
        setValue('is_other_product', isInArray);
// console.log("isInArray=",isInArray);
        const pidArr = pidresult?.filter(item => item !== '1234');
        console.log(values?.products, "isInArray=",pidArr)
        setValue('product_id', pidArr)
    }, [values?.products, setValue])
    // console.log("values?.products=",serviceData?.product_id)
    useEffect(() => {
        const servicecatids = values?.service_category?.map(a => a._id);
        setValue('service_categorie_id', servicecatids)
    }, [values?.service_category, setValue])

    useEffect(() => {
        if (isEdit && serviceData) {
            reset(defaultValues);
            // setcustomerType(JSON.parse(serviceData?.customer));
            setValue('customer_id', serviceData?.customers[0]?._id)
            setcustomerType(serviceData?.customers);
            setValue('customer', serviceData?.customers);
            setPictures(serviceData?.images);
         
            
            setValue('is_other_product', serviceData?.is_other_product);
             
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, serviceData]);

    const onSubmit = async (_dataArr) => {
      console.log("_dataArr=",_dataArr);
        try {
            const formData = new FormData();
            formData.set('id', serviceData?._id);
            formData.set('user_id', userId);

            formData.set('address', _dataArr?.address);

            formData.set('product_id', _dataArr?.product_id);
            formData.set('customer_id', customerType[0]._id);
            formData.set('customer', JSON.stringify(customerType));
        // formData.set('service_type', _dataArr.service_type);
            formData.set('description', _dataArr.description);
            formData.set('source', 'By Admin');
            // if (isEdit) {
            //     const imgArr = [];
            //     if (_dataArr.images.length > 0) {
            //         _dataArr.images.forEach((file) => {
            //             if (file.path) {
            //                 formData.append('images', file);
            //             } else {
            //                 imgArr.push(file);
            //             }
            //         });
            //     }
            //     formData.set('imgArr', imgArr);
            // } else if (_dataArr.images) {
            //     _dataArr.images.forEach((file) => {
            //         formData.append('images', file);
            //     });
            // } else {
            //     formData.set('images', JSON.stringify(_dataArr.images));
            // }


            if (isEdit) {
                console.log('data+++++++', _dataArr);
                updateService(_dataArr, {
                    onSuccess: (_data) => closeIt(_data),
                });
            } else {
                createService(_dataArr, {
                    onSuccess: (_data) => closeIt(_data),
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    };
    const [files, setFiles] = useState([]);
    const { mutate: createImageUrl } = useCreateProductImageUrl();
    const handleDropMultiple = async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append('productPictures', file);
        });

        createImageUrl(formData, {
            onSuccess: (imageData) => {
                trigger('images');
                console.log('IMAGES123', imageData.data.images);

                const newArray = pictures;
                imageData.data.images?.forEach((item) => {
                     newArray.push(item);
                });
                setPictures(newArray);
                setValue('images', newArray);
            },
        });
    };
    const handleDrop = useCallback(
        (acceptedFiles) => {
            console.log("acceptedFiles=", acceptedFiles);
            const images = values.images || [];
            setValue('images', [
                ...images,
                ...acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                ),
            ]);
        },
        [setValue, values.images]
    );
    const handleDropp = useCallback(
        (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            const formData = new FormData();
            newFiles.forEach((file) => {
                formData.append('productPictures', file);
            });

            createImageUrl(formData, {
                onSuccess: (imageData) => {
                    trigger('images');
                    console.log('IMAGES123', imageData.data.images);
                    handleSetValue(imageData?.data?.images);
                },
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
    );
    const handleSetValue = (allS3Images) => {
        console.log("fsdf==", allS3Images);
        const imgArr = [];
        const requiredData = allS3Images.map((image) =>
            imgArr.push({
                id: image.key,
                url: image.location,
            })
        );

        const newImages = [
            {

                values: imgArr,
            },
        ];
        trigger();

        append(imgArr);
    };


    // const handleRemoveFile = (inputFile) => {
    //     console.log("inputFile==",inputFile)
    //   //  const filtered = values.images && values.images[0]?.values?.filter((file) => file !== inputFile);
    //   const filtered = values[0]?.values?.filter((image) => image.id !== inputFile.id);
    //     console.log(values.images,"inputFile==",filtered)
    //     // setValue('images', filtered);
    // };
    const handleRemoveFile = (keyValue) => {
        console.log('keyValue', keyValue);

        // remove the image from the array  whose id is equal to the keyValue
        const filteredImages = values?.images[0]?.values?.filter((image) => image.id !== keyValue.id);

        const newImagesArray = [
            {

                values: filteredImages,
            },

        ];
        setValue('images', newImagesArray);

        deletedata(keyValue);
    };
    const handleRemoveAllFiles = () => {
        // setValue('pictures', []);
        setPictures([]);
        setValue('images', []);
    };

    if (isLoading) return <div />;

    if (isError) return <div />;

    const closeIt = (_data) => {
        if (_data?.data?.status === true) {
            reset();
            navigate(PATH_DASHBOARD.service.list);
        }
    };

    const handleCloseModal = () => {
        dispatch(onCloseModal());
    };

    const handleAddEvent = () => {
        dispatch(onOpenModal());
    };

    const onSetCustomerType = (value) => {
        setcustomerType(value);
        setValue('customer', value);
        console.log("value?._id=",value[0]?._id);
        setValue('customer_id', value[0]?._id);
    };
    const handleRemove = (file) => {
        console.log(file);
        const filteredItems = values?.images?.filter((_file) => _file?.location !== file?.location);
        deletedata(file);
        setValue('images', filteredItems);
        setPictures(filteredItems);
      };
    const handleVideoLoad = async (e) => {

        const filess = e.target.files;
        if (filess.length === 1) {
            const file = filess[0];
            const formdata = new FormData();
            formdata.append('file', file);
            const response = await api.post('fileupload/uploadfile', formdata, { headers: header });
            console.log('response=', response);
            // enqueueSnackbar(response?.data?.message);

            if (response?.data?.status === false) {
                setVideoErr(response?.data?.message);
                //  enqueueSnackbar(response?.data?.message);
            } else {
                setvideoOne(response?.data.file);
                setVideoErr('');
            }
            // setValue('video', response?.data.file);
        }
    };
    console.log(data, "selectedProduct==",selectedProduct);
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
                                        value={
                                            customerType.length > 0
                                                ? `${customerType[0]?.name}|${customerType[0]?.contact_no}|${customerType[0]?.city}`
                                                : ''
                                        }
                                        onClick={() => handleAddEvent()}
                                        inputProps={{ readOnly: true }}
                                    />
                                </Grid>

                                {/* <Grid item xs={12} md={12}>
                  <RHFSelect
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
                    {data.map((option) => (
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
                  </RHFSelect>
                </Grid> */}
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        multiple
                                        options={data}
                                        onChange={(event, newValue) => { setValue('products', newValue); setSelectedProduct(newValue)}}
                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                        getOptionLabel={(option) => option.title}
                                        value={selectedProduct}
                                       // defaultValue={[selectedProduct?.map((item, index)=> item)]}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Product" placeholder="Product" />
                                        )}

                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        multiple
                                        onChange={(event, newValue) => {setValue('service_category', newValue); setSelectedServiceCat(newValue)}}
                                        options={servicecategoryData}
                                        value={selectedServiceCat}
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
                                <Grid item xs={12} md={12}>
                                    <div>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                            Description
                                        </Typography>
                                        <RHFEditor name="description" />
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                        Images
                                    </Typography>

                                    {/* <RHFUpload
                    multiple
                    thumbnail
                    name="images"
                    maxSize={5145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
                    onUpload={() => console.log('ON UPLOAD')}
                  /> */}
                                    <ProjectUpload
                                        multiple
                                        thumbnail
                                        showPreview={pictures?.length > 0}
                                        files={pictures || []}
                                        onDrop={handleDropMultiple}
                                        onRemove={handleRemove}
                                        onRemoveAll={() => handleRemoveAllFiles}
                                        onUpload={() => {
                                            console.log('');
                                        }}
                                        placeholder="Upload Images"
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <RHFSelect
                                        name="priority"
                                        label="Priority"
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
                                            Select priority
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem
                                            value="NEW"
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            NEW
                                        </MenuItem>

                                        <MenuItem
                                            value="LOW"
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            LOW
                                        </MenuItem>

                                        <MenuItem
                                            value="MEDIUM"
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            MEDIUM
                                        </MenuItem>
                                        <MenuItem
                                            value="HIGH"
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            HIGH
                                        </MenuItem>
                                    </RHFSelect>
                                </Grid>
                             

                                <Grid item xs={12} md={12}>

                                    <RHFTextField name="address" label="Address" />

                                </Grid>


                                {/* <Grid item xs={12} md={12}>
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
                        <label style={{ display: 'flex' }} for="Choose Videos">
                          {videoOne !== '' ? videoOne : 'Choose Videos'}
                        </label> 
                        <LoadingButton variant="contained" sx={{ height: 80 }} component="label">
                          Attach&nbsp;Videos
                          <input
                            name="video"
                            type="file"
                            accept="video/mp4"
                            
                            onChange={(e) => {
                              handleVideoLoad(e);
                            }}
                            hidden
                          />
                        </LoadingButton>
                      </div>
                    </Box>
                  </Box>
                  <small style={{ color: 'red' }}>
                    {' '}
                    {
                      // videoErr === true ? <LinearProgress /> : null
                      videoErr
                    }
                  </small>
                </Grid> */}


                            </Grid>

                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting || updateServiceIsLoading || ServiceIsLoading}
                                // disabled={values.video.length === 0}
                                >
                                    {isEdit ? 'Update Now' : 'Post Now'}
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>

            <Dialog fullWidth maxWidth="lg" open={openModal} onClose={handleCloseModal}>
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
