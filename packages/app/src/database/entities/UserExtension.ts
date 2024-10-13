import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserExtension<META extends object, DATA extends object> {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: META) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as META,
    },
  })
  meta: META;

  @OneToMany(() => UserExtensionItem, (item) => item.userExtension)
  items: UserExtensionItem<META, DATA>[];
}

@Entity()
export class UserExtensionItem<T extends object, I extends object> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserExtension, (userExtension) => userExtension.items)
  userExtension: UserExtension<T, I>;

  @Column({
    type: 'text',
    transformer: {
      to: (value: I) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as I,
    },
  })
  data: I;
}

@Entity()
export class UserWidget<T extends object, I extends object> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserExtensionItem, (item) => item.userExtension)
  @JoinColumn()
  userExtensionItem: UserExtensionItem<T, I>;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;
}
