import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllDealer = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDealer'],
    () => api.get('/retailer/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useGetOneDealerById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneDealerById'], () =>
    api.get(`/retailer/one/${id}`)
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useCreateDealer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/retailer/signup', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createDealer']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log('error', error);
      },
    }
  );
  return {
    createDealer: mutate,
    isLoading,
  };
};

export const useUpdateDealerStatusById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      return api.put(`/retailer/statusupdate/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDealerStatusById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateDealerStatus: mutate,
    isLoading,
  };
};

export const useUpdateDealerById = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?._id;
      return api.put(`/retailer/update/${id}`, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_updateDealerById']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return {
    updateDealer: mutate,
    isLoading,
  };
};

export const useDeleteDealerById = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/retailer/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteDealerById']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return { DeleteDealer: mutate };
};

export const useUpdateDealerStatusNewById = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => {
      const formdata = payload;
      return api.put(`/retailer/updatestatus/`, formdata);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateDealerStatusNewById']);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return {
    updateDealerStatusNew: mutate,
  };
};

export const useUpdatePasswordById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      console.log('formData', formData);
      const id = formData?.id;
      return api.put(`/retailer/changepassword/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updatePasswordById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updatePassword: mutate,
    isLoading,
  };
};
