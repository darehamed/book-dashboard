import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { expressjwt } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Convert the execution context to GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Check if we have an authorization header
    if (!request.headers.authorization) {
      throw new UnauthorizedException("No authorization token provided");
    }

    try {
      // Validate the JWT token using Auth0's public keys
      // This verifies that the token is valid and hasn't been tampered with
      const checkJwt = expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        }) as any,
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      });

      // Wrap the JWT check in a promise since it's callback-based
      // We create a mock response object since we only need the middleware to validate
      const mockResponse: any = {
        status: () => mockResponse,
        json: () => mockResponse,
        send: () => mockResponse,
      };

      await new Promise((resolve, reject) => {
        checkJwt(request, mockResponse, (err: any) => {
          if (err) {
            console.error("JWT validation error:", err.message);
            reject(err);
          } else {
            resolve(true);
          }
        });
      });

      return true;
    } catch (error: any) {
      console.error("Auth error:", error.message);
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
