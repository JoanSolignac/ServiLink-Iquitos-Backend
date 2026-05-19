import { Global, Module } from "@nestjs/common";
import { IdGenerator } from "../../domain/id/ports/id-generator.abstract";
import { UuidV7IdGenerator } from "./generators/uuid-v7-id.generator";

@Global()
@Module({
    providers: [
        {
            provide: IdGenerator,
            useClass: UuidV7IdGenerator,
        }
    ],
    exports: [IdGenerator],
})
export class IdModule {}