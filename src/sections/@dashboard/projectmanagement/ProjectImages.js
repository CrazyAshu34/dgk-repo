/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */

import PropTypes from 'prop-types';

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useCreateProductImageUrl, useDeleteProductImageById } from 'services/productServices';
// @mui
// components
import LoadingButton from 'theme/overrides/LoadingButton';
import { Button } from '@mui/material';
import { ProjectUpload } from '../../../components/upload';

// ----------------------------------------------------------------------

AddProjectImages.propTypes = {
  tag: PropTypes.string,
};

export default function AddProjectImages({ tag }) {
  const { trigger } = useForm();
  const { control, setValue, watch, resetField } = useFormContext();
  const values = watch();
  const [pictures, setPictures] = useState([]);
console.log("values?.images=",values?.images);
  useEffect(() => {
    if (values?.images?.length > 0) {
      setPictures(values?.images);
    }
  }, [values?.images]);

  const { mutate: createImageUrl } = useCreateProductImageUrl();
  const { deletedata } = useDeleteProductImageById();

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
          return newArray.push(item);
        });
        setPictures(newArray);
        setValue('images', newArray);
      },
    });
  };

  const handleRemoveAll = () => {
    setValue('pictures', []);
    setPictures([]);
  };

  const handleRemove = (file) => {
    console.log(file);
    const filteredItems = values?.images?.filter((_file) => _file?.location !== file?.location);
    deletedata(file);
    setValue('images', filteredItems);
    setPictures(filteredItems);
  };
  console.log('values123', values?.images, pictures);

  return (
    <ProjectUpload
      multiple
      thumbnail
      showPreview={pictures?.length > 0}
      files={pictures || []}
      onDrop={handleDropMultiple}
      onRemove={handleRemove}
      onRemoveAll={() => handleRemoveAll()}
      onUpload={() => {
        console.log('');
      }}
      placeholder="Upload Images"
    />
  );
}
