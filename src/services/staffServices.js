import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllServiceStaff = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllServiceStaff'],
    () => api.get('/adminuser/allServiceManager'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useGetAllOnlineServiceStaff = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllOnlineServiceStaff'],
    () => api.get('/adminuser/onlineServiceManager'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useGetAllStaffData = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllStaffData'],
    () => api.get('/adminuser/allStaff'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};


export const useGetAllStaff = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllStaff'],
    () => api.get('/adminuser/all'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useGetOneStaffById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOneStaffById'], () =>
    api.get(`/adminuser/adminone/${id}`)
  );
  return {
    data: data?.data?.user,
    isLoading,
    isError,
  };
};

export const useCreateStaff = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      return api.post('/adminuser/signup', formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createStaff']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createStaff: mutate,
    isLoading,
  };
};

export const useUpdateStaffById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData.get('id');
      return api.put(`/adminuser/update/${id}`, formData);
    },
    {
      onSuccess: (data) => {
        console.log("error=",data);
        queryClient.invalidateQueries(['_updateStaffById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (errors) => {
        console.log("error==",errors?.response?.data?.errors[0]?.msg);
        enqueueSnackbar(errors?.response?.data?.errors[0]?.msg || 'error');
        console.log(errors);
      },
    }
  );
  return {
    updateStaff: mutate,
    isLoading,
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
      return api.put(`/adminuser/updatepassword/${id}`, formData);
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

export const useStatusUpdateStaffById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (data) => {
      const formData = data;
      return api.put(`/adminuser/updateStatus/${formData?.id}`, formData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateStaffById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateStaff: mutate,
  };
};

export const useDeleteStaffById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/adminuser/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteStaffById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteStaff: mutate };
};
export const useGetAllDeleteStaffRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDeleteStaffRecyclebin'],
    () => api.get('/adminuser/getdeletedatas'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};
export const useEmptyAllDataStaff = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.delete(`/adminuser/emptyalldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
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
export const usePermanentlyDeleteStaffById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/adminuser/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteStaff: mutate };
};
export const useReStoreAllDataStaff = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () =>  api.put(`/adminuser/restorealldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
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
export const useReStoreDataStaffById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/adminuser/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteStaffRecyclebin']);
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
