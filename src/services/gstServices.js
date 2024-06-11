import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllGst = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllGst'],
    () => api.get('/gst/all'),
    { enabled: true }
  );
  console.log("data=====",data);
  return {
    data: data?.data?.gst,
    isLoading,
    isError,
  };
};
export const useGetAllActiveGst = () => {
    const { data, isError, isLoading } = useQuery(
      ['_getGetAllGst'],
      () => api.get('/gst/allActive'),
      { enabled: true }
    );
    return {
      data: data?.data?.gst,
      isLoading,
      isError,
    };
  };
export const useGetOneGstById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneGstById'], () =>
    api.get(`/gst/one/${id}`)
  );
  return {
    data: data?.data?.gst,
    isLoading,
    isError,
  };
};

export const useCreateGst = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/gst/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createGst']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createGst: mutate,
    isLoading,
  };
};

export const useUpdateGstById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/gst/update/${formData?._id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateGstById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    UpdateGst: mutate,
    isLoading,
  };
};

export const useDeleteGstById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/gst/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteGstById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { deleteGst: mutate };
};
