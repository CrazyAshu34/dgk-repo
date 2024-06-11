import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllBlog = () => {
  const { data, isError, isLoading } = useQuery(['_getAllBlogs'], () => api.get('/blog/all'), {
    enabled: true,
  });
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetOneBlogById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneBlogById'], () =>
    api.get(`/blog/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateBlog = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/blog/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createBlog']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {

        enqueueSnackbar(error?.response?.data?.message || 'error', { variant: 'error' });
        console.log(error);
      },
    }
  );
  return {
    createBlog: mutate,
    isLoading,
  };
};

export const useUpdateBlogById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.id;
      return api.put(`/blog/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateBlogById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message || 'error', { variant: 'error' });
        // enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateBlog: mutate, isLoading };
};

export const useDeleteBlogById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/blog/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteBlogById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteBlog: mutate };
};
