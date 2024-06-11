/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable arrow-body-style */

import PropTypes from 'prop-types';

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useCreateProductImageUrl, useDeleteProductImageById } from 'services/productServices';
// @mui
// components
import { Upload } from '../../../../components/upload';

// ----------------------------------------------------------------------

AddProductImages.propTypes = {
  tag: PropTypes.string,
};

export default function AddProductImages({ tag }) {
  const { trigger } = useForm();
  const { control, setValue, watch, resetField } = useFormContext();
  const values = watch();

  function mergeArray(arr) {
    const result = [];
    const map = new Map();

    for (const obj of arr) {
      if (map.has(obj.title)) {
        const existingObj = map.get(obj.title);
        // eslint-disable-next-line no-restricted-syntax
        for (const value of obj.values) {
          if (!existingObj.values.some((v) => v.id === value.id)) {
            existingObj.values.push(value);
          }
        }
      } else {
        const newObj = { title: obj.title, values: obj.values };
        result.push(newObj);
        map.set(obj.title, newObj);
      }
    }

    return result;
  }
  useEffect(() => {
    if (values?.images?.length > 0) {
      // const mergedData = mergeArray(values?.images);
      const mergedData = handleLocalImages(values?.images);
      setValue('images', []);
      setValue('images', mergedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.images.length]);

  const handleLocalImages = (allImages) => {
    const mergedData = allImages?.reduce((acc, curr) => {
      const existingData = acc.find((data) => data.title === curr.title);

      if (existingData) {
        existingData.values = [...new Set([...existingData.values, ...curr.values])];
      } else {
        acc.push(curr);
      }

      return acc;
    }, []);

    return mergedData;
  };

  const { mutate: createImageUrl } = useCreateProductImageUrl();
  const { deletedata } = useDeleteProductImageById();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const [files, setFiles] = useState([]);

  const watchFieldArray = watch('images');

  const controlledFiles = watchFieldArray?.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  // console.log('controlledFiles', controlledFiles);

  const handleDrop = useCallback(
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
    const requiredData = allS3Images.map((image) => {
      return {
        id: image.key,
        url: image?.key.split("/")[1],
      };
    });

    const newImages = [
      {
        title: tag,
        values: requiredData,
      },
    ];
    trigger();

    append(newImages);
  };

  const handleUpload = (imageName) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('productPictures', file);
    });

    createImageUrl(formData, {
      onSuccess: (imgUrl) => {
        console.log('IMAGES', imgUrl);
        const newImages = [
          {
            title: imageName,
            values: imgUrl?.data?.images,
          },
        ];
        append(newImages);
        setValue('images', newImages);
      },
    });
  };

  const handleRemoveFile = (keyValue) => {
    console.log('keyValue', keyValue);
    const newImages = values?.images?.filter((image) => image?.title === tag);
    console.log('newImages', newImages);
    // remove the image from the array  whose id is equal to the keyValue
    const filteredImages = newImages[0]?.values?.filter((image) => image.id !== keyValue.id);
    // set other tag value as it is and update the current tag value
    const otherTags = values?.images?.filter((image) => image?.title !== tag);
    console.log('otherTags', otherTags);
    const newImagesArray = [
      {
        title: tag,
        values: filteredImages,
      },
      ...otherTags,
    ];
    setValue('images', newImagesArray);

    // deletedata(keyValue);
  };
  const handleRemoveAllFiles = (keyValue) => {
    const newImages = values?.images?.filter((image) => image?.title !== keyValue);
    setValue('images', newImages);
  };

  // console.log('values123', values, files);
  const colorBox = (
    <div
      style={{
        backgroundColor: tag,
        padding: '2px 8px',
        borderRadius: '4px',
        height: '20px',
        width: '20px',

        border: '1px solid lightgray',
      }}
    ></div>
  );

  return (
    <Upload
      multiple
      thumbnail
      files={values.images.filter((image) => image.title === tag) || []}
      onDrop={handleDrop}
      onRemove={handleRemoveFile}
      onRemoveAll={() => handleRemoveAllFiles(tag)}
      onUpload={() => {
        handleUpload(`${tag}`);
      }}
      placeholder={
        <>
          Upload {tag !== "base" ? colorBox : null} {tag} Images
        </>
      }
    />
  );

}
