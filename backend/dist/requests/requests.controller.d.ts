import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { TAuthResponse } from '../auth/types';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(req: TAuthResponse, createRequestDto: CreateRequestDto): Promise<import("./entities/request.entity").Request>;
    findIncoming(req: TAuthResponse): Promise<import("./entities/request.entity").Request[]>;
    findOutgoing(req: TAuthResponse): Promise<import("./entities/request.entity").Request[]>;
    update(req: TAuthResponse, id: string, updateRequestDto: UpdateRequestDto): Promise<import("./entities/request.entity").Request>;
    remove(req: TAuthResponse, id: string): Promise<{
        message: string;
    }>;
}
