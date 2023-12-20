import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class CombatTask extends Task {
    static mugPeople(ns: NS): CombatTask {
        return new CombatTask(ns, "Mug People") 
    }

    static dealDrugs(ns: NS): CombatTask {
        return new CombatTask(ns, "Deal Drugs")
    }

    static strongarmCivilians(ns: NS): CombatTask {
        return new CombatTask(ns, "Strongarm Civilians")
    }

    static runACon(ns: NS): CombatTask {
        return new CombatTask(ns, "Run a Con")
    }

    static armedRobbery(ns: NS): CombatTask {
        return new CombatTask(ns, "Armed Robbery")
    }

    static traffickIllegalArms(ns: NS): CombatTask {
        return new CombatTask(ns, "Traffick Illegal Arms")
    }

    static threatenAndBlackmail(ns: NS): CombatTask {
        return new CombatTask(ns, "Threaten & Blackmail")
    }

    static humanTrafficking(ns: NS): CombatTask {
        return new CombatTask(ns, "Human Trafficking")
    }

    static terrorism(ns: NS): CombatTask {
        return new CombatTask(ns, "Terrorism")
    }

    static getAll(ns: NS): Array<Task> {
        return [
            CombatTask.mugPeople(ns),
            CombatTask.dealDrugs(ns),
            CombatTask.strongarmCivilians(ns),
            CombatTask.runACon(ns),
            CombatTask.armedRobbery(ns),
            CombatTask.traffickIllegalArms(ns),
            CombatTask.threatenAndBlackmail(ns),
            CombatTask.humanTrafficking(ns),
            CombatTask.terrorism(ns)
        ]
    }
}