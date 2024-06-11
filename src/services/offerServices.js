import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllOffer = () => {
  const { data, isError, isLoading } = useQuery(['_getAllOffer '], () => api.get('/offer/all'), {
    enabled: true,
  });
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetOneOfferById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneOfferById'], () =>
    api.get(`/offer/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateOffer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/offer/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createOffer']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createOffer: mutate,
    isLoading,
  };
};

export const useUpdateOfferById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/offer/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateOfferById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateOffer: mutate,
    isLoading,
  };
};

export const useDeleteOfferById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/offer/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteOfferById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteOffer: mutate };
};
