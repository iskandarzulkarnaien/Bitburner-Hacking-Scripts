import { NS } from "@ns";
import { Gang } from "gang/gang/gang";


/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL')

    ns.tail()

    // Load all existing members
    const gang = new Gang(ns).init();

    // Perform actions
    // eslint-disable-next-line no-constant-condition
    while (true) {
        gang.recruitMember()
        gang.taskAllMembersBestTask()
        gang.ascendGang()
        gang.upgradeGang()
        await ns.gang.nextUpdate()
    }
}
