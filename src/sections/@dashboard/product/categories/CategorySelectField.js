import { Box, Stack } from '@mui/system';
import PropTypes from 'prop-types';
import { RHFAutocomplete } from 'components/hook-form';
import React from 'react';
import { useGetAllCategories } from 'services/categoryServices';
import { useGetOneSubCategoriesById } from 'services/subCategoryServices';

CategorySelectField.propTypes = {
  name: PropTypes.string,
  list: PropTypes.array,
  label: PropTypes.string,
  url: PropTypes.string,
};
export const GetOptionsData = (id) => {
  const { data } = useGetOneSubCategoriesById(id);
  console.log('data', data);
  return data;
};
function CategorySelectField({ name, label, url, list }) {
  const getFinalList = () => {
    list?.map((id) => {
      const values = GetOptionsData(id);
      console.log('options', values);
      return 0;
    });
    //     list?.forEach((id) => {
    //         const newOptions = [];
    //         const values = GetOptionsData(id);
    //         console.log("options",values)
    // //   newOptions?.push(values);
    // //   return { newOptions };
    // });
  };
  const options = getFinalList();
  //   console.log("otions",options)
  return (
    <Box>
      <Stack>
        {/* <RHFAutocomplete
          name={name}
          label={label}
          //   onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          multiple
          freeSolo
          options={data?.map((option) => option?._id)}
          ChipProps={{ size: 'small' }}
        /> */}
      </Stack>
    </Box>
  );
}

export default CategorySelectField;
