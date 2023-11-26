import { NS } from "@ns";

export async function main(ns: NS) {
    const host = String(ns.args[0]);
    ns.print(`Running moneyScript on: ${host}`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await ns.hack(host);
        await ns.weaken(host);
        await ns.grow(host);
    }
}