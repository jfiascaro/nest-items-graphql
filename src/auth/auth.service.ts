import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput, SignupInput } from './dto';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    // Token Payload
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.userService.create(signupInput);
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.userService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Password Incorrecto');
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user.isActive) {
      throw new UnauthorizedException('USER_IS_NOT_ACTIVE');
    }
    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }
}
