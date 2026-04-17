"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message, statusCode = 200) {
        return res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
    }
    static error(res, message, statusCode = 500, errors) {
        const response = {
            status: "error",
            message,
        };
        if (errors) {
            response.errors = errors;
        }
        return res.status(statusCode).json(response);
    }
    static paginated(res, data, page, limit, total) {
        return res.json({
            status: "success",
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response.js.map