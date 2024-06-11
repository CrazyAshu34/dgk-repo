import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllAmc = () => {
  const { data, isError, isLoading } = useQuery(['_getAllAmc'], () => api.get('/productamc/all'), {
    enabled: true,
  });
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetOneAmcHistoryDataById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneAmcHistoryById'], () =>
    api.get(`/productamc/all/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetDetailOneAmcById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneAmcById'], () =>
    api.get(`/productamc/one/${id}`)
  );
  return {
    data: data?.data?.data[0],
    isLoading,
    isError,
  };
};
export const useGetOneAmcById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneAmcById'], () =>
    api.get(`/productamc/single/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useCreateAmc = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/productamc/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createAmc']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createAmc: mutate,
    isLoading,
  };
};

export const useUpdateAmcById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/productamc/update/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getOneAmcHistoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateAmc: mutate, isLoading };
};

export const useUpdateAllAmcById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/productamc/updateall/${formData?._id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getallAmcHistoryById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateAllAmc: mutate, isLoading };
};

export const useUpdateAmcTableById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/productamc/update/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllAmc']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { updateAmc: mutate, isLoading };
};

export const useDeleteAmcById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/productamc/delete/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getAllAmc']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteAmc: mutate };
};
