import {Participant} from '../data-types';
import {JsonRpcRequest, JsonRpcResponse, JsonRpcError, UserDeclinedErrorCode} from '../utils';

export type CloseAndWithdrawParams = {hub: Participant; playerParticipantId: string};
export type CloseAndWithdrawRequest = JsonRpcRequest<'CloseAndWithdraw', CloseAndWithdrawParams>;
export type CloseAndWithdrawResponse = JsonRpcResponse<{success: boolean}>;
export type UserDeclinedErrorResponse = JsonRpcError<typeof UserDeclinedErrorCode, 'User declined'>;
