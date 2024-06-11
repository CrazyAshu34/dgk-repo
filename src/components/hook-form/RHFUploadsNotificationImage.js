import PropTypes from 'prop-types';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar, UploadBox, Uploads } from '../upload';

// ----------------------------------------------------------------------

RHFUploadAvatarNotification.propTypes = {
    name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadAvatarNotification({ name, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <UploadAvatar
                        accept={{
                            'image/*': [],
                        }}
                        error={!!error}
                        file={field.value}
                        {...other}
                    />

                    {!!error && (
                        <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </div>
            )}
        />
    );
}

// ----------------------------------------------------------------------

RHFUploadBoxNotification.propTypes = {
    name: PropTypes.string,
};

export function RHFUploadBoxNotification({ name, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <UploadBox files={field.value} error={!!error} {...other} />
            )}
        />
    );
}

// ----------------------------------------------------------------------

RHFUploadsNotificationImage.propTypes = {
    name: PropTypes.string,
    multiple: PropTypes.bool,
    helperText: PropTypes.node,
};

export function RHFUploadsNotificationImage({ name, multiple, helperText, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) =>
                multiple ? (
                    <Uploads
                        multiple
                        accept={{ 'image/*': [] }}
                        files={field.value}
                        error={!!error}
                        helperText={
                            (!!error || helperText) && (
                                <FormHelperText error={!!error} sx={{ px: 2 }}>
                                    {error ? error?.message : helperText}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                ) : (
                    <Uploads
                        accept={{ 'image/*': [] }}
                        file={field.value}
                        error={!!error}
                        helperText={
                            (!!error || helperText) && (
                                <FormHelperText error={!!error} sx={{ px: 2 }}>
                                    {error ? error?.message : helperText}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                )
            }
        />
    );
}
