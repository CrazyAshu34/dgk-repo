/* eslint-disable */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Accordion
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
// routes
import { useGetAllBrand } from 'services/brandServices';
import { useGetAllCategories } from 'services/categoryServices';
import { useGetAllCollection } from 'services/collectionServices';
import { useGetAllSubCategoriesByCategories } from 'services/subCategoryServices';
import { useGetAllSuperSubCategoriesBySubCat } from 'services/superSubCategoryServices';
// utils
import { useNavigate } from 'react-router';
import { allowOnlyNumbers } from 'utils/inputValidation';
// components
import { useGetAllActiveGst } from 'services/gstServices';
import { useGetAllHsn } from 'services/hsnServices';
import { useGetAllProductAttribute } from 'services/productattributeServices';
import FormProvider, {
  RHFAutocomplete,
  RHFCheckbox,
  RHFEditor,
  RHFSelect,
  RHFTextField
} from '../../../components/hook-form';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateProduct,
  useCreateProductImageUrl,
  useCreateProductUniqueSlug,
  useUpdateProductById,
} from '../../../services/productServices';
import StockManageTable, { createStockTable } from './onlinestock/Stockmanage';
import AddProductImages from './variants/AddProductImages';
import AddVariants from './variants/AddVariants';
import VariantsMatrixTable, { createMatrixWithVariants } from './variants/VariantsMatrixTable';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductAddEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  setProductBasic: PropTypes.object,
  onChangeTab: PropTypes.object,
  setAddProductId: PropTypes.func,
};

