import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllBanners = () => {
  const { data, isError, isLoading } = useQuery(['_getAllBanners'], () => api.get('/banner/all'), {
    enabled: true,
  });
  return {
    data: data?.data?.banners,
    isLoading,
    isError,
  };
};

export const useGetBannerById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getBannerById'], () =>
    api.get(`/banner/one/${id}`)
  );
  return {
    data: data?.data?.banner,
    isLoading,
    isError,
  };
};

export const useCreateBanners = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/banner/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createBanners']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createBanner: mutate,
    isLoading,
  };
};

export const useUpdateBannersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/banner/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateBannerById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateBanner: mutate,
    isLoading,
  };
};

export const useDeleteBannersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/banner/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteBannerById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteBanner: mutate };
};
