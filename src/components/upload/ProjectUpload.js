import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { m, AnimatePresence } from 'framer-motion';
import {
  Box,
  Stack,
  Button,
  Typography,
  Paper,
  List,
  IconButton,
  ListItemText,
  ListItem,
} from '@mui/material';
import Image from 'components/image/Image';
//
import Iconify from '../iconify';
import { UploadIllustration } from '../../assets/illustrations';
import { fData } from '../../utils/formatNumber';
import { fileData } from '../file-thumbnail';
import { varFade } from '../animate';
// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

ProjectUpload.propTypes = {
  files: PropTypes.array.isRequired,
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function ProjectUpload({
  error,
  showPreview = false,
  files,
  onUpload,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} />

        <ProjectBlockContent />
      </DropZoneStyle>

      {fileRejections?.length > 0 && <ProjectRejectionFiles fileRejections={fileRejections} />}

      <ProjectMultipleFilePreview files={files} showPreview={showPreview} onRemove={onRemove} />

      {files?.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Remove all
          </Button>
          {/* <Button size="small" variant="contained" onClick={onUpload}>
            Upload files
          </Button> */}
        </Stack>
      )}

      {helperText && helperText}
    </Box>
  );
}
export function ProjectBlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Drop or Select file
          {/* Certificate / Verficatiion doc */}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop files here or click&nbsp;
          <Typography
            variant="body2"
            component="span"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
          >
            browse
          </Typography>
          &nbsp;thorough your machine
        </Typography>
      </Box>
    </Stack>
  );
}
ProjectRejectionFiles.propTypes = {
  fileRejections: PropTypes.array.isRequired,
};
export function ProjectRejectionFiles({ fileRejections }) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                - {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

ProjectMultipleFilePreview.propTypes = {
  files: PropTypes.array.isRequired,
  onRemove: PropTypes.func,
  showPreview: PropTypes.bool,
};

export function ProjectMultipleFilePreview({ showPreview = false, files, onRemove }) {
  const hasFile = files?.length > 0;
  return (
    <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
      <AnimatePresence>
        {files?.map((file, index) => {
          if (showPreview) {
            return (
              <ListItem
                key={index}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex',
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Image alt="preview" src={file?.location} ratio="1/1" />

                {onRemove && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                )}
              </ListItem>
            );
          }

          return (
            <ListItem
              key={index}
              component={m.div}
              {...varFade().inRight}
              sx={{
                my: 1,
                px: 2,
                py: 0.75,
                borderRadius: 0.75,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Iconify
                icon="eva:file-fill"
                sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }}
              />

              <ListItemText
                primary={typeof file === 'string' ? file : file?.fieldName}
                secondary={typeof file === 'string' ? '' : fData(file?.size || 0)}
                primaryTypographyProps={{ variant: 'subtitle2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />

              {onRemove && (
                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              )}
            </ListItem>
          );
        })}
      </AnimatePresence>
    </List>
  );
}

export function getFileData(file, index) {
  if (typeof file === 'string') {
    return {
      key: index ? `${file}-${index}` : file,
      preview: file,
    };
  }

  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}
