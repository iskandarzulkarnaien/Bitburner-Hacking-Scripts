import { NS } from "@ns";
import { Task } from "/gang/tasks/task";

export class TrainingTask extends Task {
    static trainCombat(ns: NS) {
        return new TrainingTask(ns, "Train Combat")
    }

    static trainHacking(ns: NS) {
        return new TrainingTask(ns, "Train Hacking")
    }

    static trainCharisma(ns: NS) {
        return new TrainingTask(ns, "Train Charisma")
    }
}