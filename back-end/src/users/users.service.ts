import { Injectable, OnModuleInit, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Seed default users if table is empty
    const count = await this.usersRepository.count();
    if (count === 0) {
      console.log('Populando banco com usuários padrão...');

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash('senha123', salt);

      const professor = this.usersRepository.create({
        username: 'professor',
        password: hashedPassword,
        role: 'professor',
      });

      const aluno = this.usersRepository.create({
        username: 'aluno',
        password: hashedPassword,
        role: 'aluno',
      });

      await this.usersRepository.save([professor, aluno]);
      console.log(
        'Usuários padrão criados: professor/senha123 e aluno/senha123',
      );
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Nome de usuário já está em uso');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      role: 'aluno',
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
