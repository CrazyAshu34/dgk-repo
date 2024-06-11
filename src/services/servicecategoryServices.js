import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllServiceCategories = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllServiceCategories'],
    () => api.get('/servicecategory/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.servicecategorys,
    isLoading,
    isError,
  };
};

export const useGetOneServiceCategoryById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneServiceCategoryById'], () =>
    api.get(`/servicecategory/one/${id}`)
  );
  return {
    data: data?.data?.servicecategory,
    isLoading,
    isError,
  };
};

export const useCreateServiceCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/servicecategory/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createServiceCategory']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createServiceCategory: mutate,
    isLoading,
  };
};

export const useUpdateServiceCategoryById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/servicecategory/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateServiceCategoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateServiceCategory: mutate,
    isLoading,
  };
};

export const useDeleteServiceCategoryById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/servicecategory/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteServiceCategoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteServiceCategory: mutate };
};
