import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageInGroupDto {
    @ApiProperty({ example: "Assalomu aleykum", description: "Message text" })
    @IsNotEmpty()
    @IsString()
    text: string;
}
