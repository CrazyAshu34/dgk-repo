import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllColorFamilies = () => {
    const { data, isError, isLoading } = useQuery(
        ['_getGetAllColorFamilies'],
        () => api.get('/colorfamilies/all'),
        { enabled: true }
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};

export const useGetOneColorFamilyById = (id) => {
    const { data, isError, isLoading } = useQuery(['_getOneColorFamilyById'], () =>
        api.get(`/colorfamilies/one/${id}`)
    );
    return {
        data: data?.data?.data,
        isLoading,
        isError,
    };
};

export const useCreateColorFamilies = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.post('/colorfamilies/add', formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_createColorFamili']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        createColorFamili: mutate,
        isLoading,
    };
};

export const useUpdateColorFamiliById = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        (data) => {
            const formData = data;
            return api.put(`/colorfamilies/update/${formData?.id}`, formData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['_updateColorFamiliById']);
                enqueueSnackbar(data?.data?.message || 'success');
            },
            onError: (error) => {
                enqueueSnackbar(error?.data?.message || 'error');
                console.log(error);
            },
        }
    );
    return {
        UpdateColorFamili: mutate,
        isLoading,
    };
};

