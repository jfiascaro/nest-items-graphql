import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullname: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  //@Field(()=>String) (No se realizarán queries sobre el password)
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  // TODO: Relaciones y otras cosas...
}
