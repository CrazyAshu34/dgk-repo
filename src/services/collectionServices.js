import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllCollection = () => {
    const { data, isError, isLoading } = useQuery(
        ['_getGetAllCollection'],
        () => api.get('/collection/all'),
        { enabled: true }
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};

export const useGetOneCollectionById = (id) => {
    const { data, isError, isLoading } = useQuery(['_getOneCollectionById'], () =>
        api.get(`/collection/one/${id}`)
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};

export const useCreateCollection = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.post('/collection/add', formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_createCollection']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        createCollection: mutate,
        isLoading,
    };
};

export const useUpdateCollectionById = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            const id = formData.get('id');
            return api.put(`/collection/update/${id}`, formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_updateCollectionById']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        updateCollection: mutate,
        isLoading,
    };
};

export const useDeleteCollectionById = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        (id) => {
            const _id = id;
            return api.delete(`/collection/delete/${_id}`);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_deleteCollectionById']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return { DeleteCollection: mutate };
};

// slug generator
export const useCreateCollectionUniqueSlug = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.post('/collection/generateslug', formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_createCollectionUniqueSlug']);
            },
            onError: (error) => {
                console.log(error);
            },
        }
    );
    return {
        createCollectionSlug: mutate,
        isLoading,
    };
};



