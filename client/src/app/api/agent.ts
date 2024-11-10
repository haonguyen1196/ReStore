import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5000/api/";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const responseBody = (response: AxiosResponse) => response.data;

// đánh chặn và trả về lỗi gọn gàng từ server
axios.interceptors.response.use(
    async (response) => {
        await sleep();
        return response;
    },
    (error: AxiosError) => {
        const { data, status } = error.response as AxiosResponse;

        switch (status) {
            case 400:
                // lỗi validation sẽ trả về mảng các lỗi
                if (data.errors) {
                    const modalStateErrors: string[] = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                }

                // lỗi thông thường sẽ trả về title
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
        }
        return Promise.reject(error.response);
    }
);

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) =>
        axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
    list: () => request.get("products"),
    details: (id: string) => request.get(`products/${id}`),
};

const TestErrors = {
    get404Error: () => request.get("buggy/not-found"),
    get400Error: () => request.get("buggy/bad-request"),
    get401Error: () => request.get("buggy/unauthorized"),
    get500Error: () => request.get("buggy/server-error"),
    getValidationError: () => request.get("buggy/validation-error"),
};

const agent = {
    Catalog,
    TestErrors,
};

export default agent;
