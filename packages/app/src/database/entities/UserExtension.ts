import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Config<T> {
  @PrimaryColumn()
  key: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: T) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as T,
    },
  })
  value: T;
}

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
  items: Relation<UserExtensionItem<META, DATA>[]>;
}

@Entity()
export class UserExtensionItem<T extends object, I extends object> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserExtension, (userExtension) => userExtension.items)
  userExtension: Relation<UserExtension<T, I>>;

  @OneToOne(() => UserWidget, (widget) => widget.userExtensionItem)
  @JoinColumn({ name: 'widget_id' })
  widget: Relation<UserWidget<T, I>>;

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

  @OneToOne(() => UserExtensionItem, (item) => item.widget)
  @JoinColumn({ name: 'extension_item_id' })
  userExtensionItem: Relation<UserExtensionItem<T, I>>;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;
}
