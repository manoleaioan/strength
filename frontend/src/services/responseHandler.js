function handleResponse(response) {
    const { data } = response

    if (data && data.errors) {

        if (response.status === 401) {
            // auto logout if 401 response returned from api
            //logout();
            //location.reload(true);
        }

        const error = (data && data.errors[0]) || response.statusText;
        if (error?.message === "Unauthorized") {
            window.location.reload(false);
        }
        return Promise.reject(error);
    }
    return data;
}

module.exports = { handleResponse };