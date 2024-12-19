import { AllMiddlewareArgs } from "@slack/bolt";

// Not exported from @slack/bolt...
export type Member = Awaited<
  ReturnType<AllMiddlewareArgs["client"]["users"]["list"]>
>["members"][0];
