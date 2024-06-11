import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllNotification = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllNotification'],
    () => api.get('/notification/all'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.notification,
    isLoading,
    isError,
  };
};

export const useGetNotificationById = (id) => {
  const { data, isError, isLoading } = useQuery(
    ['_getNotificationById', id],
    () => api.get(`/notification/one/${id}`),

  );
  return {
    data: data?.data?.notification,
    isLoading,
    isError,
  };
};

export const useCreateNotification = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/notification/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllNotification']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message || 'error', { variant: 'error' });
        // enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createNotification: mutate,
    isLoading,
  };
};

export const useUpdateNotificationById = () => {

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.id;
      console.log("fsdfff", id);
      return api.put(`/notification/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllNotification']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message || 'error', { variant: 'error' });
        // enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateNotification: mutate,
    isLoading,
  };
};

export const useDeleteNotificationById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/notification/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_getAllNotification']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteNotification: mutate };
};
