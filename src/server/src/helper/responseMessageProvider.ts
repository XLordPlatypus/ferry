
export const newResponseMessage = (successful: boolean, data: {}, message: string) => {
    return {
        success: successful,
        data: data,
        message: message
    }
}