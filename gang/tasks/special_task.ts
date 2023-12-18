import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class SpecialTask extends Task {
    static unassigned(ns: NS) {
        return new SpecialTask(ns, "Unassigned")
    }

    static vigilanteJustice(ns: NS) {
        return new SpecialTask(ns, "Vigilante Justice")
    }

    static territoryWarfare(ns: NS) {
        return new SpecialTask(ns, "Territory Warfare")
    }
}