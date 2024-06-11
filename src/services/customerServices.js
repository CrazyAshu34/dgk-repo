import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllCustomers = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllCustomers'],
    () => api.get('/customer/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.users,
    isLoading,
    isError,
  };
};

export const useGetOneCustomerById = (id) => {
  console.log("fdfff=", id);
  const { data, isError, isLoading } = useQuery(['_getOneCustomerById'], () =>
    api.get(`/customer/one/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetAddressCustomerById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getAddressCustomerById'], () =>
    api.get(`/address/custAddress/${id}`)
  );
  return {
    data: data?.data?.address,
    isLoading,
    isError,
  };
};

export const useGetAllAddressCustomers = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllAddressCustomers'],
    () => api.get('/pincode/all'),
    { enabled: true }
  );
  return {
    data: data?.data?.pincode,
    isLoading,
    isError,
  };
};

export const useGetOrderAddressCustomerById = (id) => {
  const { data, isError, isLoading } = useQuery(['_getOrderAddressCustomerById'], () =>
    api.get(`/order/admin/customer-order-list/${id}`)
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetWishlistCustomerId = (id) => {
  const { data, isError, isLoading } = useQuery(['_getWishlistCustomerById'], () =>
    api.get(`/wishlist/customeradmin/${id}`)
  );
  // console.log("data==",data);
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetCartCustomerId = (id) => {
  const { data, isError, isLoading } = useQuery(['_getCartCustomerById'], () =>
    api.get(`/cart/customeradmin/${id}`)
  );
  console.log("data==", data);
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useGetAllDeleteCustomersRecyclebin = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getGetAllDeleteCustomersRecyclebin'],
    () => api.get('/customer/getdeletedatas'),
    { enabled: true }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};
export const useDeleteCustomerById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/customer/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteCustomerById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteCustomer: mutate };
};
export const useCreateCustomer = () => {
  console.log('ppppp');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const payload = data;
      console.log('////////', data);
      return api.post('/customer/add', payload);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_createCustomer']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    createCustomer: mutate,
    isLoading,
  };
};
export const useUpdateCustomerById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      // const formData = data;
      const id = data.id;
      return api.put(`/customer/updateByAdmin/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateCustomerById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateCustomer: mutate,
    isLoading,
  };
};
export const useEmptyAllDataCustomers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => api.delete(`/customer/emptyalldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteCustomersRecyclebin']);
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
export const usePermanentlyDeleteCustomersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/customer/permanentdeletedata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteCustomersRecyclebin']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { PermanentlyDeleteCustomers: mutate };
};
export const useReStoreAllDataCustomers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => api.put(`/customer/restorealldata`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteCustomersRecyclebin']);
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
export const useReStoreDataCustomersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (id) => {
      const _id = id;
      return api.put(`/customer/restoredata/${_id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_getGetAllDeleteCustomersRecyclebin']);
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