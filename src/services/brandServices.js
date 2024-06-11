import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllBrand = () => {
  const { data, isError, isLoading } = useQuery(['_getGetAllBrand'], () => api.get('/brand/all'), {
    enabled: true,
  });
  return {
    data: data?.data?.brands,
    isLoading,
    isError,
  };
};

export const useGetOneBrandById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneBrandById'], () =>
    api.get(`/brand/one/${id}`)
  );
  return {
    data: data?.data?.brand,
    isLoading,
    isError,
  };
};

export const useCreateBrand = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/brand/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createBrand']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createBrand: mutate,
    isLoading,
  };
};

export const useUpdateBrandById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/brand/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateBrandById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateBrand: mutate,
    isLoading,
  };
};

export const useDeleteBrandById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/brand/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteBrandById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteBrand: mutate };
};

// unique slug generator
export const useCreateBrandUniqueSlug = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/brand/generateslug', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createProductUniqueSlug']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return {
    generateUniqueSlug: mutate,
  };
};