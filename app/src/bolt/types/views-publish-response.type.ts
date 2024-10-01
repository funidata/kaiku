import { AllMiddlewareArgs } from "@slack/bolt";

// Not exported from @slack/bolt...
export type ViewsPublishResponse = ReturnType<AllMiddlewareArgs["client"]["views"]["publish"]>;
