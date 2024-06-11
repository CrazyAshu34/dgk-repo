import PropTypes from 'prop-types';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

export default function RHFAutocomplete({ name, label, type, placeholder, helperText, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error}
              type={type}
              helperText={error ? error?.message : helperText}
              placeholder={placeholder}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
