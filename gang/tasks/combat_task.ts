import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class CombatTask extends Task {
    static mugPeople(ns: NS) {
        return new CombatTask(ns, "Mug People") 
    }

    static dealDrugs(ns: NS) {
        return new CombatTask(ns, "Deal Drugs")
    }

    static strongarmCivilians(ns: NS) {
        return new CombatTask(ns, "Strongarm Civilians")
    }

    static runACon(ns: NS) {
        return new CombatTask(ns, "Run a Con")
    }

    static armedRobbery(ns: NS) {
        return new CombatTask(ns, "Armed Robbery")
    }

    static traffickIllegalArms(ns: NS) {
        return new CombatTask(ns, "Traffick Illegal Arms")
    }

    static threatenAndBlackmail(ns: NS) {
        return new CombatTask(ns, "Threaten & Blackmail")
    }

    static humanTrafficking(ns: NS) {
        return new CombatTask(ns, "Human Trafficking")
    }

    static terrorism(ns: NS) {
        return new CombatTask(ns, "Terrorism")
    }
}