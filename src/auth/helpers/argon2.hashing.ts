import { ConfigService } from "@nestjs/config";


export class Argon2Hashing {

    private static readonly configService = new ConfigService(); 

    public static hashPassword = async ( content: string ) => await Bun.password.hash(content, {
        algorithm: 'argon2id',
        memoryCost: parseInt(this.configService.getOrThrow<string>('HASH_MEMORY_COST')),
        timeCost: parseInt(this.configService.getOrThrow<string>('HASH_TIME_COST')),
    });

    public static verifyPassword = async (
        password: string, hash: string
    ) => await Bun.password.verify(password, hash, 'argon2id');
}