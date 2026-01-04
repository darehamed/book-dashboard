import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, Int } from "@nestjs/graphql";

// This decorator makes it available as a GraphQL type
@ObjectType()
// This decorator makes it a database entity
@Entity()
export class Book {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;
}
