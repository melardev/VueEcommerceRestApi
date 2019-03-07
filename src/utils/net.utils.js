export function stripResponse(response) {
    delete response.success;
    delete response.full_messages;
    return response;
}
