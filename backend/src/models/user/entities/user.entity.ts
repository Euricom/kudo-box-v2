import { Kudo } from '../../kudo/entities/kudo.entity';
import { Event } from '../../event/entities/event/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string;
  @Column()
  firstname?: string;
  @Column()
  lastname?: string;
  @Column()
  email?: string;

  @OneToMany(() => Event, (event) => event.host)
  events?: Event[];
  @OneToMany(() => Kudo, (kudo) => kudo.sender)
  sentKudos?: Kudo[];
  @OneToMany(() => Kudo, (kudo) => kudo.receiver)
  receivedKudos?: Kudo[];

  constructor(
    id?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    events?: Event[],
    sentKudos?: Kudo[],
    receivedKudos?: Kudo[],
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.events = events;
    this.sentKudos = sentKudos;
    this.receivedKudos = receivedKudos;
  }
}
