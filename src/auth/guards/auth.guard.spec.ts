import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";


describe('AuthGuard test suite', () => {

    let guard: AuthGuard;

    const jwtServiceMock = {
        verifyAsync: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        guard = new AuthGuard(jwtServiceMock as any);
    });

    it('Must return true with a valid token', () => {

        const token = 'Bearer 34wertayuifsaf8asfas8f'
        
        const mockWellContext = () =>
            ({
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {
                            authorization: token,
                        },
                    }),
                }),
            }) as unknown as ExecutionContext;

        const canActivate = guard.canActivate(mockWellContext());
        expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token.replace('Bearer ', ''));
        expect(canActivate).toBeTruthy();
    });


    it('Must not to add the user again into the Request if this exists', () => {

        const token = 'Bearer 34wertayuifsaf8asfas8f'
        
        const mockWellContext = () =>
            ({
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {
                            authorization: token,
                        },
                        user: jwtServiceMock.verifyAsync.mockResolvedValue(token)
                    }),
                }),
            }) as unknown as ExecutionContext;

        const canActivate = guard.canActivate(mockWellContext());
        expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token.replace('Bearer ', ''));
        expect(canActivate).toBeTruthy();
    });

    it('Must throw Unauthorized Exception when the the token is not Bearer', async () => {

        const mockWrongContext = () =>
            ({
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {
                            authorization: 'NonBearer 34wertayuifsaf8asfas8f',
                        },
                    }),
                }),
            }) as unknown as ExecutionContext;

        const canActivate = guard.canActivate(mockWrongContext());
        await expect(canActivate).rejects.toThrow(UnauthorizedException);
    });

    it('Must throw Unauthorized Exception when the the token is not in headers', async () => {

        const mockWithoutTokenContext = () =>
            ({
                switchToHttp: () => ({
                    getRequest: () => ({
                        headers: {},
                    }),
                }),
            }) as unknown as ExecutionContext;

        const canActivate = guard.canActivate(mockWithoutTokenContext());
        await expect(canActivate).rejects.toThrow(UnauthorizedException);
    });

    it('Must throw Unauthorized Exception when the headers doesn\'t exists', async () => {

        const mockWithoutHeadersContext = () =>
            ({
                switchToHttp: () => ({
                    getRequest: () => ({}),
                }),
            }) as unknown as ExecutionContext;

        const canActivate = guard.canActivate(mockWithoutHeadersContext());
        await expect(canActivate).rejects.toThrow(UnauthorizedException);
    });
});