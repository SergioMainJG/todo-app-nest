import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Argon2Hashing } from './helpers/argon2.hashing'

describe('AuthService test suite', () => {
    
    let service: AuthService;
    const prismaMock = {
        users: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    };

    const userServiceMock = {
        findOne: vi.fn(),
    };

    vi.mock('./helpers/argon2.hashing',() => ({
        Argon2Hashing: {
            hashPassword: vi.fn(),
            verifyPassword: vi.fn(),
        }
    }));


    beforeEach(() => {
        vi.clearAllMocks();
        service = new AuthService(
            prismaMock as any,
            userServiceMock as any,
        );
    });


    describe('Register User use case', () => {
        it('Must register a valid user', async () => {
            const dto = {email: 'test@test.com', fullName: 'Test User', password: "!Testing12345!"};
            const userDto = RegisterUserDto.assert(dto);

            const createdUser = {
                id: 1,
                email: userDto.email,
                fullName: userDto.fullName,
                password_hash: 'hashed-password',
            };

            userServiceMock.findOne.mockResolvedValue(null);
            prismaMock.users.create.mockResolvedValue(createdUser)
            vi.mocked(Argon2Hashing.hashPassword).mockResolvedValue(createdUser.password_hash);

            const result = await service.register(userDto);

            expect(result).toEqual(createdUser);
            expect(prismaMock.users.create).toHaveBeenCalledWith({
                data: {
                    email: userDto.email,
                    fullName: userDto.fullName,
                    password_hash: createdUser.password_hash,
                }
            });
            expect(Argon2Hashing.hashPassword).toHaveBeenCalledWith(userDto.password);
        });

        it('Must throw a Conflict Exception when a user with that email alreay exists', async() => {
            const dto = {email: 'test@test.com', fullName: 'Test User', password: "!Testing12345!"};
            const userDto = RegisterUserDto.assert(dto);
            
            const user = {
                id: 1,
                ...userDto,
                fullName: 'No soy Test User',
                password_hash: 'hashed-password',
            }

            userServiceMock.findOne.mockResolvedValue(user);

            await expect( service.register(userDto) ).rejects.toThrow(ConflictException);

        });

       it('Must throw a Conflict Exception when a user with that fullName alreay exists', async() => {
            const dto = {email: 'test@test.com', fullName: 'Test User', password: "!Testing12345!"};
            const userDto = RegisterUserDto.assert(dto);
            
            const user = {
                id: 1,
                ...userDto,
                email: 'goky@assf.com',
                password_hash: 'hashed-password',
            }

            userServiceMock.findOne.mockResolvedValue(user);
            
            await expect( service.register(userDto) ).rejects.toThrow(ConflictException);

        });
    });

    describe('Login User use case', () => {

        it('Must login correctly a user when it exists and credentials are correct', async ()=>{
            const dto = {email: 'test@test.com', password:'!Test12345!'};
            const userDto = LoginUserDto.assert(dto);
            
            const user = {
                id: 1,
                email: userDto.email,
                fullName: 'Test User',
                password_hash: 'hashed-password',
            }

            prismaMock.users.findUnique.mockResolvedValue(user);
            vi.mocked(Argon2Hashing.verifyPassword).mockResolvedValue(true);

            const result = await service.login(userDto);

            expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
                where: { email: userDto.email }
            });
            expect(Argon2Hashing.verifyPassword).toHaveBeenCalledWith(userDto.password, user.password_hash);
            expect(result).toEqual(user);
        });

        it('Must throw Unauthorized Exception when the email is not registered',  async () => {
            const dto = {email: 'test@test.com', password:'!Test12345!'};
            const userDto = LoginUserDto.assert(dto);

            prismaMock.users.findUnique.mockResolvedValue(null);

            await expect( service.login(userDto) ).rejects.toThrow(UnauthorizedException);
        });

        it('Must throw Unauthorized Exception when the email is good but the password is not correct',  async () => {
            const dto = {email: 'test@test.com', password:'!Test12345!'};
            const userDto = LoginUserDto.assert(dto);

            const user = {
                id: 1,
                ...userDto,
                password_hash: 'hashed-password',
            }

            prismaMock.users.findUnique.mockResolvedValue(user);
            vi.mocked(Argon2Hashing.verifyPassword).mockResolvedValue(false);

            await expect( service.login(userDto) ).rejects.toThrow(UnauthorizedException);
        });
    });
});