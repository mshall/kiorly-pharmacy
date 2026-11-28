import { type ArgumentMetadata, type PipeTransform } from "@nestjs/common";
export declare function containsNul(value: unknown, depth?: number): boolean;
export declare class RejectNulBytesPipe implements PipeTransform {
    transform(value: unknown, meta: ArgumentMetadata): unknown;
}