export default function ProductAddEditForm({
  isEdit,
  currentProduct,
  setProductBasic,
  onChangeTab,
  setAddProductId,
}) {
  const navigate = useNavigate();
  const [openVariant, setOpenVariant] = useState(false);
  const [pName, setPname] = useState('');
  const [matrixErr, setMatrixErr] = useState('');
  const [openVariantQuantity, setOpenVariantQuantity] = useState(false);
  const [isAutoFill = false, setIsAutoFill] = useState(false);
  const [seoTagsOptions, setSeoTagsOptions] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [supSubCategories, setSupSubCategories] = useState([]);

  const [categoriesIdsArr, setCategoriesIdsArr] = useState(null);
  const [subCtegoriesIdsArr, setSubCategoriesIdsArr] = useState(null);
  const [subCategoriesArrIds, setSubCategoriesArrIds] = useState(['fsd']);
  const [superSubCategoriesArrIds, setSuperSubCategoriesArrIds] = useState(['fsd']);

  const [variantVal, setVariantVal] = useState([]);
  const [quantityVariantVal, setQuantityVariantVal] = useState([]);
  const [mainSuperSubCategoriesArrIds, setMainSuperSubCategoriesArrIds] = useState(['fsd']);
  const [openUploadFile, setOpenUploadFile] = useState({
    status: false,
    name: '',
  });

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').matches("^[a-zA-Z0-9\\-\\s]+$", 'Insert only normal character'),

    description: Yup.string(),
    seoTitle: Yup.string(),
    seoMetaDescription: Yup.string(),
    seoSlug: Yup.string(),
    seoTags: Yup.array().default([
      process.env.REACT_APP_COMPANY_NAME,
    ]),
    //  isActive: Yup.boolean().default(true),
    registerows: Yup.array(),
    columns: Yup.array(),

    // leadVariant: Yup.string().required('Lead Variant is required'),
    categoryIds: Yup.array().min(1, "Categories is required").required("required"),
    subCategoryIds: Yup.array(),
    supSubCategoryIds: Yup.array(),
    variants: Yup.array(),
    quantityVariants: Yup.array(),
    // brandId: Yup.string(),
    productId: Yup.string(),
    images: Yup.array(),
    discount: Yup.object(),
    isCommonMrp: Yup.boolean().default(false),

    commonMrp: Yup.string().when('isCommonMrp', {
      is: true,
      then: () => Yup.string().required('MRP is required'),
    }),
    perProductPrice: Yup.string().when('isCommonMrp', {
      is: true,
      then: (value) => {
        if (value) {
          return Yup.string()
            .required('Price is required')
            .test(
              'mrp',
              'Price should be less than MRP',
              (value) => Number(value) <= Number(values?.commonMrp)
            );
        }
      },
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      leadVariant: currentProduct?.leadVariant || '',
      variants: currentProduct?.variants || [],
      quantityVariants: currentProduct?.quantityVariants || [],
      rows: currentProduct?.rows || [],
      attribute: currentProduct?.attribute || '',
      columns: currentProduct?.columns || [],
      subtitle: currentProduct?.subtitle || '',
      onlineStock: currentProduct?.onlineStock || [],
      onlineStockColumns: currentProduct?.onlineStockColumns || [],
      seoTitle: currentProduct?.seoTitle || '',
      seoMetaDescription: currentProduct?.seoMetaDescription || '',
      seoTags: currentProduct?.seoTags || [
        process.env.REACT_APP_COMPANY_NAME,
      ],
      seoSlug: currentProduct?.seoSlug || '',
      //  isActive: currentProduct?.isActive || true,
      isCommonMrp: currentProduct?.isCommonMrp || false,
      isOnlineStock: currentProduct?.isOnlineStock || false,
      type: currentProduct?.type || 'COMMON_PRODUCT',
      commonMrp: currentProduct?.commonMrp || '',
      perProductPrice: currentProduct?.perProductPrice || '',
      brandId: currentProduct?.brandId || null,
      categoryIds: currentProduct?.categoryIds || [],
      collectionIds: currentProduct?.collectionIds || [],
      subCategoryIds: currentProduct?.subCategoryIds || [],
      supSubCategoryIds: currentProduct?.supSubCategoryIds || [],
      images: currentProduct?.images || [],
      discount: currentProduct?.discount || {},
      isAutoFill: currentProduct?.isAutoFill || false,
      discountType: currentProduct?.discountType || false,
      gst: currentProduct?.gst || null,
      gstId: currentProduct?.gstId || null,
      hsnCode: currentProduct?.hsnCode || null,

      blouseType: currentProduct?.blouseType || '',
      blouseDimension: currentProduct?.blouseDimension || '',
      sareeDimension: currentProduct?.sareeDimension || '',
      fabric: currentProduct?.fabric || '',
      craft: currentProduct?.craft || '',
      washCare: currentProduct?.washCare || '',

    }),
    [currentProduct]
  );
  console.log("currentProduct=", currentProduct?.columns);
  const methods = useForm(
    {
      resolver: yupResolver(NewProductSchema),
      defaultValues,
    },
    [defaultValues]
  );

  const {
    reset,
    watch,
    control,
    setValue,
    trigger,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  const { mutate: createProduct, isLoading: isCreatingProduct } = useCreateProduct();
  const { mutate: createImageUrl } = useCreateProductImageUrl();
  const { updateProduct } = useUpdateProductById();
  const { generateUniqueSlug } = useCreateProductUniqueSlug();
  // filter subcategory
  const newCatArray = [];
  const newCatIdsArray = [];
  useEffect(() => {
    reset({ ...defaultValues });
  }, [currentProduct]);



  useEffect(() => {
    if (values?.categoryIds != undefined) {
      if (values?.categoryIds.length > 0) {
        values?.categoryIds.forEach((element) => {
          newCatArray.push(element.slug);
          newCatIdsArray.push(element._id);
        });
      }
    }
    if (newCatIdsArray.length > 0) {
      setCategoriesIdsArr(newCatIdsArray.join(','));
    } else {
      setCategoriesIdsArr(',');
    }
    if (newCatArray.length > 0) {
      setSubCategoriesArrIds(newCatArray.join(','));
    } else {
      setSubCategoriesArrIds(',');
    }
  }, [values?.categoryIds, subCategoriesArrIds]);
  // console.log(categoriesIdsArr,"values?.categoryIds==",subCategoriesArrIds);
  useEffect(() => {
    // console.log("==>>",values?.quantityVariants);
    setVariantVal(currentProduct?.variants);
    setQuantityVariantVal(currentProduct?.quantityVariants);
  }, [currentProduct])

  //  console.log(pName, "values?.title==>", values?.title);
  // filter super subcategory
  const newSubCatArray = [];
  const newSubCatIdsArray = [];
  useEffect(() => {
    if (values?.subCategoryIds != undefined) {
      if (values?.subCategoryIds.length > 0) {
        values?.subCategoryIds.forEach((element) => {
          newSubCatArray.push(element.slug);
          newSubCatIdsArray.push(element._id);
        });
      }
    }
    if (newSubCatIdsArray.length > 0) {
      setSubCategoriesIdsArr(newSubCatIdsArray.join(','));
    } else {
      setSubCategoriesIdsArr(',');
    }

    if (newSubCatArray.length > 0) {
      setSuperSubCategoriesArrIds(newSubCatArray.join(','));
    } else {
      setSuperSubCategoriesArrIds(',');
    }
  }, [values?.subCategoryIds, subCategoriesArrIds, superSubCategoriesArrIds]);
  console.log("subCategoriesArrIds===", subCategoriesArrIds);
  // filter super subcategory
  const newSupSubCatArray = [];
  useEffect(() => {
    if (values?.supSubCategoryIds != undefined) {
      if (values?.supSubCategoryIds.length > 0) {
        values?.supSubCategoryIds.forEach((element) => {
          newSupSubCatArray.push(element.slug);
        });
      }
    }
    // console.log(values?.supSubCategoryIds, "==newSupSubCatArray==", newSupSubCatArray);
    if (newSupSubCatArray.length > 0) {
      setMainSuperSubCategoriesArrIds(newSupSubCatArray.join(','));
    } else {
      setMainSuperSubCategoriesArrIds(',');
    }
  }, [values?.supSubCategoryIds, mainSuperSubCategoriesArrIds]);

  const {
    data: productAttribuitesData,
    isLoading: productAttribuiteLoading,
    isError: productAttribuiteError,
  } = useGetAllProductAttribute();
  console.log("productAttribuitesData=", productAttribuitesData);
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetAllCategories();
  const {
    data: collectionData,
    isLoading: collectionLoading,
    isError: collectionError,
  } = useGetAllCollection();
  const {
    data: subCategoryData,
    isLoading: subCategoryLoading,
    isError: subCategoryError,
  } = useGetAllSubCategoriesByCategories(categoriesIdsArr);

  const {
    data: supSubCategoryData,
    isLoading: supSubCategoryLoading,
    isError: supSubCategoryError,
  } = useGetAllSuperSubCategoriesBySubCat(subCtegoriesIdsArr);
  function filterArray(array, filter) {
    // Get all the required ids
    var ids = filter.map(function (f) {
      return f._id;
    });
    // console.log('array=', array);
    if (array.length > 0) {
      return array.filter(function (a) {
        // Check if both source and target are present in list of ids
        return ids.indexOf(a.categoryId) !== -1;
      });
    }
  }
  const getOnlySubCatArray = (_id) => {
    // this will return only item which match the provided id
    return subCategoryData?.filter((s) => s._id === _id)
  }
  useEffect(() => {
    if (categoryData != undefined) {
      const myArraycatFilteredd = categoryData.filter((el) => {
        return values?.categoryIds.some((f) => {
          return f._id === el._id;
        });
      });
      if (myArraycatFilteredd.length > 0) {

        setValue('categoryIds', myArraycatFilteredd);
      }
    }
  }, [categoryData])

  useEffect(() => {
    if (collectionData != undefined) {
      const myArraycatFilteredd = collectionData.filter((el) => {
        return values?.collectionIds?.some((f) => {
          return f._id === el._id;
        });
      });
      if (myArraycatFilteredd.length > 0) {

        setValue('collectionIds', myArraycatFilteredd);
      }
    }
  }, [collectionData, values?.collectionIds])

  useEffect(() => {
    const myArrayFilteredd = values?.subCategoryIds.filter((el) => {
      return values?.categoryIds.some((f) => {
        return f._id === el.categoryId;
      });
    });
    if (myArrayFilteredd?.length > 0 && subCategoryData?.length > 0) {
      const finalCatArr = subCategoryData?.filter((el) => {
        return myArrayFilteredd?.some((f) => {
          return f._id === el._id
        })
      })
      setValue('subCategoryIds', finalCatArr);
    }
    //
    // filter super sub category
    const superSubArrayFiltered = values?.supSubCategoryIds.filter((el) => {
      return values?.subCategoryIds.some((f) => {
        return f._id === el.subcategoryId;
      });
    });
    if (supSubCategoryData != undefined) {
      if (superSubArrayFiltered.length > 0 && supSubCategoryData?.length > 0) {
        const finalSupSubCatArr = supSubCategoryData?.filter((el) => {
          return superSubArrayFiltered.some((f) => {
            return f._id === el._id
          })
        })
        // setValue('subCategoryIds', finalCatArr);
        setValue('supSubCategoryIds', finalSupSubCatArr);
      }
    }
    if (values?.categoryIds.length > 0) {
      if (subCategoryData != undefined) {
        // setValue('subCategoryIds', []);
        if (subCategoryData?.length > 0) {
          var myArrayFiltered = filterArray(subCategoryData, values?.categoryIds);

          //  setValue('subCategoryIds', myArrayFiltered);
        }
      }
      if (supSubCategoryData != undefined) {
        if (supSubCategoryData?.length > 0) {
          var myArrayFiltered = filterArray(supSubCategoryData, values?.subCategoryIds);
          // setValue('supSubCategoryIds', myArrayFiltered);
        }
      }
    }
  }, [values?.categoryIds, subCategoriesArrIds, superSubCategoriesArrIds, subCategoryData, supSubCategoryData, currentProduct]);
  console.log("lllllllllllll", subCategoryData);
  // console.log("mainSuperSubCategoriesArrIds===",mainSuperSubCategoriesArrIds);
  const { data: brandData, isLoading: brandLoading, isError: brandError } = useGetAllBrand();

  const { data: gstData, isLoading: gstLoading, isError: gstError } = useGetAllActiveGst();
  const { data: hsnData, isLoading: hsnLoading, isError: hsnError } = useGetAllHsn();
  const isLoading = categoryLoading || subCategoryLoading || brandLoading;
  const isError = categoryError || subCategoryError || brandError;


  console.log('Error...', gstData);

  // This is to set the seo title, meta description, slug and tags
  const createUniqueSlugFromBackend = async (title = '') => {
    const payload = {
      title: title,
    };
    await generateUniqueSlug(payload, {
      onSuccess: (data) => {
        setValue('seoSlug', data.data.data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  useEffect(() => {
    if (values?.title !== '') {
      setValue('seoTitle', values?.title);
      setValue('seoMetaDescription', values?.title);
      setValue('seoTags', []);

      // setValue('seoSlug', uniqueSlugGenerator(values?.title));
      const slugTimer = setTimeout(() => {
        if (!isEdit) {
          createUniqueSlugFromBackend(values?.title);
        }
        // else {
        //   if (values?.title !== currentProduct?.title) {
        //     createUniqueSlugFromBackend(values?.title);
        //   }
        // }
      }, 1000);

      return () => {
        clearTimeout(slugTimer);
      };
    }
  }, [values?.title]);

  // This is to generate and set the product id
  useEffect(() => {
    if (!isEdit) {
      setValue('productId', uuidv4());
      // setValue('quantityVariants', []);
    } else {
      setValue('productId', currentProduct?.productId);
    }
  }, []);
  // This is to prevent form submission on enter key press
  useEffect(() => {
    const form = document.querySelector('form');
    form.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }, []);
  // Edit time
  // console.log(pName, "values.title==", values.title)
  useEffect(() => {
    if (isEdit) {
      setPname(currentProduct?.title);
    }
  }, [currentProduct]);
  useEffect(() => {
    if (values?.gstId !== null && gstData) {
      const selectGst = gstData.find(x => x._id === values?.gstId);

      setValue('gst', selectGst);
    }
  }, [values?.gstId]);

  // This is a final form submission
  const onSubmit = async (_data) => {
    if (JSON.stringify(values?.variants) === JSON.stringify(variantVal)) {
      //  console.log(values?.quantityVariants, 'equal-to', quantityVariantVal);
      //  console.log('DATATATA', _data);
      // setProductBasic(_data);
      if (isEdit) {
        console.log('ELSEDATATATA', _data);
        /// if (pName === values?.title) {
        await updateProduct(_data, {
          onSuccess: (data) => {
            setAddProductId('1')
            reset();
          },
        });
        navigate(PATH_DASHBOARD.product.list);
        //  onChangeTab('input fields');
        // } else {
        //   setMatrixErr("You have changed product title please re-generate matrix.")
        // }
      } else {
        // if (pName === values?.title) {
        console.log('ELSEDATATATA', _data);
        await createProduct(_data, {
          onSuccess: (data) => {
            setAddProductId(data?.data?.product?._id);
            reset();
            // onChangeTab('input fields');
            navigate(PATH_DASHBOARD.product.list);
          },
        });
        // } else {
        //   setMatrixErr("You have changed product title please re-generate matrix.")
        // }
      }

    } else {
      setMatrixErr('You have changed product variant please re-generate matrix.');
    }
  };

  const handleOpenUploadFile = (tag) => {
    setOpenUploadFile({
      status: true,
      name: tag,
    });
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile({
      status: false,
      name: '',
    });
  };

  const saveAndGenerateMatrix = (allValuesProps) => {
    setPname(values?.title); setVariantVal(values?.variants); setMatrixErr('');
    const { rows, columns } = createMatrixWithVariants(
      allValuesProps, isEdit, setValue
    );
    console.log(rows, "-------", columns);
    if (
      rows.length > 0 &&
      columns.length > 0
    ) {
      setValue('rows', rows);
      setValue('columns', columns);

    } else {
      setValue('rows', []);
      setValue('columns', []);
    }
  };
  const generateOnlineStockTable = (allValuesProps, ctype) => {

    if (ctype == 'indirect') {
      //  console.log("values?.onlineStock==",values?.onlineStock);
      if (values?.isOnlineStock == true) {
        const { onlineStock, onlineStockColumns } = createStockTable(
          allValuesProps, isEdit
        );

        if (
          onlineStock.length > 0 &&
          onlineStockColumns.length > 0
        ) {
          setValue('onlineStock', onlineStock);
          setValue('onlineStockColumns', onlineStockColumns);
        } else {
          setValue('onlineStock', []);
          setValue('onlineStockColumns', []);
        }
      }
    } else {
      const { onlineStock, onlineStockColumns } = createStockTable(
        allValuesProps, isEdit
      );
      if (
        onlineStock.length > 0 &&
        onlineStockColumns.length > 0
      ) {
        setValue('onlineStock', onlineStock);
        setValue('onlineStockColumns', onlineStockColumns);
      } else {
        setValue('onlineStock', []);
        setValue('onlineStockColumns', []);
      }
    }
  };

  const uniqueSlugGenerator = (title = '') => {
    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return slug;
  };

  const leadVariantArray = values?.variants?.filter(
    (item) => item?.title.toLowerCase() === values?.leadVariant?.toLowerCase()
  );
  function extractHexColorsFromString(inputString) {
    const hexColorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;
    const hexColors = inputString.match(hexColorRegex);
    return hexColors || [];
  }
  useEffect(() => {
    setValue('commonMrp', 0);
    setValue('perProductPrice', 0);
  }, [values?.isCommonMrp])
  useEffect(() => {
    if (isEdit) {
      //   if(categoryData){
      //   const catArrayEditFilteredd = categoryData.filter((el) => {
      //     return currentProduct?.categoryIds.some((f) => {
      //       return f._id === el._id;
      //     });
      //   }); 
      //   setValue('categoryIds',catArrayEditFilteredd);
      // }
      // if(subCategoryData){
      //   const myArrayEditFilteredd = subCategoryData.filter((el) => {
      //     return currentProduct?.subCategoryIds.some((f) => {
      //       return f._id === el._id;
      //     });
      //   }); 
      //   setValue('subCategoryIds',myArrayEditFilteredd);
      // }
      //   if(supSubCategoryData){
      //   const supSubArrayEditFilteredd = supSubCategoryData.filter((el) => {
      //     return currentProduct?.supSubCategoryIds.some((f) => {
      //       return f._id === el._id;
      //     });
      //   }); 
      //   setValue('supSubCategoryIds',supSubArrayEditFilteredd);}
    }
  }, [isEdit, categoryData, subCategoryData, supSubCategoryData, currentProduct, collectionData]);

  console.log("valueee=", values.categoryIds);
  // Check if the array contains an object with the name "Sarees"
  const isSareesPresent = values?.categoryIds?.some(category => category.name === "Sarees");
  useEffect(() => {
    if (!isSareesPresent) {
      setValue('blouseType', '');
      setValue('blouseDimension', '');
      setValue('sareeDimension', '');
    }
  }, [setValue, isSareesPresent])
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} direction="row">
          {/* left Side Grid */}
          <Grid item xs={12} md={8}>
            {/*  Basic : Title & Description */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Title" />
                <RHFTextField name="subtitle" label="Sub Title" />
                {!productAttribuiteLoading && productAttribuitesData?.length > 0 && (
                  <RHFSelect
                    name="attribute"
                    label="Attribute"
                    size="large"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                  >
                    <Divider />
                    {productAttribuitesData.map((option) => (
                      <MenuItem
                        key={option}
                        value={option?.name}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Description
                  </Typography>
                  <RHFEditor simple name="description" />
                </Stack>
              </Stack>
            </Card>
            {/*  Variants  */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Variants (Size, Color, etc.)
                </Typography>

                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={
                    <Iconify
                      icon={values?.variants?.length > 0 ? 'bx:bxs-edit' : 'bx:bxs-plus-circle'}
                      width={20}
                      height={20}
                    />
                  }
                  onClick={() => {
                    setOpenVariant(true);
                  }}
                >
                  {values?.variants?.length > 0 ? 'Edit' : 'Add'}
                </Button>
              </Stack>

              <Stack spacing={2}>
                {values?.variants?.map((item, index) => (
                  <Stack spacing={1} key={index}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      {item.title}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap">
                      {item?.options?.map((tag) => {
                        const txtColor = extractHexColorsFromString(tag);
                        return (<>
                          <Chip
                            size="medium"
                            avatar={txtColor && txtColor?.length > 0 ? <span
                              style={{
                                backgroundColor: txtColor,
                                padding: '1px 4px',
                                borderRadius: '2px',
                                height: '15px',
                                width: '15px'
                              }}
                            ></span> : null}
                            key={tag}
                            label={tag}
                            // style={{ backgroundColor: txtColor && txtColor?.length > 0 ? txtColor : 'text.secondary' }}
                            sx={{ mr: 1, mb: 1, color: 'text.secondary' }}
                          />
                        </>)
                      })}
                    </Stack>
                  </Stack>
                ))}
              </Stack>

              <Dialog
                fullWidth
                maxWidth="sm"
                open={openVariant}
              // onClose={() => {
              //   setOpenVariant(false);
              // }}
              >
                <DialogContent>
                  <AddVariants
                    onClose={() => {
                      setOpenVariant(false);
                    }}
                    generateOnlineStockTable={generateOnlineStockTable}
                    isEdit={isEdit}

                  />
                </DialogContent>
              </Dialog>
            </Card>
            {/* Stock management  */}
            <Card sx={{ p: 2, mb: 3 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  <RHFCheckbox
                    name="isOnlineStock"
                    label="Willing to manage online stock here?"
                    onClick={() => generateOnlineStockTable(values, 'direct')}
                  />
                </Typography>

                {values?.isOnlineStock && (
                  <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <StockManageTable
                      name="onlineStock"
                      rows={values?.onlineStock}
                      columns={values?.onlineStockColumns}
                    />
                  </Stack>
                )}

              </Stack>
            </Card>

            {(values?.variants?.length > 0) && (
              <Card sx={{ p: 2, mb: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    <RHFCheckbox
                      name="isCommonMrp"
                      label="Do You Have A Common MRP & Price For All Variants?"
                    />
                  </Typography>

                  {values?.isCommonMrp && (
                    <Stack
                      spacing={2}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        spacing={2}
                        direction="row"
                        alignItems="start"
                        width="100%"
                        justifyContent="space-between"
                      >
                        <RHFTextField
                          name="commonMrp"
                          label="Common MRP"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            inputMode: 'numeric',
                          }}
                          onInput={(e) => {
                            allowOnlyNumbers(e);
                          }}
                        />
                        <RHFTextField
                          name="perProductPrice"
                          label="Single Product Price"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            inputMode: 'numeric',
                          }}
                          onInput={(e) => {
                            trigger('perProductPrice');
                            trigger('commonMrp');
                            allowOnlyNumbers(e);
                          }}
                        />
                      </Stack>
                    </Stack>
                  )}

                  {/* {values?.commonMrp &&
                    values?.perProductPrice &&
                    values?.quantityVariants?.length > 0 && (
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        <RHFCheckbox
                          name="isAutoFill"
                          label="Do you want to auto fill all the varient price?"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isAutoFill}
                              onChange={(e) => {
                                setIsAutoFill(e.target.checked);
                              }}
                            />
                          }
                          label="Do you want to auto fill all the varient price?"
                        />
                      </Typography>
                    )} */}

                  {/* {values?.isAutoFill && (
                    <Stack spacing={2} direction="row" alignItems="center">
                      <FormLabel id="demo-radio-buttons-group-label">Discount Type :</FormLabel>
                      <RHFRadioGroup
                        row
                        spacing={4}
                        name="discountType"
                        options={[
                          { value: 'percentage', label: 'Percentage' },
                          { value: 'flat', label: 'Flat' },
                        ]}
                      />
                    </Stack>
                  )} */}


                </Stack>
              </Card>
            )}

            {/* Save and Proceed for Next  */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="bx:bxs-check-circle" />}
                disabled={parseInt(values.perProductPrice) > parseInt(values.commonMrp)}
                onClick={() => saveAndGenerateMatrix(values)}
              >
                Generate Matrix
              </Button>
            </Stack>

            {/*  Variants Matrix Table  */}
            {values?.rows?.length > 0 && values?.columns?.length > 0 && (
              <Card sx={{ p: 3, my: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', pb: 2 }}>
                  Matrix
                </Typography>
                <VariantsMatrixTable
                  name="rows"
                  rows={values?.rows}
                  columns={values?.columns}
                />
              </Card>
            )}

            {/* Bottom Image Container  */}
            {(values?.rows?.length > 0) && (
              <Grid container spacing={3} direction="row">
                <Grid item xs={12} md={12}>
                  {/*  Images  */}
                  <Card sx={{ p: 3, my: 3 }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Attach Images
                      </Typography>
                      <Stack spacing={2}>

                        {leadVariantArray?.length > 0 ?
                          leadVariantArray[0]?.options?.map((tag, index) => (
                            <AddProductImages tag={tag} />
                          )) : <AddProductImages tag="base" />}
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Grid>

          {/* right Side Grid */}
          <Grid item xs={12} md={4}>
            {/*  Product Categories  */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Product Status
                </Typography>

                {!categoryLoading && categoryData?.length > 0 && (
                  <RHFAutocomplete
                    name="categoryIds"
                    label="Categories"
                    multiple
                    options={categoryData}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    ChipProps={{ size: 'small' }}
                  />
                )}

                {!subCategoryLoading && subCategoryData?.length > 0 && (
                  <RHFAutocomplete
                    name="subCategoryIds"
                    label="Sub Categories"
                    multiple
                    options={subCategoryData}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    ChipProps={{ size: 'small' }}
                  />
                )}

                {!supSubCategoryLoading && supSubCategoryData?.length > 0 && (
                  <RHFAutocomplete
                    name="supSubCategoryIds"
                    label="Super Sub Categories"
                    multiple
                    options={supSubCategoryData}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    ChipProps={{ size: 'small' }}
                  />
                )}
                {isSareesPresent ?
                  <>
                    <RHFTextField name="blouseType" label="Blouse Type" />
                    <RHFTextField name="blouseDimension" label="Blouse Dimension" />
                    <RHFTextField name="sareeDimension" label="Saree Dimension" />
                  </>
                  : null}
                <RHFTextField name="fabric" label="Fabric" />
                <RHFTextField name="craft" label="Craft" />
                <RHFTextField name="washCare" label="Wash Care" />




                {!collectionLoading && collectionData?.length > 0 && (
                  <RHFAutocomplete
                    name="collectionIds"
                    label="Collections"
                    multiple
                    options={collectionData}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    ChipProps={{ size: 'small' }}
                  />
                )}

                {!brandLoading && brandData?.length > 0 && (
                  <RHFSelect
                    name="brandId"
                    label="Brand Name"
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
                      None
                    </MenuItem>
                    <Divider />
                    {brandData.map((option) => (
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
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
                {/*  gstData
                {!brandLoading && brandData?.length > 0 && (
                  <RHFAutocomplete
                    name="brandName"
                    label="Brand Name"
                    // multiple
                    freeSolo
                    options={brandData?.map((item) => item.name)}
                    ChipProps={{ size: 'small' }}
                  />
                )} */}
                {!gstLoading && gstData?.length > 0 && (
                  <RHFSelect
                    name="gstId"
                    label="GST"
                    size="large"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                  >
                    <Divider />
                    {gstData.map((option) => (
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
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
                {!hsnLoading && hsnData?.length > 0 && (
                  <RHFSelect
                    name="hsnCode"
                    label="HSN Code"
                    size="large"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                  >
                    <Divider />
                    {hsnData.map((option) => (
                      <MenuItem
                        key={option}
                        value={option?.hsnCode}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        {option.title}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Card>

            {/*  SEO Fields  */}

            <Card sx={{ mb: 3 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<Iconify icon="material-symbols:keyboard-arrow-down" />}
                >
                  <Typography>SEO : Search Engine Optimization fields</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    <RHFTextField name="seoTitle" label="Page Title" />
                    <RHFTextField name="seoSlug" label="Slug (Read only)" InputProps={{
                      readOnly: true,
                    }} />
                    <RHFTextField
                      name="seoMetaDescription"
                      label="Meta Description"
                      multiline
                      minRows={3}
                      maxRows={8}
                    />
                    <RHFAutocomplete
                      name="seoTags"
                      size="large"
                      placeholder="Add Tags (Press Enter to add)"
                      multiple
                      freeSolo
                      fullWidth
                      options={seoTagsOptions.map((option) => option)}
                      ChipProps={{ size: 'large' }}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Final Submit  */}
            {console.log("values?.rows?.length=", values?.rows?.length)}

            <Stack spacing={2}>
              <LoadingButton
                variant="contained"
                size="large"
                startIcon={<Iconify icon="bx:bxs-check-circle" />}
                type="submit"
                loading={isSubmitting || isCreatingProduct}
                disabled={values?.rows?.length === 0}
              >
                Submit & Add Product
              </LoadingButton>
              <small style={{ color: 'red' }}>{matrixErr}</small>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
