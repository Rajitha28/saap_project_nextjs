const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
import axiosInstance from "utils/interceptor";
import { endpoints } from "constants/endpoint";

/**
 * The function `createCheckout` sends a POST request to the API endpoint to create a checkout session
 * for payment with the provided email.
 * @param email - The `createCheckout` function is an asynchronous function that takes an email as a
 * parameter. It makes a POST request to `/payment/create-checkout-session/?email=`
 * to create a checkout session for payment processing. If the request is successful, it returns the
 * JSON response. If
 * @returns The `createCheckout` function is returning the JSON response from the API after creating a
 * checkout session.
 */
export const createCheckout = async (email) => {
    try {
        const response = await axiosInstance.post(endpoints.createCheckout, { email });

        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
    }
};


/**
 * The function `getPaymentStatus` asynchronously fetches the payment status for a given session ID
 * from an API endpoint.
 * @param sessionId - sessionId is a unique identifier for a payment session that is used to check the
 * status of a payment transaction.
 * @returns The `getPaymentStatus` function returns a Promise that resolves to the JSON response from
 * the API endpoint that checks the payment status for a given session ID.
 */
export const getPaymentStatus = async () => {
    try {
        const response = await axiosInstance.get(endpoints.checkPaymentStatus);

        return response.data;
    } catch (error) {
        console.error('Error fetching payment status:', error);
       
    }
};
export const getInvoiceHistory = async (userId) => {
    try {
        const response = await axiosInstance.get(endpoints.getInvoiceHistory, {
            params: { user_id: userId }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching invoice history:', error);
        
    }
};


export const getInvoicePdf = async (filename) => {
    try {
        const response = await axiosInstance.get(endpoints.downloadInvoicePdf + filename, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/pdf'
            }
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error fetching invoice PDF:', error);
    }
};

export const trialPlan = async (userId) => {
    try {
        const response = await axiosInstance.post(endpoints.freeTrailPlan,  { id: userId });

        return response.data;
    } catch (error) {
        console.error('Error checking Current PLan:', error);
    }
};