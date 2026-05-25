export abstract class HashService {
  abstract hash(value: string): Promise<string>;
  abstract validate(value: string, hashedValue: string): Promise<boolean>;
}
