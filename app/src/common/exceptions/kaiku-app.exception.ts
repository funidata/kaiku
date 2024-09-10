import { HttpException } from "@nestjs/common";

/**
 * Generic exception that other custom exceptions should extend.
 */
export class KaikuAppException extends HttpException {}
