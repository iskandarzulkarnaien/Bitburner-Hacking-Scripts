import { methodNotImplemented } from "/lib/error_messages";

export abstract class Name {
    static generate(): string {
        throw new Error(methodNotImplemented(Name.constructor.name, Name.generate.name))
    }

    /**
     * Method to update the name based on various conditions (e.g. rank) or have names that "glitch out"
     */
    abstract updateName(...params: Array<unknown>): string

    protected abstract constructName(): string
}