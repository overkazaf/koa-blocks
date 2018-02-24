function ResponseDTO(code = 0, message = '', result = null) {
    return {
        code,
        message,
        result,
    };
}
module.exports = ResponseDTO;