import { AllMiddlewareArgs } from "@slack/bolt";

// Not exported from @slack/bolt...
export type UserGroup = Awaited<
  ReturnType<AllMiddlewareArgs["client"]["usergroups"]["list"]>
>["usergroups"][0];
