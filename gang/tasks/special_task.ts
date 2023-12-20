import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class SpecialTask extends Task {
    static unassigned(ns: NS): SpecialTask {
        return new SpecialTask(ns, "Unassigned")
    }

    static vigilanteJustice(ns: NS): SpecialTask {
        return new SpecialTask(ns, "Vigilante Justice")
    }

    static territoryWarfare(ns: NS): SpecialTask {
        return new SpecialTask(ns, "Territory Warfare")
    }

    static getAll(ns: NS): Array<SpecialTask> {
        return [
            SpecialTask.unassigned(ns),
            SpecialTask.vigilanteJustice(ns)
        ];
    }
}