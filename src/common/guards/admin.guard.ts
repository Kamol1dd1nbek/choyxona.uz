import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        if ( !authHeader ) throw new UnauthorizedException({message: "The user is not registered"});
        const [bearer, token] = authHeader.split(" ");
        if ( bearer !== "Bearer" || !token ) throw new UnauthorizedException({message: "The user is not registered"})
        let user: any;
        try {
            user = this.jwtService.verify(token, {secret: process.env.ACCESS_TOKEN_KEY})
        } catch (error) {
            throw new UnauthorizedException({message: "The user is not registered"});
        }
        if ( !user.is_admin ) throw new UnauthorizedException({message: "The user is not admin"})
        return true
    }
}