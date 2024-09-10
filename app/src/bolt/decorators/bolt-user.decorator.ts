import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const BoltUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(data);
  console.log(request);
  return request.user;
});
