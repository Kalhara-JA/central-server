import axios, { AxiosRequestConfig } from "axios";
import { IncomingHttpHeaders } from "http";


interface ZammadResponse {
    status: number;
    headers: any;
    data: any;
}

export const forwardToZammad = async (
    endpoint: string,
    method: string,
    body: any,
    headers: IncomingHttpHeaders,
    isFileRequest: boolean = false
): Promise<ZammadResponse> => {
    const url = `${process.env.ZAMMAD_API_URL}${endpoint}`;

    // Creating a properly typed config object
    const config: AxiosRequestConfig = {
        method,
        url,
        headers,
        data: method !== 'GET' ? body : undefined,
    };

    // Only add responseType for file requests
    if (isFileRequest) {
        config.responseType = 'arraybuffer';
    }

    console.log('Forwarding request to Zammad:', {
        ...config,
        data: isFileRequest ? '[Binary Data]' : config.data
    });

    try {
        const response = await axios(config);
        return {
            status: response.status,
            headers: response.headers,
            data: response.data,
        };
    } catch (error: any) {
        console.error(`Error forwarding request to Zammad: ${error.response?.data || error.message}`);
        throw {
            status: error.response?.status || 500,
            headers: error.response?.headers || {},
            message: error.response?.data?.error || error.message || 'Failed to forward request',
        };
    }
};

export const createUserInZammadService = async (email: string, password: string, firstName: string, lastName: string): Promise<any> => {
    try {

        const body = {
            firstname: firstName,
            lastname: lastName,
            email,
            password: process.env.ZAMMAD_CUSTOMER_PASSWORD,
            "role_ids": "3",
            active: true,
        }

        const response = await axios.post(
            `${process.env.ZAMMAD_API_URL}/api/v1/users`, body,
            {
                headers: {
                    Authorization: `Token token=${process.env.ZAMMAD_ADMIN_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Failed to create user in Zammad:", error);
        throw new Error("Customer creation in Zammad failed");
    }
};

export const findUserByEmailFromZammad = async (email: string): Promise<any> => {
    try {
        const response = await axios.get(
            `${process.env.ZAMMAD_API_URL}/api/v1/users/search?query=${email}`,
            {
                headers: {
                    Authorization: `Token token=${process.env.ZAMMAD_ADMIN_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Failed to get user by email in Zammad:", error);
        throw new Error("Failed to get user by email in Zammad");
    }
};