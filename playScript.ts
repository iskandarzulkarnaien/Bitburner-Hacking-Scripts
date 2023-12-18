import { NS } from "@ns";
import { execMaxOn, getMaxMoneyHost } from "./lib/helpers";

const malware = '/malware/hackScript.js'

export async function main(ns: NS) {
    let host = 'domain';
    ns.killall(host)
    runMalware(ns, host)

    let i = 0;
    while (i < 24) {
        host = 'domain-' + String(i)
        ns.killall(host)
        runMalware(ns, host)
        i++;
    }
}

function runMalware(ns: NS, server: string) {
    let target = getMaxMoneyHost(ns)
    if (!target) target = 'omega-net'

    execMaxOn(ns, server, malware, target)
}