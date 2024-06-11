/* eslint-disable react/jsx-no-comment-textnodes */
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// assets
import { UploadIllustration } from 'assets/illustrations';
//
import Iconify from '../iconify';
//
import { getFormattedImageURL } from '../../utils/helper';
import RejectionFiles from './errors/RejectionFiles';
import SingleFilePreview from './preview/SingleFilePreview';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
    height: '100px',
    outline: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    padding: theme.spacing(5),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    backgroundColor: theme.palette.background.neutral,
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
    '&:hover': {
        opacity: 0.72,
    },
}));

// ----------------------------------------------------------------------

Uploads.propTypes = {
    sx: PropTypes.object,
    error: PropTypes.bool,
    files: PropTypes.array,
    file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onDelete: PropTypes.func,
    onRemove: PropTypes.func,
    onUpload: PropTypes.func,
    thumbnail: PropTypes.bool,
    helperText: PropTypes.node,
    onRemoveAll: PropTypes.func,
    placeholder: PropTypes.string,
};

export default function Uploads({
    disabled,
    multiple = false,
    error,
    helperText,
    placeholder = 'Drag and drop your file here or click',
    //
    file,
    onDelete,
    //
    files,
    thumbnail,
    onUpload,
    onRemove,
    onRemoveAll,
    sx,
    ...other
}) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple,
        disabled,
        ...other,
    });

    const hasFile = !!file && !multiple;

    const hasFiles = files && multiple && files.length > 0;

    const isError = isDragReject || !!error;

    return (
        <Box sx={{ width: 1, position: 'relative', ...sx }}>
            <Stack spacing={2} sx={{ textAlign: 'center' }} direction="row">
                <StyledDropZone
                    {...getRootProps()}
                    sx={{
                        //  if the file is uploaded, the dropzone will be smaller
                        width: '100%',
                        ...(isDragActive && {
                            opacity: 0.72,
                        }),
                        ...(isError && {
                            color: 'error.main',
                            bgcolor: 'error.lighter',
                            borderColor: 'error.light',
                        }),
                        ...(disabled && {
                            opacity: 0.48,
                            pointerEvents: 'none',
                        }),
                        ...(hasFile && {
                            padding: '12% 0',
                        }),
                    }}
                >
                    <input {...getInputProps()} />

                    <Placeholder
                        placeholder={placeholder}
                        sx={{
                            ...(hasFile && {
                                opacity: 0,
                                width: '70%',
                            }),
                        }}
                    />

                    {hasFile && <SingleFilePreview file={file} />}
                </StyledDropZone>

                {hasFiles && (
                    <>
                        <Stack
                            direction="column"
                            justifyContent="flex-end"
                            spacing={1.5}
                            sx={{
                                width: '30%',
                            }}
                        >
                            {onRemoveAll && (
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    size="small"
                                    onClick={onRemoveAll}
                                    sx={{
                                        width: {
                                            xs: '100px',
                                            sm: '100%',
                                        },
                                        height: {
                                            xs: '28px',
                                            sm: '100%',
                                        },
                                    }}
                                >
                                    Remove all
                                </Button>
                            )}
                            {/* 
              {onUpload && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={onUpload}
                  sx={{
                    width: {
                      xs: '100px',
                      sm: '100%',
                    },
                    height: {
                      xs: '28px',
                      sm: '100%',
                    },
                  }}
                >
                  Upload files
                </Button>
              )} */}
                        </Stack>
                    </>
                )}
            </Stack>

            {helperText && helperText}

            <RejectionFiles fileRejections={fileRejections} />

            {hasFile && onDelete && (
                <IconButton
                    size="small"
                    onClick={onDelete}
                    sx={{
                        top: 16,
                        right: 16,
                        zIndex: 9,
                        position: 'absolute',
                        color: (theme) => alpha(theme.palette.common.white, 0.8),
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                        },
                    }}
                >
                    <Iconify icon="eva:close-fill" width={18} />
                </IconButton>
            )}

            {hasFiles && (
                <>
                    <Box
                        sx={{
                            my: 3,
                        }}
                    >
                        {/* <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} /> */}
                    </Box>

                    {/* <Box sx={{ textAlign: 'center', display: 'flex' }}>
            {files?.map((item) =>
              item?.values.map((value, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    width: '100px',
                    height: '100px',
                    position: 'relative',

                    m: 2,
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      borderRadius: '8px',
                      m: 1,
                      objectFit: 'cover',
                      width: '190px',
                      height: '100px',
                    }}
                    alt="The house from the offer."
                    src={value.url}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onRemove(value)}
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -18,
                      width: 24,
                      height: 24,

                      color: (theme) => alpha(theme.palette.common.white, 0.8),
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" width={18} />
                  </IconButton>
                </Box>
              ))
            )}
          </Box> */}
                    <Box sx={{ textAlign: 'center', display: 'flex' }}>
                        {files?.map((item, i) =>
                            // item?.values.map((value, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    width: '100px',
                                    height: '100px',
                                    position: 'relative',

                                    m: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        borderRadius: '8px',
                                        m: 1,
                                        objectFit: 'cover',
                                        width: '190px',
                                        height: '100px',
                                    }}
                                    alt="The house from the offer."
                                    src={getFormattedImageURL(item)}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => onRemove(item)}
                                    sx={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -18,
                                        width: 24,
                                        height: 24,

                                        color: (theme) => alpha(theme.palette.common.white, 0.8),
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                        },
                                    }}
                                >
                                    <Iconify icon="eva:close-fill" width={18} />
                                </IconButton>
                            </Box>
                            //    ))
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

Placeholder.propTypes = {
    sx: PropTypes.object,
    placeholder: PropTypes.string,
};
function extractHexColorsFromString(inputString) {
    const hexColorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;
    const hexColors = inputString.match(hexColorRegex);
    return hexColors || [];
}
function Placeholder({ sx, placeholder, ...other }) {
    return (
        <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            direction={{
                xs: 'column',
                md: 'row',
            }}
            sx={{
                width: 1,
                height: 1,
                textAlign: {
                    xs: 'center',
                    md: 'left',
                },
                ...sx,
            }}
            {...other}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                <UploadIllustration sx={{ width: 100 }} />
                <Typography gutterBottom variant="h5" style={{ color: extractHexColorsFromString(placeholder) || 'black' }}>
                    {placeholder}
                </Typography>
            </Stack>
        </Stack>
    );
}
