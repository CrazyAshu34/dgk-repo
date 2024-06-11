import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllTestimonials = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllAllTestimonials'],
    () => api.get('/testimonials/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.testimonials,
    isLoading,
    isError,
  };
};

export const useGetOneTestimonialsById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneTestimonialsById'], () =>
    api.get(`/testimonials/one/${id}`)
  );
  return {
    data: data?.data?.testimonial,
    isLoading,
    isError,
  };
};

export const useCreateTestimonials = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/testimonials/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createTestimonials']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createTestimonials: mutate,
    isLoading,
  };
};

export const useUpdateTestimonialsById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/testimonials/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateTestimonialsById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateTestimonials: mutate, isLoading };
};

export const useDeleteTestimonialsById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/testimonials/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteTestimonialsById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteTestimonials: mutate };
};
