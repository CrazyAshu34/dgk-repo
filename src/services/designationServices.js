import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllDesignation = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDesignation'],
    () => api.get('/designation/all'),
    { enabled: true }
  );
  console.log("desigdatga==",data);
  return {
    data: data?.data?.designation,
    isLoading,
    isError,
  };
};

export const useGetAllDesignationStatus = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDesignationStatus'],
    () => api.get('/designation/web/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.designation,
    isLoading,
    isError,
  };
};

export const useGetOneDesignationById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneDesignationById'], () =>
    api.get(`/designation/one/${id}`)
  );
  return {
    data: data?.data?.designation,
    isLoading,
    isError,
  };
};

export const useCreateDesignation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      console.log('data123', data);
      const formData = data;
      return api.post('/designation/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createDesignation']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createDesignation: mutate,
    isLoading,
  };
};

export const useUpdateDesignationById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/designation/update/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDesignationById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateDesignation: mutate,
    isLoading,
  };
};
