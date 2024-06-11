/* eslint-disable jsx-a11y/anchor-is-valid */
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import api from 'services/api';
import { RHFTextField, RHFUploadsNotificationImage } from '../../../components/hook-form';

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

const header = {
    'Content-Type': 'multipart/form-data',
};

export default function MoreData({ index, fieldName, setValue, descriptions, values }) {
    const [showMe, setShowMe] = useState(false);
    const [multipleShowMe, setMultipleShowMe] = useState(false);
    const [facebookMe, setFacebookMe] = useState(false);

    const [twitterMe, setTwitterMe] = useState(false);

    const [instagramMe, setInstagramMe] = useState(false);
    const [youtubeMe, setYoutubeMe] = useState(false);
    const [backLinkMe, setBackLinkMe] = useState(false);
    const [filesOne, setFilesOne] = useState(null);
    const [files, setFiles] = useState('');

    const onShowMe = () => {
        if (showMe) {
            setShowMe(false);
            setFiles('');
            setValue(`${fieldName}.images`, null);
            setValue(`${fieldName}.attachmentLink`, null);
        } else {
            setShowMe(true);
        }
    };

    const onMultipleShowMe = () => {
        if (multipleShowMe) {
            setMultipleShowMe(false);
            setValue(`${fieldName}.multipleimages`, null);
        } else {
            setMultipleShowMe(true);
        }
    };

    const onFacebookMe = () => {
        if (facebookMe) {
            setFacebookMe(false);
            setValue(`${fieldName}.facebookLink`, null);
        } else {
            setFacebookMe(true);
        }
    };

    const onTwitterMe = () => {
        if (twitterMe) {
            setTwitterMe(false);
            setValue(`${fieldName}.twitterLink`, null);
        } else {
            setTwitterMe(true);
        }
    };

    const onInstagramMe = () => {
        if (instagramMe) {
            setInstagramMe(false);
            setValue(`${fieldName}.instagramLink`, null);
        } else {
            setInstagramMe(true);
        }
    };

    const onYoutubeMe = () => {
        if (youtubeMe) {
            setYoutubeMe(false);
            setValue(`${fieldName}.youtubeLink`, null);
        } else {
            setYoutubeMe(true);
        }
    };

    const onBackLinkMe = () => {
        if (backLinkMe) {
            setBackLinkMe(false);
            setValue(`${fieldName}.backLink`, null);
            setValue(`${fieldName}.buttonTitle`, null);
        } else {
            setBackLinkMe(true);
        }
    };

    useEffect(() => {
        setValue(`${fieldName}._id`, index);

        if (descriptions?.length) {
            setValue(`${fieldName}.images`, descriptions[index]?.images);
            setFiles(descriptions[index]?.images);

            if (descriptions[index]?.multipleimages) {
                setMultipleShowMe(true);
            }
            if (descriptions[index]?.images) {
                setShowMe(true);
            }
            if (descriptions[index]?.facebookLink) {
                setFacebookMe(true);
            }
            if (descriptions[index]?.twitterLink) {
                setTwitterMe(true);
            }
            if (descriptions[index]?.instagramLink) {
                setInstagramMe(true);
            }
            if (descriptions[index]?.youtubeLink) {
                setYoutubeMe(true);
            }
            if (descriptions[index]?.backLink) {
                setBackLinkMe(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [descriptions]);

    const onHandleImage = async (value) => {
        setFilesOne(value);
        let formdata = new FormData();
        formdata.append('images', value);
        const response = await api.post('/image/upload', formdata, { headers: header });
        setValue(`${fieldName}.images`, response.data.images);
        console.log(response.data.image);
        setFiles(response.data.image);
    };

    const handleDrop = useCallback(
        async (acceptedFiles) => {
            let formdata = new FormData();

            acceptedFiles.forEach((element) => {
                formdata.append('multipleimages', element);
            });

            const response = await api.post('/image/multipleupload', formdata, {
                headers: header,
            });
            console.log("response.data.images=", response.data.images);
            setValue(`${fieldName}.multipleimages`, response.data.images);
        },
        [setValue]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values?.descriptions[index]?.multipleimages?.filter(
            (file) => file !== inputFile
        );
        setValue(`${fieldName}.multipleimages`, filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue(`${fieldName}.multipleimages`, []);
    };
    return (
        <>
            <RHFTextField
                multiline
                rows={6}
                label="Description"
                name={`${fieldName}.blogDescriptions`}
            />
            <br></br>
            <br></br>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: -2 }}>
                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={(event) => onMultipleShowMe(event)}>Multiple Image</a>
                    </LabelStyle>
                </div>
                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={(event) => onShowMe(event)}>Image</a>
                    </LabelStyle>
                </div>
                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={() => onFacebookMe()}>Facebook</a>
                    </LabelStyle>
                </div>

                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={() => onTwitterMe()}>Twitter</a>
                    </LabelStyle>
                </div>

                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={() => onInstagramMe()}>Instagram</a>
                    </LabelStyle>
                </div>

                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={() => onYoutubeMe()}>Youtube</a>
                    </LabelStyle>
                </div>

                <div>
                    <LabelStyle sx={{ mr: 3, cursor: 'pointer' }}>
                        <a onClick={() => onBackLinkMe()}>Button</a>
                    </LabelStyle>
                </div>
            </Box>

            {multipleShowMe ? (
                <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Images
                    </Typography>

                    <RHFUploadsNotificationImage
                        multiple
                        thumbnail
                        name={`${fieldName}.multipleimages`}
                        files={values?.descriptions[index]?.multipleimages}
                        maxSize={3145728}
                        onDrop={handleDrop}
                        onRemove={handleRemoveFile}
                        onRemoveAll={handleRemoveAllFiles}
                        onUpload={() => console.log('ON UPLOAD')}
                    />
                </Stack>
            ) : null}

            {showMe ? (
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
                            <label bel style={{ display: 'flex' }}>
                                {filesOne?.name
                                    ? filesOne?.name
                                    : files?.split('/').pop()
                                        ? files?.split('/').pop()
                                        : 'Choose Image'}
                            </label>
                            <LoadingButton variant="contained" sx={{ height: 80 }} component="label">
                                Upload File
                                <input type="file" onChange={(e) => onHandleImage(e.target.files[0])} hidden />
                            </LoadingButton>
                        </div>

                        <RHFTextField name={`${fieldName}.attachmentLink`} label="Attachment Link" />
                    </Box>
                </Box>
            ) : null}

            {facebookMe ? (
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                        <RHFTextField name={`${fieldName}.facebookLink`} label="Facebook Link" />
                    </Box>
                </Box>
            ) : null}

            {twitterMe ? (
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                        <RHFTextField name={`${fieldName}.twitterLink`} label="Twitter Link" />
                    </Box>
                </Box>
            ) : null}

            {instagramMe ? (
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                        {' '}
                        <RHFTextField name={`${fieldName}.instagramLink`} label="Instagram Link" />
                    </Box>
                </Box>
            ) : null}

            {youtubeMe ? (
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                        <RHFTextField
                            name={`${fieldName}.youtubeLink`}
                            defaultValue={null}
                            label="Youtube Link"
                        />
                    </Box>
                </Box>
            ) : null}

            {backLinkMe ? (
                <Box sx={{ mb: 1 }}>
                    <Stack sx={{ mt: 2 }} spacing={2}>
                        <RHFTextField name={`${fieldName}.buttonTitle`} label="Button Title" />
                        <RHFTextField name={`${fieldName}.backLink`} label="Back Link" />
                    </Stack>
                </Box>
            ) : null}
        </>
    );
}
