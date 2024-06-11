import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllHsn = () => {
    const { data, isError, isLoading } = useQuery(
        ['_getGetAllHsn'],
        () => api.get('/hsn/all'),
        { enabled: true }
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};
export const useGetOneHsnById = (id) => {
    const { data, isError, isLoading } = useQuery(['_getOneHsnById'], () =>
        api.get(`/hsn/one/${id}`)
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};

export const useCreateHsn = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.post('/hsn/add', formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_createHsn']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        createHsn: mutate,
        isLoading,
    };
};
export const useUpdateHsnById = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.put(`/hsn/update/${formData?._id}`, formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_updateHsnById']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        UpdateHsn: mutate,
        isLoading,
    };
};