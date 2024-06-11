import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllGeneralConfig = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllGeneralConfig'],
    () => api.get('/generalconfig/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.generalconfig,
    isLoading,
    isError,
  };
};

export const useUpdateGeneralConfigById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/generalconfig/update/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateGeneralConfigById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateGeneralConfig: mutate,
    isLoading,
  };
};
