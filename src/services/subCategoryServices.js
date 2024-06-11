import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllSubCategories = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllSubCategories'],
    () => api.get('/subcategory/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetAllSubCategoriesByCategories = (ids) => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllSubCategoriesByCategories', ids],
    () => api.get(`/subcategory/allByCategoryIds/${ids}`),
    { enabled: true }
  );
   console.log("Action=",ids, data);
  return {
    data: data===undefined?[]:data?.data?.subcategory,
    isLoading,
    isError,
  };
};

export const useGetOneSubCategoriesById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneSubCategoriesById'], () =>
    api.get(`/subcategory/one/${id}`)
  );
  return {
    data: data?.data?.subcategory,
    isLoading,
    isError,
  };
};

export const useCreateSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/subcategory/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createSubCategories']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createSubCategories: mutate,
    isLoading,
  };
};

export const useUpdateSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/subcategory/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateSubCategoriesById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateSubCategories: mutate,
    isLoading,
  };
};

export const useDeleteSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/subcategory/delete/${_id}`);
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
  return { DeleteSubCategory: mutate };
};
export const useGetAllDeleteSubCategoriesRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllDeleteSubCategoriesRecyclebin'],
    () => api.get('/subcategory/getdeletedatas'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useEmptyAllDataSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => api.delete(`/subcategory/emptyalldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubCategoriesRecyclebin']);
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
export const usePermanentlyDeleteSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/subcategory/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteSubCategories: mutate };
};
export const useReStoreAllDataSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.put(`/subcategory/restorealldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubCategoriesRecyclebin']);
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
export const useReStoreDataSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/subcategory/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubCategoriesRecyclebin']);
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