import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllService = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllService'],
    () => api.get('/servicemanagement/all'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetOneServiceById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneServiceById'], () =>
    api.get(`/servicemanagement/one/${id}`)
  );
  return {
    data: data?.data?.data[0],
    isLoading,
    isError,
  };
};

export const useCreateService = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/servicemanagement/add', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createService']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createService: mutate,
    isLoading,
  };
};

export const useUpdateServiceById = () => {

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      console.log("formData==",formData);
      const id = formData._id;
      return api.put(`/servicemanagement/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateServiceById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateService: mutate,
    isLoading,
  };
};

export const useDeleteServiceById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/servicemanagement/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteServiceById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteService: mutate };
};

export const useStatusUpdateAmcStatusById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/servicemanagement/updateStatus/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateAmcStatusById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateAmcStatus: mutate,
  };
};

export const useStatusUpdateStatusById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/servicemanagement/updateStatus/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllService']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateStatus: mutate,
  };
};
export const useUpdateViewStatus = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payload) => {
      const formdata = payload;
      return api.put(`/servicemanagement/updateViewStatus`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllService']);
      },
      onError: (error) => {
   //     enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateViewstatus: mutate,
  };
};