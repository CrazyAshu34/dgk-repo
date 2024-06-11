import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllCategories = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllCategories'],
    () => api.get('/category/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.categorys,
    isLoading,
    isError,
  };
};

export const useGetOneCategoryById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneCategoryById'], () =>
    api.get(`/category/one/${id}`)
  );
  return {
    data: data?.data?.category,
    isLoading,
    isError,
  };
};

export const useCreateCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/category/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createCategory']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createCategory: mutate,
    isLoading,
  };
};

export const useUpdateCategoryById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/category/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateCategoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateCategory: mutate,
    isLoading,
  };
};

export const useDeleteCategoryById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/category/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteCategoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteCategory: mutate };
};

// slug generator
export const useCreateCategoryUniqueSlug = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/category/generateslug', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createCategoryUniqueSlug']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return {
    createCategorySlug: mutate,
    isLoading,
  };
};
export const useGetAllDeleteCategoriesRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllDeleteCategoriesRecyclebin'],
    () => api.get('/category/getdeletedatas'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useEmptyAllDataCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.delete(`/category/emptyalldata`),
     {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { EmptyAllData: mutate };
};
export const usePermanentlyDeleteCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/category/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteCategories: mutate };
};
export const useReStoreAllDataCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.put(`/category/restorealldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { ReStoreAllData: mutate };
};
export const useReStoreDataCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/category/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { ReStoreData: mutate };
};