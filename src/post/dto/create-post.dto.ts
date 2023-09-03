import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: "My first post" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: "Assalamu aleykum, It is my first post in choyxona.uz." })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: "#masjid" })
    @IsNotEmpty()
    @IsString()
    tags: string;
}
