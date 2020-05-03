import { 
    Injectable,
    Inject,
    Logger, 
    NotFoundException, 
    ForbiddenException, 
    ConflictException
} from '@nestjs/common';
import * as Bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { JwtBlacklistService } from '../jwt/jwt-blacklist.service';
import { JwtPlayload } from '../jwt/interfaces/jwt-playload.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtModule } from 'src/jwt/jwt.module';

export interface Ret {code:number, data:string}

const uuidv4 = require('uuid/v4');

@Injectable()
export class AuthService {
    private readonly logger:Logger;
    constructor(
        private readonly userService:UserService,
        private readonly jwtBlacklistService:JwtBlacklistService,
        @Inject("JWT_TOKEN_DURATION") private readonly jwtDuration:number,
        @Inject("JWT_RSA_PRIVATEKEY") private readonly privateKey:string,
        @Inject("JWT_RSA_PUBLICKEY") private readonly publicKey:string) {
        this.logger = new Logger("AuthService");
    }

    async getToken(email:string, status:string= ""):Promise<string> {
        const payload:JwtPlayload = { email, status };
        return jwt.sign(payload, this.privateKey , {
            algorithm:"RS512",
            expiresIn:this.jwtDuration,
            jwtid:uuidv4()
        });
    }

    logout(token:string):void {
        this.jwtBlacklistService.addToken(token);
    }

    async register(createUserDto:CreateUserDto):Promise<string> {
        createUserDto.email = createUserDto.email.toUpperCase();
        createUserDto.firstName = createUserDto.firstName.toUpperCase();
        createUserDto.lastName = createUserDto.lastName.toUpperCase();
        createUserDto.password = await Bcrypt.hash(createUserDto.password, 10);
        let user = await this.userService.findByEmail(createUserDto.email);
        if (user) {
            this.logger.error(`Tried to register with already exist email [${createUserDto.email}]`);
            throw new ConflictException(`Email [${createUserDto.email}] already in use`);
        }

        user = await this.userService.create({
            ...createUserDto,
            status:'student-extern'
        });
        return this.getToken(user.email, user.status);
    }

    async login(loginDto:LoginDto) {
        loginDto.email = loginDto.email.toUpperCase();
        const user = await this.userService.findByEmail(loginDto.email);

        if (!user)
            throw new NotFoundException();

        const equals = await Bcrypt.compare(loginDto.password, user.password);

        if (!equals)
            throw new ForbiddenException();

        return this.getToken(user.email, user.status);
    }

    async refresh(token:string, user:User):Promise<string> {
        this.logger.log(`Refresh token did for user ${user.email}`);
        this.jwtBlacklistService.addToken(token);
        return this.getToken(user.email, user.status);
    }

    async checkToken(token:string):Promise<boolean> {
        if (!this.jwtBlacklistService.valideToken(token))
            return false;

        const options = { algorithms:["RS512"] } as jwt.VerifyOptions;
        try {
            await jwt.verify(token, this.publicKey, options);
            return true;
        } catch(e) {
            return false;
        }
    }
}