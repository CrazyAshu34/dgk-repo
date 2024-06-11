import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllClient = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllClient'],
    () => api.get('/client/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetOneClientById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneClientById'], () =>
    api.get(`/client/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateClient = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/client/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createClient']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createClient: mutate,
    isLoading,
  };
};

export const useUpdateClientById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/client/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateClientById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateClient: mutate,
    isLoading,
  };
};

export const useDeleteClientById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/client/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteClientById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteClient: mutate };
};
