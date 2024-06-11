import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllSuperSubCategories = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllSuperSubCategories'],
    () => api.get('/supersubcategory/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetAllSuperSubCategoriesBySubCat = (ids) => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllSuperSubCategoriesBySubCat', ids],
    () => api.get(`/supersubcategory/allByAnySubCategoryIds/${ids}`),
    { enabled: true }
  );
  return {
    data: data?.data?.supersubcategory,
    isLoading,
    isError,
  };
};
export const useGetOneSuperSubCategoriesById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneSuperSubCategoriesById'], () =>
    api.get(`/supersubcategory/one/${id}`)
  );
  
  return {
    data: data?.data.superSubCategory,
    isLoading,
    isError,
  };
};

export const useCreateSuperSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/supersubcategory/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createSuperSubCategories']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createSuperSubCategories: mutate,
    isLoading,
  };
};

export const useUpdateSuperSubCategoriesById = () => {
  // const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of formData.entries()) {
        console.log('keyvalue', key, value);
      }
      const id = formData.get('id');
      return api.put(`/supersubcategory/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateSuperSubCategoriesById']);
        // enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        // enqueueSnackbar(error || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateSuperSubCategories: mutate,
    isLoading,
  };
};

export const useDeleteSuperSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/supersubcategory/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_deleteSuperSubCategoriesById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteSuperSubCategory: mutate };
};
export const useGetAllDeleteSuperSubCategoriesRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllDeleteSubSubCategoriesRecyclebin'],
    () => api.get('/supersubcategory/getdeletedatas'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useEmptyAllDataSuperSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => api.delete(`/supersubcategory/emptyalldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubSubCategoriesRecyclebin']);
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
export const usePermanentlyDeleteSuperSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/supersubcategory/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubSubCategoriesRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteSuperSubCategories: mutate };
};
export const useReStoreAllDataSuperSubCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.put(`/supersubcategory/restorealldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubSubCategoriesRecyclebin']);
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
export const useReStoreDataSuperSubCategoriesById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/supersubcategory/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllDeleteSubSubCategoriesRecyclebin']);
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