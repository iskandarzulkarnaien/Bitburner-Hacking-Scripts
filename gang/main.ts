import { NS } from "@ns";
import { Gang } from "/gang/gang";


/** @param {NS} ns */
export async function main(ns: NS) {
    // Load all existing members
    const gang = new Gang(ns).init();

    // Perform actions
    // eslint-disable-next-line no-constant-condition
    while (true) {
        gang.execAllMembers()
        gang.upgradeGang()
        await ns.gang.nextUpdate()
    }
}
