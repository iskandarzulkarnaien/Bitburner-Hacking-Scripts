import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    const host = String(ns.args[0]);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await ns.hack(host);
        await ns.weaken(host);
        await ns.grow(host);
    }
}