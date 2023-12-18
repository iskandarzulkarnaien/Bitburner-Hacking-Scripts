import { NS } from "@ns";
import { getNumExecutableThreads } from "./lib/helpers";

const malware = '/malware/share.js'

export async function main(ns: NS) {
    const host = ns.getServer().hostname
    ns.exec(malware, host, getNumExecutableThreads(ns, host, malware))
}
