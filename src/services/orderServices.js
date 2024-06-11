/* eslint-disable no-else-return */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../components/snackbar';
import api from './api';

export const useGetAllOrders = () => {
  const { data, isError, isLoading } = useQuery(['_getAllOrders'], () => api.get('/order/admin/list'), {
    enabled: true,
  });
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetAllShiprocketOrders = (status) => {
  console.log("ok");
};
export const useGetAllB2COrders = () => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllOrdersB2C'],
    () => api.get('/order/all/b2c'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.orders,
    isLoading,
    isError,
  };
};
export const useGetAllB2BOrders = (currentTab) => {
  const { data, isError, isLoading } = useQuery(
    ['_getAllOrdersB2B', currentTab],
    () => api.get('/order/all/b2b'),
    {
      enabled: true,
    }
  );
  return {
    data: data?.data?.orders,
    isLoading,
    isError,
  };
};

export const useGetOrderById = (id) => {
  console.log('id12', id);
  const { data, isError, isLoading } = useQuery(
    ['_getOrderById', id],
    () => api.get(`/order/admin/list/${id}`),
    { enabled: !!id }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useUpdateOrdersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      console.log('formData', formData);
      const id = formData?._id;
      return api.put(`/order/update/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateBannerById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateOrder: mutate,
    isLoading,
  };
};
export const useCancelOrderById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;
      const id = formData?.orderId;
      return api.put(`/order/cancel-order-by-admin/${id}`, data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateOrderCancelById']);
        queryClient.invalidateQueries(['_getAllOrders']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        console.log('error', error?.response?.data?.message);
        enqueueSnackbar(error?.response?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    cancelOrder: mutate,
    isLoading,
  };
};
export const useExchangeAndCreateOrderById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const payload = data;
      const id = payload?.orderId;
      return api.put(`/order/admin/update-exchange-status-and-create-shiprocketOrder/${id}`, payload);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_exchangeAndCreateOrderById']);
        queryClient.invalidateQueries(['_getAllOrders']);

        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        console.log('error', error?.response?.data?.message);
        enqueueSnackbar(error?.response?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    exchangeAndCreateOrder: mutate,
    isLoading,
  };
}
export const useUpdateOrderStatusById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      const formData = data;

      const id = formData?.orderId;
      if (formData?.updateStatus === "EXCHANGE_INITIATED") {
        const payload = {
          exchangeStatus: data?.orderStatus,
        };
        return api.put(`/order/admin/update-exchange-status/${id}`, payload);
      } else if (formData?.updateStatus === "RETURN_INITIATED") {

        const payload = {
          returnStatus: data?.orderStatus,
          refundStatus: data?.orderStatus === "RETURN_PRODUCT_PICKED_UP" ? "PROCESSING" : data?.orderStatus === "RETURNED" ? "COMPLETED" : data?.orderStatus === "RETURN_ACCEPTED" ? "ACCEPTED" : ""
        };
        return api.put(`/order/admin/update-return-status/${id}`, payload);

      } else {
        return api.put(`/order/admin/update-order-status/${id}`, data);
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateOrderStatusrById']);
        queryClient.invalidateQueries(['_getAllOrders']);
        queryClient.invalidateQueries(['_getAllShiprocketOrders']);
        queryClient.invalidateQueries(['_getShiprocketAllOrdersDatas']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        console.log('error', error?.response?.data?.message);
        enqueueSnackbar(error?.response?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateOrderStatus: mutate,
    isLoading,
  };
};
export const useDeleteOrdersById = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, data } = useMutation(
    (id) => {
      const _id = id;
      return api.delete(`/order/delete/${_id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['_deleteOrderById']);
        enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return { DeleteBanner: mutate };
};

export const useUpdateOderViewStatus = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (payloadData) => {
      const payload = payloadData;
      console.log("payload=", payload);
      return api.put(`/order/admin/updateViewStatus`, payload);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['_updateorderVeiwStatus']);
        //  enqueueSnackbar(data?.data?.message || 'success');
      },
      onError: (error) => {
        // enqueueSnackbar(error?.data?.message || 'error');
        console.log(error);
      },
    }
  );
  return {
    updateOdersViewStatus: mutate,
  };
};

export const useGetOrderLogs = (id) => {

  const { data, isError, isLoading } = useQuery(
    ['_getOrderLogs', id],
    () => api.get(`/order/orderlog/${id}`),
    { enabled: !!id }
  );
  return {
    data: data?.data?.data,
    isLoading,
    isError,
  };
};

export const useGetShiprocketLoginToken = () => {
  console.log("ok");
};
export const useGetShiprocketAllOrderData = () => {
  console.log("ok");
};