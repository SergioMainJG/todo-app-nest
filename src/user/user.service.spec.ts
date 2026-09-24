import { UserService } from "./user.service";

describe('User Service test suit', () => {

    let service: UserService;

    const prismaMock = {
        users: {
            findFirst: vi.fn(),
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        service = new UserService(
            prismaMock as any
        );
    });

    describe('findOne use cases', () => {
        it('Must return a user when the user exists and the credential is correct (fullName)', async () => {
            const credential = 'Test User';
            
            const user = {
                id: 1,
                fullName: credential,
                email: 'test@testing.com',
                password_hash: 'password_hash',
                todos: [],
            };

            prismaMock.users.findFirst.mockResolvedValue(user);

            const result = await service.findOne(credential);

            expect(prismaMock.users.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {fullName: credential},
                        {email: credential}
                    ],
                },
                include: {
                    todos: true
                },
            });
            expect(result).toEqual(user);
        });

        it('Must return a user when the user exists and the credential is correct (email)', async () => {
            const credential = 'test@testing.com';
            
            const user = {
                id: 1,
                fullName: 'Test User',
                email: credential,
                password_hash: 'password_hash',
                todos: [],
            };

            prismaMock.users.findFirst.mockResolvedValue(user);

            const result = await service.findOne(credential);

            expect(prismaMock.users.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {fullName: credential},
                        {email: credential}
                    ],
                },
                include: {
                    todos: true
                },
            });
            expect(result).toEqual(user);
        });

        it('Must return a user as null when the user doesn\'t exists and the credential is correct (email)', async () => {
            const credential = 'test@testing.com';
            
            const user = null
            prismaMock.users.findFirst.mockResolvedValue(null);

            const result = await service.findOne(credential);

            expect(prismaMock.users.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {fullName: credential},
                        {email: credential}
                    ],
                },
                include: {
                    todos: true
                },
            });
            expect(result).toEqual(user);
        });
    });
});