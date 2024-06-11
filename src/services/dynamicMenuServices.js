import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllDynamicMenu = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllDynamicMenu'],
    () => api.get('/dynamicmenu/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
 

export const useGetOneDynamicMenuById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneDynamicMenuById'], () =>
    api.get(`/dynamicmenu/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateDynamicMenu = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/dynamicmenu/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createDynamicMenu']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createDynamicMenu: mutate,
    isLoading,
  };
};

export const useUpdateDynamicMenuById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/dynamicmenu/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDynamicMenuById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateDynamicMenu: mutate,
    isLoading,
  };
};

export const useDeleteDynamicMenuById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/dynamicmenu/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteSubCategoriesById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteDynamicMenu: mutate };
};
 
 
 
 
 