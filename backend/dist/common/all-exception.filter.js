"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AllExceptionFilter = class AllExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        }
        else if (exception instanceof typeorm_1.EntityNotFoundError) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = 'Entity not found';
        }
        else if (exception instanceof common_1.PayloadTooLargeException) {
            status = common_1.HttpStatus.PAYLOAD_TOO_LARGE;
            message = 'Payload too large';
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            const err = exception;
            if (err.code === '23505') {
                status = common_1.HttpStatus.CONFLICT;
                message = 'Duplicate entry';
            }
            else if (err.code === '22P02') {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = exception.message;
            }
        }
        else if (this.isCsrfError(exception)) {
            status = common_1.HttpStatus.FORBIDDEN;
            message = 'Invalid CSRF token';
        }
        else {
            console.error(exception);
        }
        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    isCsrfError(exception) {
        return (typeof exception === 'object' &&
            exception !== null &&
            'code' in exception &&
            exception.code === 'EBADCSRFTOKEN');
    }
};
exports.AllExceptionFilter = AllExceptionFilter;
exports.AllExceptionFilter = AllExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionFilter);
//# sourceMappingURL=all-exception.filter.js.map