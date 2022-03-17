import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);
      // chỗ này lấy cái token trong header.authorization để lấy user_id trong đó ra check vs db , có thì return true ngược lại là false
        return ctx.getContext().req;
    }
}
