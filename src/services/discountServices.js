import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllDiscounts = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDiscounts'],
    () => api.get('/coupon/allCoupons'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetOneDiscountById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneDiscountById'], () =>
    api.get(`/coupon/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateDiscount = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/coupon/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createDiscount']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createDiscount: mutate,
    isLoading,
  };
};

export const useUpdateDiscountById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/coupon/update/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDiscountById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    UpdateDiscount: mutate,
    isLoading,
  };
};

export const useDeleteDiscountById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/coupon/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteDiscountById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { deleteDiscount: mutate };
};
export const useUpdateStatusDiscountById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/coupon/updateStatus/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDiscountStatusById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    UpdateDiscountStatus: mutate,
    isLoading,
  };
};